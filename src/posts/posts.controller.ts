import {
	Body,
	Controller,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Query,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { type QueryRunner as QR } from 'typeorm';
import { AccessTokenGuard } from '~auth/guards/bearer-token.guard';
import { QueryRunner } from '~common/decorators/query-runner.decorator';
import { EImagesModelType } from '~common/entity/images.entity';
import { LogInterceptor } from '~common/interceptors/log.interceptor';
import { TransactionInterceptor } from '~common/interceptors/transaction.interceptor';
import { CreatePostDto } from '~posts/dtos/create-post.dto';
import { PaginatePostDto } from '~posts/dtos/paginte-post.dto';
import { PostDto } from '~posts/dtos/post.dto';
import { UpdatePostDto } from '~posts/dtos/update-post.dto';
import { PostsImagesService } from '~posts/image/posts-images.service';
import { PostsService } from '~posts/posts.service';
import { User } from '~users/decorators/user.decorator';
import { UserDto } from '~users/dtos/user.dto';

@ApiTags('POSTS')
@Controller('posts')
export class PostsController {
	constructor(
		private readonly postsService: PostsService,
		private readonly postsImagesService: PostsImagesService,
	) {}

	// POST /posts/random
	@Post('random')
	@UseGuards(AccessTokenGuard)
	async postPostsRandom(@User() user: UserDto) {
		await this.postsService.generatePosts(user.id);

		return true;
	}

	@ApiOperation({ summary: 'Post 생성' })
	@ApiOkResponse({ type: () => PostDto })
	@Post()
	@UseGuards(AccessTokenGuard)
	@UseInterceptors(TransactionInterceptor)
	async postPosts(
		@User('id') userId: number,
		@Body() body: CreatePostDto,
		@QueryRunner() qr: QR,
	) {
		// 이미지가 없는 상태로 post 생성
		const post = await this.postsService.createPost(userId, body, qr);

		for (let i = 0; i < body.images.length; i++) {
			await this.postsImagesService.createImage(
				{
					post,
					order: i,
					path: body.images[i],
					type: EImagesModelType.POST_IMAGE,
				},
				qr,
			);
		}

		return this.postsService.getPostById(post.id, qr);
	}

	@ApiOperation({ summary: 'Post 가져오기 (Query String)' })
	@Get()
	@UseInterceptors(LogInterceptor)
	getPosts(@Query() query: PaginatePostDto) {
		return this.postsService.paginatePosts(query);
	}

	@ApiOperation({ summary: 'Post 가져오기 (id)' })
	@Get(':id')
	getPost(@Param('id', ParseIntPipe) id: number) {
		return this.postsService.getPostById(id);
	}

	@ApiOperation({ summary: 'Post 수정하기 (postId)' })
	@Patch(':postId')
	patchPost(@Param('postId', ParseIntPipe) id: number, @Body() body: UpdatePostDto) {
		return this.postsService.updatePost(id, body);
	}
}

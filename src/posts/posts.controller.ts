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
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessTokenGuard } from '~auth/guards/bearer-token.guard';
import { CreatePostDto } from '~posts/dtos/create-post.dto';
import { PaginatePostDto } from '~posts/dtos/paginte-post.dto';
import { PostDto } from '~posts/dtos/post.dto';
import { UpdatePostDto } from '~posts/dtos/update-post.dto';
import { PostsModel } from '~posts/entities/posts.entity';
import { PostsService } from '~posts/posts.service';
import { User } from '~users/decorators/user.decorator';
import { UserDto } from '~users/dtos/user.dto';

@ApiTags('POSTS')
@Controller('posts')
export class PostsController {
	constructor(
		private readonly postsService: PostsService,
		@InjectRepository(PostsModel)
		private readonly postsRepository: Repository<PostsModel>,
	) {}
	// POST /posts/random
	@Post('random')
	@UseGuards(AccessTokenGuard)
	async postPostsRandom(@User() user: UserDto) {
		await this.postsService.generatePosts(user.id);

		return true;
	}

	@ApiOperation({ summary: '포스트 생성' })
	@ApiOkResponse({ type: () => PostDto })
	@Post()
	@UseGuards(AccessTokenGuard)
	async postPosts(@User('id') userId: number, @Body() body: CreatePostDto) {
		return this.postsService.createPost(userId, body);
	}

	@ApiOperation({ summary: 'Post 가져오기 (Query String)' })
	@Get()
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

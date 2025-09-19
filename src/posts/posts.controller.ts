import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '~auth/guards/bearer-token.guard';
import { CreatePostDto } from '~posts/dtos/create-post.dto';
import { PostResponseDto } from '~posts/dtos/post-response.dto';
import { PostsService } from '~posts/posts.service';
import { User } from '~users/decorators/user.decorator';

@ApiTags('POSTS')
@Controller('posts')
export class PostsController {
	constructor(private readonly postsService: PostsService) {}

	@ApiOperation({ summary: '포스트 생성' })
	@ApiOkResponse({ type: () => PostResponseDto })
	@Post()
	@UseGuards(AccessTokenGuard)
	async postPosts(@User('id') userId: number, @Body() body: CreatePostDto) {
		return this.postsService.createPost(userId, body);
	}

	@ApiOperation({ summary: 'Post 가져오기 (id)' })
	@Get(':id')
	getPost(@Param('id', ParseIntPipe) id: number) {
		return this.postsService.getPostById(id);
	}
}

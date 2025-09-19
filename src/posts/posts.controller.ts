import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PostsModel } from '~posts/entities/posts.entity';
import { PostsService } from '~posts/posts.service';

@ApiTags('POSTS')
@Controller('posts')
export class PostsController {
	constructor(private readonly postsService: PostsService) {}

	@ApiResponse({
		type: PostsModel,
		status: 200,
		description: '성공',
	})
	@ApiResponse({
		status: 400,
		description: '실패',
	})
	@ApiOperation({ summary: '로그인' })
	@Get(':id')
	getPost(@Param('id', ParseIntPipe) id: number) {
		return this.postsService.getPostById(id);
	}
}

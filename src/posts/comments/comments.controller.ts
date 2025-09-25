import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Query,
	UseInterceptors,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { type QueryRunner } from 'typeorm';
import { IsPublic } from '~common/decorators/is-public.decorator';
import { Runner } from '~common/decorators/query-runner.decorator';
import { TransactionInterceptor } from '~common/interceptors/transaction.interceptor';
import { CommentsService } from '~posts/comments/comments.service';
import { CreateCommentDto } from '~posts/comments/dtos/create-comment.dto';
import { PaginateCommentDto } from '~posts/comments/dtos/paginate-comment.dto';
import { UpdateCommentsDto } from '~posts/comments/dtos/update-comment.dto';
import { PostsService } from '~posts/posts.service';
import { User } from '~users/decorators/user.decorator';
import { UsersModel } from '~users/entity/users.entity';

@Controller('posts/:postId/comments')
export class CommentsController {
	constructor(
		private readonly commentsService: CommentsService,
		private readonly postsService: PostsService,
	) {}

	@ApiOperation({ summary: 'Comment 생성하기' })
	@Post()
	@UseInterceptors(TransactionInterceptor)
	async postComment(
		@Param('postId', ParseIntPipe) postId: number,
		@Body() body: CreateCommentDto,
		@User() user: UsersModel,
		@Runner() qr: QueryRunner,
	) {
		const comment = await this.commentsService.createComment(body, postId, user, qr);

		await this.postsService.incrementCommentCount(postId, qr);

		return comment;
	}

	@ApiOperation({ summary: 'Comments 가져오기 (Query String)' })
	@Get()
	@IsPublic()
	getComments(@Query() query: PaginateCommentDto, @Param('postId', ParseIntPipe) postId: number) {
		return this.commentsService.paginteComments(query, postId);
	}

	@ApiOperation({ summary: 'Comment 가져오기 (ID)' })
	@Get(':commentId')
	@IsPublic()
	getComment(@Param('commentId', ParseIntPipe) commentId: number) {
		return this.commentsService.getCommentById(commentId);
	}

	@ApiOperation({ summary: 'Comment 수정하기 (ID)' })
	@Patch(':commentId')
	async patchComment(
		@Param('commentId', ParseIntPipe) commentId: number,
		@Body() body: UpdateCommentsDto,
	) {
		return this.commentsService.updateComment(body, commentId);
	}

	@ApiOperation({ summary: 'Comment 삭제하기 (ID)' })
	@Delete(':commentId')
	@UseInterceptors(TransactionInterceptor)
	async deleteComment(
		@Param('commentId', ParseIntPipe) commentId: number,
		@Param('postId', ParseIntPipe) postId: number,
		@Runner() qr: QueryRunner,
	) {
		const result = await this.commentsService.deleteComment(commentId, qr);

		await this.postsService.decrementCommentCount(postId, qr);

		return result;
	}
}

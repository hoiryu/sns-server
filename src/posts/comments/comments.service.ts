import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { CommonService } from '~common/common.service';
import { DEFAULT_COMMENT_FIND_OPTIONS } from '~posts/comments/consts/default-comment-find-options.const';
import { CreateCommentDto } from '~posts/comments/dtos/create-comment.dto';
import { PaginateCommentDto } from '~posts/comments/dtos/paginate-comment.dto';
import { UpdateCommentsDto } from '~posts/comments/dtos/update-comment.dto';
import { CommentsModel } from '~posts/comments/entity/comments.entity';
import { UsersModel } from '~users/entity/users.entity';

@Injectable()
export class CommentsService {
	constructor(
		@InjectRepository(CommentsModel)
		private readonly commentsRepository: Repository<CommentsModel>,
		private readonly commonService: CommonService,
	) {}

	/**
	 * Comment 생성하기
	 * @parma dto CreateCommentDto
	 * @param postId post.id
	 * @param author UsersModel
	 * @param qr QueryRunner
	 */
	async createComment(
		dto: CreateCommentDto,
		postId: number,
		author: UsersModel,
		qr?: QueryRunner,
	) {
		const repository = this.commonService.getRepository(
			CommentsModel,
			this.commentsRepository,
			qr,
		);

		return repository.save({
			...dto,
			post: {
				id: postId,
			},
			author,
		});
	}

	/**
	 * Comments 가져오기 (Query String)
	 * @Description dto.page 가 있을 경우 Page Paginate, dto.page 가 없을 경우 Cursor Paginate
	 * @param dto PaginateCommentDto
	 * @param postId post.id
	 */
	paginteComments(dto: PaginateCommentDto, postId: number) {
		return this.commonService.paginate(
			dto,
			this.commentsRepository,
			{
				where: {
					post: {
						id: postId,
					},
				},
				...DEFAULT_COMMENT_FIND_OPTIONS,
			},
			`posts/${postId}/comments`,
		);
	}

	/**
	 * Comment 가져오기 (ID)
	 * @param id comment.id
	 */
	async getCommentById(commentId: number) {
		const comment = await this.commentsRepository.findOne({
			...DEFAULT_COMMENT_FIND_OPTIONS,
			where: {
				id: commentId,
			},
		});

		if (!comment)
			throw new BadRequestException(`Comment 가 존재하지 않습니다. id: ${commentId}`);

		return comment;
	}

	/**
	 * Comment 수정하기
	 * @param dto UpdateCommentsDto
	 * @param commentId comment.id
	 */
	async updateComment(dto: UpdateCommentsDto, commentId: number) {
		const comment = await this.commentsRepository.findOne({
			where: {
				id: commentId,
			},
		});

		if (!comment) {
			throw new BadRequestException(`Comment 가 존재하지 않습니다. id: ${commentId}`);
		}

		const updatedComment = await this.commentsRepository.preload({
			id: commentId,
			...dto,
		});

		if (!updatedComment)
			throw new BadRequestException(`이전 Comment 는 존재하지 않습니다. id: ${commentId}`);

		const newComment = await this.commentsRepository.save(updatedComment);

		return newComment;
	}

	/**
	 * Comment 삭제하기
	 * @param commentId comment.id
	 * @param qr QueryRunner
	 */
	async deleteComment(commentId: number, qr?: QueryRunner) {
		const repository = this.commonService.getRepository(
			CommentsModel,
			this.commentsRepository,
			qr,
		);

		const comment = await repository.findOne({
			where: {
				id: commentId,
			},
		});

		if (!comment) {
			throw new BadRequestException(`존재하지 않는 댓글입니다. commentId: ${commentId}`);
		}

		await repository.delete(commentId);

		return commentId;
	}

	/**
	 * 작성자와 Comment 가 일치하는지 체크
	 * @param userId user.id
	 * @param commentId comment.id
	 */
	async isCommentMine(userId: number, commentId: number) {
		return this.commentsRepository.exists({
			where: {
				id: commentId,
				author: {
					id: userId,
				},
			},
			relations: {
				author: true,
			},
		});
	}
}

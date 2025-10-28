import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { CommonService } from '~common/common.service';
import { PostsModel } from '~posts/entity/posts.entity';
import { PostLikesModel } from '~posts/post-likes/entity/post-likes.entity';

@Injectable()
export class PostLikesService {
	constructor(
		@InjectRepository(PostsModel)
		private readonly postsRepository: Repository<PostsModel>,
		@InjectRepository(PostLikesModel)
		private readonly postLikesRepository: Repository<PostLikesModel>,
		private readonly commonService: CommonService,
	) {}

	/**
	 * Post 좋아요 추가하기
	 * @param postId post.id
	 * @param userId user.id
	 * @param qr QueryRunner
	 * @return boolean
	 */
	async likePost(postId: number, userId: number, qr?: QueryRunner) {
		const postLikesRepository = this.commonService.getRepository(
			PostLikesModel,
			this.postLikesRepository,
			qr,
		);

		const postsRepository = this.commonService.getRepository(
			PostsModel,
			this.postsRepository,
			qr,
		);

		const existingPost = await postsRepository.exists({
			where: {
				id: postId,
			},
		});

		if (!existingPost) throw new NotFoundException(`존재하지 않습니다. (postId: ${postId})`);

		const postLike = await postLikesRepository.upsert(
			{
				post: {
					id: postId,
				},
				user: {
					id: userId,
				},
			},
			{ conflictPaths: ['post', 'user'], skipUpdateIfNoValuesChanged: true },
		);

		if (postLike.raw.length > 0)
			await postsRepository.increment(
				{
					id: postId,
				},
				'likeCount',
				1,
			);

		return true;
	}

	/**
	 * Post 좋아요 삭제하기
	 * @param postId post.id
	 * @param userId user.id
	 * @param qr QueryRunner
	 * @return boolean
	 */
	async unlikePost(postId: number, userId: number, qr?: QueryRunner) {
		const postLikesRepository = this.commonService.getRepository(
			PostLikesModel,
			this.postLikesRepository,
			qr,
		);

		const postsRepository = this.commonService.getRepository(
			PostsModel,
			this.postsRepository,
			qr,
		);

		const existingPost = await postsRepository.exists({
			where: {
				id: postId,
			},
		});

		if (!existingPost) throw new NotFoundException(`존재하지 않습니다. (postId: ${postId})`);

		const postLike = await postLikesRepository.findOne({
			where: {
				post: {
					id: postId,
				},
			},
		});

		if (!postLike)
			throw new NotFoundException(`존재하지 않습니다. (postLike 의 postId: ${postId})`);

		const deletedPostLike = await postLikesRepository.delete(postLike.id);

		if (deletedPostLike.affected && deletedPostLike.affected > 0)
			await postsRepository.decrement(
				{
					id: postId,
				},
				'likeCount',
				1,
			);

		return true;
	}
}

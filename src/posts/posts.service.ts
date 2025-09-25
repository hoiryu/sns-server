import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { CommonService } from '~common/common.service';
import { DEFAULT_POST_FIND_OPTIONS } from '~posts/consts/default-post-find-options.const';
import { CreatePostDto } from '~posts/dtos/create-post.dto';
import { PaginatePostDto } from '~posts/dtos/paginte-post.dto';
import { UpdatePostDto } from '~posts/dtos/update-post.dto';
import { PostsModel } from '~posts/entity/posts.entity';

@Injectable()
export class PostsService {
	constructor(
		@InjectRepository(PostsModel)
		private readonly postsRepository: Repository<PostsModel>,
		private readonly commonService: CommonService,
	) {}

	/**
	 * 테스트용 Seeding
	 * @param userId user.id
	 */
	async generatePosts(userId: number) {
		for (let i = 0; i < 100; i++) {
			await this.createPost(userId, {
				content: `임의로 생성된 포스트 내용 ${i}`,
				images: [],
			});
		}
	}

	/**
	 * Post 가 존재하는지 체크
	 * @param id post.id
	 * @return boolean
	 */
	async checkPostExistsById(id: number) {
		return this.postsRepository.exists({
			where: {
				id,
			},
		});
	}

	/**
	 * Post 생성하기
	 * @param authorId user.id
	 * @param dto CreatePostDto
	 * @param qr QueryRunner
	 */
	async createPost(authorId: number, dto: CreatePostDto, qr?: QueryRunner) {
		const repository = this.commonService.getRepository(PostsModel, this.postsRepository, qr);

		const post = repository.create({
			author: {
				id: authorId,
			},
			...dto,
			images: [],
			likeCount: 0,
			commentCount: 0,
		});

		const newPost = await repository.save(post);

		return newPost;
	}

	/**
	 * Posts 가져오기 (Query String)
	 * @Description dto.page 가 있을 경우 Page Paginate, dto.page 가 없을 경우 Cursor Paginate
	 * @param dto PaginatePostDto
	 */
	async paginatePosts(dto: PaginatePostDto) {
		return this.commonService.paginate(
			dto,
			this.postsRepository,
			{
				...DEFAULT_POST_FIND_OPTIONS,
			},
			'posts',
		);
	}

	/**
	 * Post 가져오기 (ID)
	 * @param id post.id
	 * @param qr QueryRunner
	 */
	async getPostById(id: number, qr?: QueryRunner) {
		const repository = this.commonService.getRepository(PostsModel, this.postsRepository, qr);
		const post = await repository.findOne({
			...DEFAULT_POST_FIND_OPTIONS,
			where: {
				id,
			},
		});
		if (!post) throw new NotFoundException();

		return post;
	}

	/**
	 * Post 수정하기 (ID)
	 * @param id post.id
	 * @param dto UpdatePostDto
	 */
	async updatePost(id: number, dto: UpdatePostDto) {
		const { content } = dto;
		const post = await this.postsRepository.findOne({
			where: {
				id,
			},
		});
		if (!post) throw new NotFoundException();

		if (content) post.content = content;

		const newPost = await this.postsRepository.save(post);

		return newPost;
	}

	/**
	 * commentCount 증가하기
	 * @param postId post.id
	 * @param qr QueryRunner
	 */
	async incrementCommentCount(postId: number, qr?: QueryRunner) {
		const repository = this.commonService.getRepository(PostsModel, this.postsRepository, qr);

		await repository.increment(
			{
				id: postId,
			},
			'commentCount',
			1,
		);
	}

	/**
	 * commentCount 감소하기
	 * @param postId post.id
	 * @param qr QueryRunner
	 */
	async decrementCommentCount(postId: number, qr?: QueryRunner) {
		const repository = this.commonService.getRepository(PostsModel, this.postsRepository, qr);

		await repository.decrement(
			{
				id: postId,
			},
			'commentCount',
			1,
		);
	}

	/**
	 * Post 삭제하기
	 * @param postId post.id
	 */
	async deletePost(id: number) {
		const post = await this.postsRepository.findOne({
			where: {
				id,
			},
		});

		if (!post) {
			throw new NotFoundException(`Post 를 찾을 수 없습니다. id: ${id}`);
		}

		await this.postsRepository.delete(id);

		return id;
	}

	/**
	 * 작성자와 Post 가 일치하는지 체크
	 * @param userId user.id
	 * @param postId post.id
	 */
	async isPostMine(userId: number, postId: number) {
		return this.postsRepository.exists({
			where: {
				id: postId,
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

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommonService } from '~common/common.service';
import { DEFAULT_POST_FIND_OPTIONS } from '~posts/constants/default-post-find-options.const';
import { CreatePostDto } from '~posts/dtos/create-post.dto';
import { PaginatePostDto } from '~posts/dtos/paginte-post.dto';
import { UpdatePostDto } from '~posts/dtos/update-post.dto';
import { PostsModel } from '~posts/entities/posts.entity';

@Injectable()
export class PostsService {
	constructor(
		@InjectRepository(PostsModel)
		private readonly postsRepository: Repository<PostsModel>,
		private readonly commonService: CommonService,
	) {}
	/**
	 * 테스트용
	 * @param userId user 의 id
	 */
	async generatePosts(userId: number) {
		for (let i = 0; i < 100; i++) {
			await this.createPost(userId, {
				content: `임의로 생성된 포스트 내용 ${i}`,
			});
		}
	}

	async createPost(authorId: number, postDto: CreatePostDto) {
		const post = this.postsRepository.create({
			author: {
				id: authorId,
			},
			...postDto,
			likeCount: 0,
			commentCount: 0,
		});

		const newPost = await this.postsRepository.save(post);

		return newPost;
	}

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

	async getPostById(id: number) {
		const post = await this.postsRepository.findOne({
			where: {
				id,
			},
		});
		if (!post) throw new NotFoundException();

		return post;
	}

	async updatePost(postId: number, postDto: UpdatePostDto) {
		const { content } = postDto;
		const post = await this.postsRepository.findOne({
			where: {
				id: postId,
			},
		});
		if (!post) throw new NotFoundException();

		if (content) post.content = content;

		const newPost = await this.postsRepository.save(post);

		return newPost;
	}
}

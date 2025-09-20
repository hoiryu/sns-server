import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from '~posts/dtos/create-post.dto';
import { UpdatePostDto } from '~posts/dtos/update-post.dto';
import { PostsModel } from '~posts/entities/posts.entity';

@Injectable()
export class PostsService {
	constructor(
		@InjectRepository(PostsModel)
		private readonly postsRepository: Repository<PostsModel>,
	) {}

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

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostsModel } from '~posts/entities/posts.entity';

@Injectable()
export class PostsService {
	constructor(
		@InjectRepository(PostsModel)
		private readonly postsRepository: Repository<PostsModel>,
	) {}

	getPosts() {}

	async getPostById(id: number) {
		const post = await this.postsRepository.findOne({
			where: {
				id,
			},
		});

		if (!post) throw new NotFoundException();

		return post;
	}
}

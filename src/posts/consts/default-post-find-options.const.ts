import { FindManyOptions } from 'typeorm';
import { PostsModel } from '~posts/entity/posts.entity';

export const DEFAULT_POST_FIND_OPTIONS: FindManyOptions<PostsModel> = {
	relations: {
		author: true,
		images: true,
		postLikes: true,
	},
	select: {
		postLikes: {
			user: true,
		},
	},
};

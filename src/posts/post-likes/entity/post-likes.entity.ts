import { BaseModel } from 'src/common/entity/base.entity';
import { Entity, ManyToOne, RelationId, Unique } from 'typeorm';
import { PostsModel } from '~posts/entity/posts.entity';
import { UsersModel } from '~users/entity/users.entity';

@Entity()
@Unique('post_likes_post_user', ['post', 'user'])
export class PostLikesModel extends BaseModel {
	@ManyToOne(() => PostsModel, post => post.postLikes, {
		onDelete: 'CASCADE',
		nullable: false,
	})
	post: PostsModel;

	@RelationId((postLike: PostLikesModel) => postLike.post)
	postId: number;

	@ManyToOne(() => UsersModel, user => user.postLikes, {
		onDelete: 'CASCADE',
		nullable: false,
	})
	user: UsersModel;

	@RelationId((postLike: PostLikesModel) => postLike.user)
	userId: number;
}

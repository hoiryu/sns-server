import { IsNumber, IsString } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseModel } from '~common/entity/base.entity';
import { PostsModel } from '~posts/entity/posts.entity';
import { UsersModel } from '~users/entity/users.entity';

@Entity()
export class CommentsModel extends BaseModel {
	@ManyToOne(() => UsersModel, user => user.comments)
	author: UsersModel;

	@ManyToOne(() => PostsModel, post => post.comments)
	post: PostsModel;

	@Column()
	@IsString()
	comment: string;

	@Column({
		default: 0,
	})
	@IsNumber()
	likeCount: number;
}

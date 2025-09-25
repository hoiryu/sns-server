import { IsNumber, IsString } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseModel } from '~common/entity/base.entity';
import { stringValidationMessage } from '~common/validation-message/string-validation.message';
import { PostsModel } from '~posts/entity/posts.entity';
import { UsersModel } from '~users/entity/users.entity';

@Entity()
export class CommentsModel extends BaseModel {
	@ManyToOne(() => UsersModel, user => user.comments)
	author: UsersModel;

	@ManyToOne(() => PostsModel, post => post.comments)
	post: PostsModel;

	@Column()
	@IsString({ message: stringValidationMessage })
	comment: string;

	@Column({
		default: 0,
	})
	@IsNumber()
	likeCount: number;
}

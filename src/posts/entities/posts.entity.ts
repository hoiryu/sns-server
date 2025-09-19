import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseModel } from '~common/entities/base.entity';
import { UsersModel } from '~users/entities/users.entity';

@Entity()
export class PostsModel extends BaseModel {
	@ManyToOne(() => UsersModel, user => user.posts, {
		nullable: false,
	})
	author: UsersModel;

	@Column()
	title: string;

	@Column()
	content: string;

	@Column()
	likeCount: string;

	@Column()
	commentCount: string;
}

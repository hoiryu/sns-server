import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PostsModel } from '~posts/entities/posts.entity';
import { ERoles } from '~users/constants/roles.constant';

@Entity()
export class UsersModel {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ length: 30 })
	name: string;

	@Column({ unique: true, length: 20 })
	nickname: string;

	@Column({ unique: true })
	email: string;

	@Column({ select: false })
	password: string;

	@Column({
		enum: Object.values(ERoles),
		default: ERoles.USER,
	})
	role: ERoles;

	@OneToMany(() => PostsModel, post => post.author)
	posts: PostsModel[];
}

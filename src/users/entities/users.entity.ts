import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseModel } from '~common/entities/base.entity';
import { PostsModel } from '~posts/entities/posts.entity';
import { ERoles } from '~users/constants/roles.constant';

@Entity()
export class UsersModel extends BaseModel {
	@ApiProperty({ description: '실명' })
	@Column({ length: 20 })
	name: string;

	@ApiProperty({ description: '별명' })
	@Column({ unique: true, length: 20 })
	nickname: string;

	@ApiProperty({ description: '이메일' })
	@Column({ unique: true })
	email: string;

	@ApiProperty({ enum: ERoles, example: ERoles.USER, description: '권한' })
	@Column({
		enum: Object.values(ERoles),
		default: ERoles.USER,
	})
	role: ERoles;

	@ApiHideProperty()
	@Column()
	password: string;

	@ApiHideProperty()
	@OneToMany(() => PostsModel, post => post.author)
	posts: PostsModel[];
}

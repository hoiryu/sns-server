import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseModel } from '~common/entities/base.entity';
import { UsersModel } from '~users/entities/users.entity';

@Entity()
export class PostsModel extends BaseModel {
	@ManyToOne(() => UsersModel, user => user.posts, {
		nullable: false,
	})
	author: UsersModel;

	@ApiProperty({
		example: 'content',
		description: '포스트 내용',
	})
	@IsString({
		message: 'Content must be a string.',
	})
	@Column()
	content: string;

	@ApiProperty({
		description: '좋아요 갯수',
	})
	@Column()
	likeCount: number;

	@ApiProperty({
		description: '코멘트 갯수',
	})
	@Column()
	commentCount: number;
}

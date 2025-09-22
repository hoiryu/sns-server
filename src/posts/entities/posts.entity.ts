import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseModel } from '~common/entities/base.entity';
import { stringValidationMessage } from '~common/validation-message/string-validation.message';
import { UsersModel } from '~users/entities/users.entity';

@Entity()
export class PostsModel extends BaseModel {
	@ManyToOne(() => UsersModel, user => user.posts, {
		nullable: false,
	})
	author: UsersModel;

	@ApiProperty({ example: '포스트 본문입니다.', description: '포스트 본문' })
	@IsString({ message: stringValidationMessage })
	@Column()
	content: string;

	@ApiProperty({ example: '/image.jpg', description: '포스트 본문의 이미지' })
	@Column({
		nullable: true,
	})
	image?: string;

	@ApiProperty({ description: '좋아요 갯수' })
	@Column()
	likeCount: number;

	@ApiProperty({ description: '코멘트 갯수' })
	@Column()
	commentCount: number;
}

import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsEmail, IsString, Length } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseModel } from '~common/entities/base.entity';
import { emailValidationMessage } from '~common/validation-message/email-validation.message';
import { lengthValidationMessage } from '~common/validation-message/length-validation.message';
import { stringValidationMessage } from '~common/validation-message/string-validation.message';
import { PostsModel } from '~posts/entities/posts.entity';
import { ERoles } from '~users/constants/roles.constant';

@Entity()
export class UsersModel extends BaseModel {
	@ApiProperty({ example: '김아무개', description: '실명' })
	@IsString({ message: stringValidationMessage })
	@Column({ length: 20 })
	name: string;

	@ApiProperty({ example: '테스트', description: '별명' })
	@IsString({ message: stringValidationMessage })
	@Length(1, 20, { message: lengthValidationMessage })
	@Column({ unique: true, length: 20 })
	nickname: string;

	@ApiProperty({ example: 'test@gmail.com', description: '이메일' })
	@IsString({ message: stringValidationMessage })
	@IsEmail({}, { message: emailValidationMessage })
	@Column({ unique: true })
	email: string;

	@ApiProperty({ enum: ERoles, example: ERoles.USER, description: '권한' })
	@Column({ enum: Object.values(ERoles), default: ERoles.USER })
	role: ERoles;

	@ApiHideProperty()
	@Column()
	@Exclude({
		toPlainOnly: true,
	})
	password: string;

	@ApiHideProperty()
	@OneToMany(() => PostsModel, post => post.author)
	posts: PostsModel[];
}

import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsEmail, IsString, Length } from 'class-validator';
import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { ChatsModel } from '~chats/entity/chats.entity';
import { MessagesModel } from '~chats/messages/entity/messages.entity';
import { BaseModel } from '~common/entities/base.entity';
import { emailValidationMessage } from '~common/validation-message/email-validation.message';
import { lengthValidationMessage } from '~common/validation-message/length-validation.message';
import { stringValidationMessage } from '~common/validation-message/string-validation.message';
import { PostsModel } from '~posts/entity/posts.entity';
import { ERoles } from '~users/constants/roles.constant';

@Entity()
export class UsersModel extends BaseModel {
	@ApiProperty({ title: '실명', example: '김아무개' })
	@IsString({ message: stringValidationMessage })
	@Column({ length: 20 })
	name: string;

	@ApiProperty({ title: '별명', example: '아무무' })
	@Column({ unique: true, length: 20 })
	@IsString({ message: stringValidationMessage })
	@Length(1, 20, { message: lengthValidationMessage })
	nickname: string;

	@ApiProperty({ title: '이메일', example: 'test@gmail.com' })
	@Column({ unique: true })
	@IsString({ message: stringValidationMessage })
	@IsEmail({}, { message: emailValidationMessage })
	email: string;

	@ApiProperty({ title: '권한', enum: ERoles, example: ERoles.USER })
	@Column({ enum: Object.values(ERoles), default: ERoles.USER })
	role: ERoles;

	@ApiHideProperty()
	@Column()
	@Exclude({
		toPlainOnly: true,
	})
	password: string;

	@OneToMany(() => PostsModel, post => post.author)
	posts: PostsModel[];

	@ManyToMany(() => ChatsModel, chat => chat.users)
	chats: ChatsModel[];

	@OneToMany(() => MessagesModel, message => message.author)
	messages: MessagesModel;
}

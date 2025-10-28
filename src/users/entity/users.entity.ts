import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsEmail, IsString, Length } from 'class-validator';
import { Column, Entity, ManyToMany, OneToMany, OneToOne } from 'typeorm';
import { ChatsModel } from '~chats/entity/chats.entity';
import { MessagesModel } from '~chats/messages/entity/messages.entity';
import { BaseModel } from '~common/entity/base.entity';
import { emailValidationMessage } from '~common/validation-message/email-validation.message';
import { lengthValidationMessage } from '~common/validation-message/length-validation.message';
import { stringValidationMessage } from '~common/validation-message/string-validation.message';
import { CommentsModel } from '~posts/comments/entity/comments.entity';
import { PostsModel } from '~posts/entity/posts.entity';
import { PostLikesModel } from '~posts/post-likes/entity/post-likes.entity';
import { ERoles } from '~users/consts/roles.const';
import { UserFollowersModel } from '~users/user-followers/entity/user-followers.entity';
import { UserProfilesModel } from '~users/user-profiles/entity/user-profiles.entity';

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

	@OneToOne(() => UserProfilesModel, profile => profile.user, {
		cascade: true, // user 저장 시 profile 도 함께 저장
	})
	profile: UserProfilesModel;

	@OneToMany(() => PostsModel, post => post.author)
	posts: PostsModel[];

	@OneToMany(() => PostLikesModel, postLikes => postLikes.user)
	postLikes: PostLikesModel[];

	@ManyToMany(() => ChatsModel, chat => chat.users)
	chats: ChatsModel[];

	@OneToMany(() => MessagesModel, message => message.author)
	messages: MessagesModel;

	@OneToMany(() => CommentsModel, comment => comment.author)
	comments: CommentsModel[];

	@OneToMany(() => UserFollowersModel, userFollower => userFollower.follower)
	followers: UserFollowersModel[];

	@OneToMany(() => UserFollowersModel, userFollower => userFollower.following)
	following: UserFollowersModel[];

	@Column({
		default: 0,
	})
	followerCount: number;

	@Column({
		default: 0,
	})
	followingCount: number;
}

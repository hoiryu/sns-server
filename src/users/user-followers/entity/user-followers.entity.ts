import { BaseModel } from 'src/common/entity/base.entity';
import { Check, Column, Entity, ManyToOne, Unique } from 'typeorm';
import { UsersModel } from '~users/entity/users.entity';

@Entity()
@Unique('user_followers_follower_following', ['follower', 'following'])
@Check(`"followerId" <> "followingId"`)
export class UserFollowersModel extends BaseModel {
	@ManyToOne(() => UsersModel, user => user.followers, {
		onDelete: 'CASCADE',
		nullable: false,
	})
	follower: UsersModel;

	@ManyToOne(() => UsersModel, user => user.following, {
		onDelete: 'CASCADE',
		nullable: false,
	})
	following: UsersModel;

	@Column({
		default: false,
	})
	isConfirmed: boolean;
}

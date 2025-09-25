import { BaseModel } from 'src/common/entity/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { UsersModel } from '../../entity/users.entity';

@Entity()
export class UserFollowersModel extends BaseModel {
	@ManyToOne(() => UsersModel, user => user.followers)
	follower: UsersModel;

	@ManyToOne(() => UsersModel, user => user.following)
	following: UsersModel;

	@Column({
		default: false,
	})
	isConfirmed: boolean;
}

import { OmitType } from '@nestjs/swagger';
import { UsersModel } from '~users/entity/users.entity';

export class UserDto extends OmitType(UsersModel, [
	'password',
	'posts',
	'createdAt',
	'updatedAt',
]) {}

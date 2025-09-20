import { OmitType } from '@nestjs/swagger';
import { UsersModel } from '~users/entities/users.entity';

export class UserDto extends OmitType(UsersModel, [
	'password',
	'posts',
	'createdAt',
	'updatedAt',
]) {}

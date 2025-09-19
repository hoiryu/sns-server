import { PickType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { UsersModel } from '~users/entities/users.entity';

export class RegisterUserDto extends PickType(UsersModel, [
	'name',
	'nickname',
	'email',
	'password',
]) {
	@ApiProperty({
		example: '김아무개',
		description: '실명 (2~20자)',
		minLength: 2,
		maxLength: 20,
	})
	name: string;

	@ApiProperty({
		example: '돌고래',
		description: '별명 (2~20자)',
		minLength: 2,
		maxLength: 20,
	})
	nickname: string;

	@ApiProperty({
		example: 'test@example.com',
		description: '이메일',
		format: 'email',
	})
	email: string;

	@ApiProperty({
		example: '1q2w3e4r',
		description: '비밀번호',
		minLength: 8,
	})
	password: string;
}

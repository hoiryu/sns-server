import { ApiProperty, PickType } from '@nestjs/swagger';
import { UsersModel } from '~users/entities/users.entity';

export class RegisterUserDto extends PickType(UsersModel, ['nickname', 'email', 'password']) {
	@ApiProperty({
		example: 'hoiryu',
		description: '닉네임 (2~20자)',
		minLength: 2,
		maxLength: 20,
	})
	nickname: string;

	@ApiProperty({
		example: 'hoiryu@example.com',
		description: '로그인용 이메일',
		format: 'email',
	})
	email: string;

	@ApiProperty({
		example: 'P@ssw0rd!',
		description: '비밀번호 (영문/숫자/특수문자 조합)',
		minLength: 8,
	})
	password: string;
}

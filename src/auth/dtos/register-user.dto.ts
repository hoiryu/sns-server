import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
import { lengthValidationMessage } from '~common/validation-message/length-validation.message';
import { stringValidationMessage } from '~common/validation-message/string-validation.message';
import { UsersModel } from '~users/entities/users.entity';

export class RegisterUserDto extends PickType(UsersModel, ['name', 'nickname', 'email']) {
	@ApiProperty({ example: '1q2w3e4r', description: '비밀번호', minLength: 4, maxLength: 12 })
	@IsString({ message: stringValidationMessage })
	@Length(4, 12, { message: lengthValidationMessage })
	password: string;
}

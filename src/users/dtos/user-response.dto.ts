import { OmitType } from '@nestjs/swagger';
import { UsersModel } from '~users/entities/users.entity';

export class UserResponseDto extends OmitType(UsersModel, ['password', 'posts']) {}

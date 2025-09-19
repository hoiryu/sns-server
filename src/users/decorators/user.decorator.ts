import {
	ExecutionContext,
	InternalServerErrorException,
	createParamDecorator,
} from '@nestjs/common';
import { UsersModel } from '~users/entities/users.entity';

/**
 * Request 에서 User 추출
 * @return UserModel
 */
export const User = createParamDecorator(
	(data: keyof UsersModel | undefined, context: ExecutionContext) => {
		const req = context.switchToHttp().getRequest();

		const user = req.user as UsersModel;
		if (!user) throw new InternalServerErrorException('AccessTokenGuard 는 필수');

		if (data) return user[data];

		return user;
	},
);

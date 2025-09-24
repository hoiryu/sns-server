import {
	ExecutionContext,
	InternalServerErrorException,
	createParamDecorator,
} from '@nestjs/common';
import { UsersModel } from '~users/entity/users.entity';

/**
 * Request 에서 User 추출
 * @param key UserModel 의 key
 * @return UserModel or UserModel[data]
 */
export const User = createParamDecorator(
	(key: keyof UsersModel | undefined, context: ExecutionContext) => {
		const req = context.switchToHttp().getRequest();

		const user = req.user as UsersModel;
		if (!user) throw new InternalServerErrorException('AccessTokenGuard 는 필수');

		if (key) return user[key];

		return user;
	},
);

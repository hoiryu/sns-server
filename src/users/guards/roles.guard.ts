import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '~users/decorators/roles.decorator';

/**
 * user.role 에 따른 권한 처리
 */
@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const requiredRole = this.reflector.getAllAndOverride(ROLES_KEY, [
			context.getHandler(),
			context.getClass(),
		]);

		// Roles Annotation 미등록
		if (!requiredRole) return true;

		const { user } = context.switchToHttp().getRequest();

		if (!user) throw new UnauthorizedException(`토큰이 존재하지 않습니다.`);

		if (user.role !== requiredRole) {
			throw new ForbiddenException(
				`이 작업을 수행할 권한이 없습니다. ${requiredRole} 권한 필요`,
			);
		}

		return true;
	}
}

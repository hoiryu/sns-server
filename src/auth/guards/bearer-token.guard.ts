import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '~auth/auth.service';
import { IS_PUBLIC_KEY } from '~common/decorators/is-public.decorator';
import { UsersService } from '~users/users.service';

/**
 * Request 로 부터 Header 의 Bearer {token} 을 추출하여 인증 후 request.user 를 사용할 수 있게 전달
 * request.user user
 * request.token JWT Token
 * request.tokenType refresh or access
 * @return boolean
 */
@Injectable()
export abstract class BearerTokenGuard implements CanActivate {
	constructor(
		private readonly authService: AuthService,
		private readonly usersService: UsersService,
		private readonly reflector: Reflector,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass(),
		]);

		const req = context.switchToHttp().getRequest();

		if (isPublic) {
			req.isRoutePublic = true;
			return true;
		}

		const rawToken = req.headers['authorization'];
		if (!rawToken) throw new UnauthorizedException('토큰이 없습니다!');

		const token = this.authService.extractTokenFromHeader(rawToken, true);

		const verifedToken = await this.authService.verifyToken(token);

		const user = await this.usersService.getUserByEmail(verifedToken.email);

		req.user = user;

		req.token = token;

		req.tokenType = verifedToken.type;

		return true;
	}
}

/**
 * request.tokenType === 'access' 검증
 * @return boolean
 */
@Injectable()
export class AccessTokenGuard extends BearerTokenGuard {
	async canActivate(context: ExecutionContext): Promise<boolean> {
		await super.canActivate(context);

		const req = context.switchToHttp().getRequest();

		// 공개 Route 인지 체크
		if (req.isRoutePublic) return true;

		if (req.tokenType !== 'access')
			throw new UnauthorizedException('Access Token 이 아닙니다.');

		return true;
	}
}

/**
 * request.tokenType === 'refresh' 검증
 * @return boolean
 */
@Injectable()
export class RefreshTokenGuard extends BearerTokenGuard {
	async canActivate(context: ExecutionContext): Promise<boolean> {
		await super.canActivate(context);

		const req = context.switchToHttp().getRequest();

		// 공개 Route 인지 체크
		if (req.isRoutePublic) return true;

		if (req.tokenType !== 'refresh')
			throw new UnauthorizedException('Refresh Token이 아닙니다.');

		return true;
	}
}

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '~auth/auth.service';
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
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req = context.switchToHttp().getRequest();

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

		if (req.isRoutePublic) return true;

		if (req.tokenType !== 'refresh')
			throw new UnauthorizedException('Refresh Token이 아닙니다.');

		return true;
	}
}

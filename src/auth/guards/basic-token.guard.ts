import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '~auth/auth.service';

/**
 * Request 로 부터 Header 의 Basic {token} 을 추출하여 인증 후 request.user 를 사용할 수 있게 전달
 * @return Boolean 에 따라 요청 거절
 */
@Injectable()
export class BasicTokenGuard implements CanActivate {
	constructor(private readonly authService: AuthService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req = context.switchToHttp().getRequest();

		const rawToken = req.headers['authorization'];

		if (!rawToken) throw new UnauthorizedException('토큰이 없습니다');

		const token = this.authService.extractTokenFromHeader(rawToken, false);

		const { email, password } = this.authService.decodeBasicToken(token);

		const user = await this.authService.authenticateWithEmailAndPassword({
			email,
			password,
		});

		// req 에 user 등록
		req.user = user;

		return true;
	}
}

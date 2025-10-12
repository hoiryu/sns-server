import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from '~auth/auth.service';
import { RegisterUserDto } from '~auth/dtos/register-user.dto';
import { BasicTokenGuard } from '~auth/guards/basic-token.guard';
import { RefreshTokenGuard } from '~auth/guards/bearer-token.guard';
import { IsPublic } from '~common/decorators/is-public.decorator';

@ApiTags('AUTH')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@ApiOperation({ summary: '액세스 토큰 발급' })
	@Post('token/access')
	@IsPublic()
	@UseGuards(RefreshTokenGuard)
	postTokenAccess(@Headers('authorization') rawToken: string) {
		const token = this.authService.extractTokenFromHeader(rawToken, true);
		const newToken = this.authService.rotateToken(token, false);

		return {
			accessToken: newToken,
		};
	}

	@ApiOperation({ summary: '리프레쉬 토큰 발급' })
	@Post('token/refresh')
	@IsPublic()
	@UseGuards(RefreshTokenGuard)
	postTokenRefresh(@Headers('authorization') rawToken: string) {
		const token = this.authService.extractTokenFromHeader(rawToken, true);
		const newToken = this.authService.rotateToken(token, true);

		return {
			refreshToken: newToken,
		};
	}

	@ApiOperation({ summary: '유저 생성' })
	@Post('register/email')
	@IsPublic()
	async postRegisterEmail(@Body() body: RegisterUserDto) {
		return this.authService.registerWithEmail(body);
	}

	@ApiOperation({ summary: '유저 로그인' })
	@Post('signin/email')
	@IsPublic()
	@UseGuards(BasicTokenGuard)
	postSigninEmail(@Headers('authorization') rawToken: string) {
		// email:password -> base64 -> utf8 로 변환
		const token = this.authService.extractTokenFromHeader(rawToken, false);
		const credentials = this.authService.decodeBasicToken(token);
		return this.authService.signinWithEmail(credentials);
	}
}

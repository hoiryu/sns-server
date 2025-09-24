import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from '~auth/dtos/register-user.dto';
import { ENV_HASH_ROUNDS_KEY, ENV_JWT_SECRET_KEY } from '~common/consts/env-keys.const';
import { UsersModel } from '~users/entity/users.entity';
import { UsersService } from '~users/users.service';

@Injectable()
export class AuthService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly usersService: UsersService,
		private readonly configService: ConfigService,
	) {}

	/**
	 * email:password base64 -> object 형태의 string 으로 변환
	 * Basic
	 * @param base64String string
	 * @returns object email, password
	 */
	decodeBasicToken(base64String: string) {
		const decoded = Buffer.from(base64String, 'base64').toString('utf8');
		const split = decoded.split(':');
		if (split.length !== 2) throw new UnauthorizedException('잘못된 유형의 토큰입니다.');

		const email = split[0];
		const password = split[1];

		return {
			email,
			password,
		};
	}

	/**
	 * JWT 의 verify 로 Token 검증
	 * @param token
	 * @return token
	 */
	verifyToken(token: string) {
		try {
			return this.jwtService.verify(token, {
				secret: this.configService.get(ENV_JWT_SECRET_KEY),
			});
		} catch (e) {
			throw new UnauthorizedException('토큰이 만료됐거나 잘못된 토큰입니다.');
		}
	}

	/**
	 * JWT Token 재발급 token.type === 'refresh' 만 허용
	 * @param token JWT Token
	 * @param isRefreshToken JWT Token
	 * @return token
	 */
	rotateToken(token: string, isRefreshToken: boolean) {
		const decodedToken = this.jwtService.verify(token, {
			secret: this.configService.get(ENV_JWT_SECRET_KEY),
			complete: true,
		});

		/**
		 * sub: id
		 * email: email,
		 * type: 'access' | 'refresh'
		 */
		if (decodedToken.payload.type !== 'refresh')
			throw new UnauthorizedException('토큰 재발급은 Refresh 토큰으로만 가능합니다!');

		return this.signToken(
			{
				...decodedToken,
			},
			isRefreshToken,
		);
	}

	/**
	 * header authorization 에서 Token 만 추출
	 * @param header Header
	 * @param isBearer 검증용 Basic {token} Bearer {token}
	 * @returns token
	 */
	extractTokenFromHeader(header: string, isBearer: boolean) {
		const splitToken = header.split(' ');
		const prefix = isBearer ? 'Bearer' : 'Basic';

		if (splitToken.length !== 2 || splitToken[0] !== prefix)
			throw new UnauthorizedException('잘못된 토큰입니다!');

		const token = splitToken[1];

		return token;
	}

	/**
	 * JWT Token 생성
	 * return Token
	 */
	signToken(user: Pick<UsersModel, 'email' | 'id'>, isRefreshToken: boolean) {
		const payload = {
			email: user.email,
			sub: user.id,
			type: isRefreshToken ? 'refresh' : 'access',
		};

		return this.jwtService.sign(payload, {
			secret: this.configService.get(ENV_JWT_SECRET_KEY),
			expiresIn: isRefreshToken ? 3600 : 300,
		});
	}

	/**
	 * Access & Refresh Token 생성
	 */
	generateToken(user: Pick<UsersModel, 'email' | 'id'>) {
		return {
			accessToken: this.signToken(user, false),
			refreshToken: this.signToken(user, true),
		};
	}

	/**
	 * Email & Password 검증
	 * @param user object email, password
	 * @returns user
	 */
	async authenticateWithEmailAndPassword(user: Pick<UsersModel, 'email' | 'password'>) {
		const existingUser = await this.usersService.getUserByEmail(user.email);
		if (!existingUser) throw new UnauthorizedException('존재하지 않는 사용자입니다.');

		const isPass = await bcrypt.compare(user.password, existingUser.password);
		if (!isPass) throw new UnauthorizedException('비밀번호가 틀렸습니다.');

		return existingUser;
	}

	/**
	 * 검증 이후 Token 발행
	 */
	async signinWithEmail(user: Pick<UsersModel, 'email' | 'password'>) {
		const existingUser = await this.authenticateWithEmailAndPassword(user);

		return this.generateToken(existingUser);
	}

	/**
	 * Auth signin
	 */
	async registerWithEmail(user: RegisterUserDto) {
		const hash = await bcrypt.hash(
			user.password,
			Number(this.configService.get<number>(ENV_HASH_ROUNDS_KEY)),
		);

		const newUser = await this.usersService.createUser({
			...user,
			password: hash,
		});

		return this.signinWithEmail({
			...newUser,
			password: user.password,
		});
	}
}

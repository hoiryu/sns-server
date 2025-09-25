import {
	Controller,
	DefaultValuePipe,
	Delete,
	Get,
	Param,
	ParseBoolPipe,
	ParseIntPipe,
	Patch,
	Post,
	Query,
	UseInterceptors,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { type QueryRunner } from 'typeorm';
import { Runner } from '~common/decorators/query-runner.decorator';
import { TransactionInterceptor } from '~common/interceptors/transaction.interceptor';
import { ERoles } from '~users/consts/roles.const';
import { Roles } from '~users/decorators/roles.decorator';
import { User } from '~users/decorators/user.decorator';
import { UserDto } from '~users/dtos/user.dto';
import { UsersModel } from '~users/entity/users.entity';
import { UsersService } from '~users/users.service';

@ApiTags('USERS')
@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@ApiOperation({ summary: '모든 User 가져오기' })
	@ApiOkResponse({ type: () => UserDto, isArray: true })
	@Get()
	@Roles(ERoles.ADMIN)
	getUsers() {
		return this.usersService.getAllUsers();
	}

	@ApiOperation({ summary: '나의 Followers 가져오기' })
	@Get('follow/me')
	async getFollow(
		@User() user: UsersModel,
		@Query('includeNotConfirmed', new DefaultValuePipe(false), ParseBoolPipe)
		includeNotConfirmed: boolean,
	) {
		return this.usersService.getFollowers(user.id, includeNotConfirmed);
	}

	@ApiOperation({ summary: 'Follow 요청하기' })
	@Post('follow/:id')
	async postFollow(@User() user: UsersModel, @Param('id', ParseIntPipe) followingId: number) {
		await this.usersService.followUser(user.id, followingId);

		return true;
	}

	@ApiOperation({ summary: 'Following 승인하기' })
	@Patch('follow/:id/confirm')
	@UseInterceptors(TransactionInterceptor)
	async patchFollowConfirm(
		@User() user: UsersModel,
		@Param('id', ParseIntPipe) followerId: number,
		@Runner() qr: QueryRunner,
	) {
		await this.usersService.confirmFollow(followerId, user.id, qr);

		await this.usersService.incrementFollowerCount(user.id, qr);

		await this.usersService.incrementFollowingCount(followerId, qr);

		return true;
	}

	@ApiOperation({ summary: 'Follow 취소하기' })
	@Delete('follow/:id')
	@UseInterceptors(TransactionInterceptor)
	async deleteFollow(
		@User() user: UsersModel,
		@Param('id', ParseIntPipe) followingId: number,
		@Runner() qr: QueryRunner,
	) {
		await this.usersService.deleteFollow(user.id, followingId, qr);

		await this.usersService.decrementFollowerCount(followingId, qr);

		await this.usersService.decrementFollowingCount(user.id, qr);

		return true;
	}
}

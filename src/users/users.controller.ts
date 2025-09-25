import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ERoles } from '~users/consts/roles.const';
import { Roles } from '~users/decorators/roles.decorator';
import { UserDto } from '~users/dtos/user.dto';
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
}

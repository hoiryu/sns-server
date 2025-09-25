import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonService } from '~common/common.service';
import { UsersModel } from '~users/entity/users.entity';
import { UserFollowersModel } from '~users/user-followers/entity/user-followers.entity';
import { UsersController } from '~users/users.controller';
import { UsersService } from '~users/users.service';

@Module({
	imports: [TypeOrmModule.forFeature([UsersModel, UserFollowersModel])],
	exports: [UsersService],
	controllers: [UsersController],
	providers: [UsersService, CommonService],
})
export class UsersModule {}

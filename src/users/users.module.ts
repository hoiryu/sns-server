import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModel } from '~users/entity/users.entity';
import { UsersController } from '~users/users.controller';
import { UsersService } from '~users/users.service';

@Module({
	imports: [TypeOrmModule.forFeature([UsersModel])],
	exports: [UsersService],
	controllers: [UsersController],
	providers: [UsersService],
})
export class UsersModule {}

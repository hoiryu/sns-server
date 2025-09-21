import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '~auth/auth.module';
import { CommonModule } from '~common/common.module';
import { PostsModel } from '~posts/entities/posts.entity';
import { UsersModule } from '~users/users.module';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
	imports: [TypeOrmModule.forFeature([PostsModel]), AuthModule, UsersModule, CommonModule],
	exports: [PostsService],
	controllers: [PostsController],
	providers: [PostsService],
})
export class PostsModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '~auth/auth.module';
import { CommonModule } from '~common/common.module';
import { ImagesModel } from '~common/entity/images.entity';
import { PostsModel } from '~posts/entity/posts.entity';
import { PostsImagesService } from '~posts/image/posts-images.service';
import { UsersModule } from '~users/users.module';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([PostsModel, ImagesModel]),
		AuthModule,
		UsersModule,
		CommonModule,
	],
	exports: [PostsService],
	controllers: [PostsController],
	providers: [PostsService, PostsImagesService],
})
export class PostsModule {}

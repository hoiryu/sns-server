import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '~auth/auth.module';
import { CommonModule } from '~common/common.module';
import { ImagesModel } from '~common/entity/images.entity';
import { PostsModel } from '~posts/entity/posts.entity';
import { PostsImagesService } from '~posts/image/posts-images.service';
import { PostLikesModel } from '~posts/post-likes/entity/post-likes.entity';
import { PostLikesService } from '~posts/post-likes/post-likes.service';
import { UsersModule } from '~users/users.module';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([PostsModel, ImagesModel, PostLikesModel]),
		AuthModule,
		UsersModule,
		CommonModule,
	],
	exports: [PostsService],
	controllers: [PostsController],
	providers: [PostsService, PostsImagesService, PostLikesService],
})
export class PostsModule {}

import { BadRequestException, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import multer from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';
import { AuthModule } from '~auth/auth.module';
import { CommonModule } from '~common/common.module';
import { POST_IMAGE_PATH } from '~common/constants/path.const';
import { PostsModel } from '~posts/entities/posts.entity';
import { UsersModule } from '~users/users.module';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([PostsModel]),
		AuthModule,
		UsersModule,
		CommonModule,
		MulterModule.register({
			limits: {
				fileSize: 10000000,
			},
			fileFilter: (req, file, cb) => {
				// cb(Error, Boolean)
				const ext = extname(file.originalname);
				if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png')
					return cb(new BadRequestException('jpg/jpeg/png 만 Upload 가능'), false);

				return cb(null, true);
			},
			storage: multer.diskStorage({
				destination: (req, res, cb) => {
					cb(null, POST_IMAGE_PATH);
				},
				filename: (req, file, cb) => {
					cb(null, `${uuid()}${extname(file.originalname)}`);
				},
			}),
		}),
	],
	exports: [PostsService],
	controllers: [PostsController],
	providers: [PostsService],
})
export class PostsModule {}

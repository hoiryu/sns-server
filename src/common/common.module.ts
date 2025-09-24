import { BadRequestException, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import multer from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';
import { AuthModule } from '~auth/auth.module';
import { CommonController } from '~common/common.controller';
import { CommonService } from '~common/common.service';
import { TEMPLATES_FOLDER_PATH } from '~common/consts/path.const';
import { UsersModule } from '~users/users.module';
@Module({
	imports: [
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
					cb(null, TEMPLATES_FOLDER_PATH);
				},
				filename: (req, file, cb) => {
					cb(null, `${uuid()}${extname(file.originalname)}`);
				},
			}),
		}),
		AuthModule,
		UsersModule,
	],
	exports: [CommonService],
	controllers: [CommonController],
	providers: [CommonService],
})
export class CommonModule {}

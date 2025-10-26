import { BadRequestException, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import multer from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';
import { AuthController } from '~auth/auth.controller';
import { AuthService } from '~auth/auth.service';
import { ACCEPTED_IMAGE_TYPES } from '~common/consts/image.const';
import { USERS_IMAGE_PATH } from '~common/consts/path.const';
import { UsersModule } from '~users/users.module';

@Module({
	imports: [
		MulterModule.register({
			limits: {
				fileSize: 5000000, // 5MB
			},
			fileFilter: (req, file, cb) => {
				// cb(Error, Boolean)
				// 확장자만 전달 ex) .jpg
				const ext = extname(file.originalname);

				if (!ACCEPTED_IMAGE_TYPES.includes(ext))
					return cb(
						new BadRequestException(
							`${ACCEPTED_IMAGE_TYPES.join(', ')} 만 Upload 가능`,
						),
						false,
					);

				return cb(null, true);
			},
			storage: multer.diskStorage({
				destination: (req, res, cb) => {
					cb(null, USERS_IMAGE_PATH);
				},
				filename: (req, file, cb) => {
					cb(null, `${uuid()}${extname(file.originalname)}`);
				},
			}),
		}),
		JwtModule.register({}),
		UsersModule,
	],
	exports: [AuthService],
	controllers: [AuthController],
	providers: [AuthService],
})
export class AuthModule {}

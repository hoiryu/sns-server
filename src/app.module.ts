import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '~auth/auth.module';
import {
	ENV_DB_DATABASE_KEY,
	ENV_DB_HOST_KEY,
	ENV_DB_PASSWORD_KEY,
	ENV_DB_PORT_KEY,
	ENV_DB_USERNAME_KEY,
} from '~common/constants/env-keys.const';
import { PostsModel } from '~posts/entities/posts.entity';
import { PostsModule } from '~posts/posts.module';
import { AppController } from '~src/app.controller';
import { AppService } from '~src/app.service';
import { UsersModel } from '~users/entities/users.entity';
import { UsersModule } from '~users/users.module';
import { CommonModule } from './common/common.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: ['.env.local', '.env'],
		}),
		TypeOrmModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				type: 'postgres',
				host: configService.get(ENV_DB_HOST_KEY),
				port: configService.get<number>(ENV_DB_PORT_KEY),
				username: configService.get(ENV_DB_USERNAME_KEY),
				password: configService.get(ENV_DB_PASSWORD_KEY),
				database: configService.get(ENV_DB_DATABASE_KEY),
				entities: [PostsModel, UsersModel],
				synchronize: true,
			}),
		}),
		PostsModule,
		UsersModule,
		AuthModule,
		CommonModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_INTERCEPTOR, // Global Interceptor
			useClass: ClassSerializerInterceptor, // class-transformer 전역으로 적용
		},
	],
})
export class AppModule {}

import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '~auth/auth.module';
import { AccessTokenGuard } from '~auth/guards/bearer-token.guard';
import { ChatsModule } from '~chats/chats.module';
import { ChatsModel } from '~chats/entity/chats.entity';
import { MessagesModel } from '~chats/messages/entity/messages.entity';
import { CommonModule } from '~common/common.module';
import {
	ENV_DB_DATABASE_KEY,
	ENV_DB_HOST_KEY,
	ENV_DB_PASSWORD_KEY,
	ENV_DB_PORT_KEY,
	ENV_DB_USERNAME_KEY,
} from '~common/consts/env-keys.const';
import { PUBLIC_FOLDER_PATH } from '~common/consts/path.const';
import { ImagesModel } from '~common/entity/images.entity';
import { CommentsModule } from '~posts/comments/comments.module';
import { CommentsModel } from '~posts/comments/entity/comments.entity';
import { PostsModel } from '~posts/entity/posts.entity';
import { PostsModule } from '~posts/posts.module';
import { AppController } from '~src/app.controller';
import { AppService } from '~src/app.service';
import { UsersModel } from '~users/entity/users.entity';
import { RolesGuard } from '~users/guards/roles.guard';
import { UsersModule } from '~users/users.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: ['.env.local', '.env'],
		}),
		ServeStaticModule.forRoot({
			rootPath: PUBLIC_FOLDER_PATH, // Static File Serving
			serveRoot: '/public',
		}),
		TypeOrmModule.forRootAsync({
			// DB
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				type: 'postgres',
				host: configService.get(ENV_DB_HOST_KEY),
				port: configService.get<number>(ENV_DB_PORT_KEY),
				username: configService.get(ENV_DB_USERNAME_KEY),
				password: configService.get(ENV_DB_PASSWORD_KEY),
				database: configService.get(ENV_DB_DATABASE_KEY),
				entities: [
					PostsModel,
					UsersModel,
					ImagesModel,
					ChatsModel,
					MessagesModel,
					CommentsModel,
				],
				synchronize: true,
			}),
		}),
		CommonModule,
		AuthModule,
		PostsModule,
		UsersModule,
		ChatsModule,
		CommentsModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_INTERCEPTOR, // Global Interceptor
			useClass: ClassSerializerInterceptor, // class-transformer 전역으로 적용
		},
		{
			provide: APP_GUARD, // 전역으로 Token 적용
			useClass: AccessTokenGuard,
		},
		{
			provide: APP_GUARD, // 전역으로 Roles 적용
			useClass: RolesGuard,
		},
	],
})
export class AppModule {}

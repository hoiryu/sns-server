import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '~auth/auth.module';
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
			useFactory: (config: ConfigService) => ({
				type: 'postgres',
				host: config.get('DB_HOST', '127.0.0.1'),
				port: config.get<number>('DB_PORT', 5432),
				username: config.get('DB_USERNAME', 'postgres'),
				password: config.get('DB_PASSWORD'),
				database: config.get('DB_DATABASE', 'postgres'),
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
			provide: APP_INTERCEPTOR,
			useClass: ClassSerializerInterceptor,
		},
	],
})
export class AppModule {}

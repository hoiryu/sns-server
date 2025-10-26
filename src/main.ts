import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ENV_PORT_KEY } from '~common/consts/env-keys.const';
import { HttpExceptionFilter } from '~common/exception-filters/http.exception-filter';
import { AppModule } from '~src/app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	// CORS
	app.enableCors({
		origin: ['http://localhost:3000'],
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		allowedHeaders: 'Content-Type, Authorization',
		credentials: true,
	});

	// 전역으로 class-validator 적용
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			transformOptions: {
				enableImplicitConversion: true,
			},
			whitelist: true,
			forbidNonWhitelisted: true,
		}),
	);

	// 전역으로 ExceptionFilter 적용
	app.useGlobalFilters(new HttpExceptionFilter());

	const swaggerConfig = new DocumentBuilder()
		.setTitle('SNS')
		.setDescription('SNS 용 API 문서')
		.setVersion('1.0')
		.addTag('SNS')
		.build();
	const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig);
	SwaggerModule.setup('api', app, documentFactory);

	await app.listen(new ConfigService().get<number>(ENV_PORT_KEY)!);
}
bootstrap();

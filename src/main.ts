import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ENV_PORT_KEY } from '~common/constants/env-keys.const';
import { AppModule } from '~src/app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	// 전역으로 class-validator 적용
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			transformOptions: {
				enableImplicitConversion: true, // class validate 적용시 해당 Type 으로 자동 transpomer
			},
		}),
	);

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

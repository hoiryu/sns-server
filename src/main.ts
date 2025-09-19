import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '~src/app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	// 전역으로 class-validator 적용
	app.useGlobalPipes(new ValidationPipe());

	const swaggerConfig = new DocumentBuilder()
		.setTitle('SNS')
		.setDescription('SNS 용 API 문서')
		.setVersion('1.0')
		.addTag('SNS')
		.build();
	const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig);
	SwaggerModule.setup('api', app, documentFactory);

	await app.listen(process.env.PORT ?? 4000);
}
bootstrap();

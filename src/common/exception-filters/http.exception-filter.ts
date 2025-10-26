import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();

		const request = ctx.getRequest();

		const response = ctx.getResponse();

		const status = exception.getStatus();

		// 로그 파일 생성 or 에러 모니터링 시스템에 API 요청
		response.status(status).json({
			status,
			message: exception.message,
			timestamp: new Date().toLocaleString('ko-KR'),
			path: request.url,
		});
	}
}

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LogInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
		/**
		 * 요청이 들어올 때
		 * [REQ] {요청 path} {요청 시간}
		 *
		 * 응답이 나갈 때
		 * [RES] {요청 path} {응답 시간 - 요청 시간}
		 */
		const now = new Date();
		const req = context.switchToHttp().getRequest();
		const path = req.originalUrl;

		// [REQ] {요청 path} {요청 시간}
		console.log(`[REQ] ${path} ${now.toLocaleString('kr')}`);

		// return next.handle()을 실행하는 순간
		// 라우트의 로직이 전부 실행되고 응답이 observable 로 반환
		return next.handle().pipe(
			tap(
				// [RES] {요청 path} {응답 시간 - 요청 시간}
				observable =>
					console.log(
						`[RES] ${path} ${new Date().toLocaleString('kr')} ${new Date().getMilliseconds() - now.getMilliseconds()}ms`,
					),
			),
		);
	}
}

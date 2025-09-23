import {
	CallHandler,
	ExecutionContext,
	Injectable,
	InternalServerErrorException,
	NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, tap } from 'rxjs';
import { DataSource } from 'typeorm';

/**
 * QueryRunner 자동 생성
 * @param dataSource DataSource
 */
@Injectable()
export class TransactionInterceptor implements NestInterceptor {
	constructor(private readonly dataSource: DataSource) {}

	async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
		const req = context.switchToHttp().getRequest();
		const qr = this.dataSource.createQueryRunner();
		await qr.connect();
		await qr.startTransaction();
		// req 에 등록
		req.queryRunner = qr;

		return next.handle().pipe(
			catchError(async e => {
				await qr.rollbackTransaction();
				await qr.release();

				throw new InternalServerErrorException(e.message);
			}),
			tap(async () => {
				await qr.commitTransaction();
				await qr.release();
			}),
		);
	}
}

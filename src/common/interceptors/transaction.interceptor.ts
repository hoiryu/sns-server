import {
	CallHandler,
	ExecutionContext,
	Injectable,
	InternalServerErrorException,
	NestInterceptor,
} from '@nestjs/common';
import { promises } from 'fs';
import { join } from 'path';
import { catchError, Observable, tap } from 'rxjs';
import { DataSource } from 'typeorm';
import { USERS_IMAGE_PATH } from '~common/consts/path.const';

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
			catchError(async error => {
				await qr.rollbackTransaction();
				await qr.release();

				if (req.file) {
					const filePath = join(USERS_IMAGE_PATH, req.file.filename);

					try {
						await promises.unlink(filePath);
					} catch (e) {
						throw new InternalServerErrorException(
							`파일이 존재하지 않습니다. ${filePath}`,
						);
					}
				}

				throw error;
			}),
			tap(async () => {
				await qr.commitTransaction();
				await qr.release();
			}),
		);
	}
}

import {
	ExecutionContext,
	InternalServerErrorException,
	createParamDecorator,
} from '@nestjs/common';

/**
 * Request 에서 queryRunner 추출
 * @description TransactionInterceptor 필수
 */
export const Runner = createParamDecorator((data, context: ExecutionContext) => {
	const req = context.switchToHttp().getRequest();

	if (!req.queryRunner) {
		throw new InternalServerErrorException(
			`QueryRunner Decorator를 사용하려면 TransactionInterceptor 를 적용해야 합니다.`,
		);
	}

	return req.queryRunner;
});

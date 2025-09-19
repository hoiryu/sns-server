import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

/**
 * Pipe
 * @description Password 를 검증 후 String 으로 변환
 */
@Injectable()
export class PasswordPipe implements PipeTransform {
	transform(value: any, metadata: ArgumentMetadata) {
		const valueToString = value.toString();
		if (valueToString.length > 8)
			throw new BadRequestException('Password must be 8 characters or less');
		return valueToString;
	}
}

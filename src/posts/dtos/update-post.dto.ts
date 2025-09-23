import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { stringValidationMessage } from '~common/validation-message/string-validation.message';
import { CreatePostDto } from '~posts/dtos/create-post.dto';

export class UpdatePostDto extends PartialType(CreatePostDto) {
	@IsString({
		message: stringValidationMessage,
	})
	@IsOptional()
	content?: string;
}

import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreatePostDto } from '~posts/dtos/create-post.dto';

export class UpdatePostDto extends PartialType(CreatePostDto) {
	@IsString({
		message: 'content-string',
	})
	@IsOptional()
	content?: string;
}

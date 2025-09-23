import { PickType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PostsModel } from '~posts/entities/posts.entity';

export class CreatePostDto extends PickType(PostsModel, ['content']) {
	@IsString({
		each: true,
	})
	@IsOptional()
	images: string[] = [];
}

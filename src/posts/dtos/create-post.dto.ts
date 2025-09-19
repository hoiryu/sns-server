import { PickType } from '@nestjs/swagger';
import { PostsModel } from '~posts/entities/posts.entity';

export class CreatePostDto extends PickType(PostsModel, ['content']) {}

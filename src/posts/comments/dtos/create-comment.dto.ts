import { PickType } from '@nestjs/swagger';
import { CommentsModel } from '~posts/comments/entity/comments.entity';

export class CreateCommentDto extends PickType(CommentsModel, ['comment']) {}

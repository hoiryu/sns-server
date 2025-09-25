import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentDto } from '~posts/comments/dtos/create-comment.dto';

export class UpdateCommentsDto extends PartialType(CreateCommentDto) {}

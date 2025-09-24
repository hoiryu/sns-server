import { Controller } from '@nestjs/common';
import { CommentsService } from '~posts/comments/comments.service';

@Controller('posts/:postId/comments')
export class CommentsController {
	constructor(private readonly commentsService: CommentsService) {}
}

import { Module } from '@nestjs/common';
import { CommentsController } from '~posts/comments/comments.controller';
import { CommentsService } from '~posts/comments/comments.service';

@Module({
	controllers: [CommentsController],
	providers: [CommentsService],
})
export class CommentsModule {}

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '~auth/auth.module';
import { CommonModule } from '~common/common.module';
import { CommentsController } from '~posts/comments/comments.controller';
import { CommentsService } from '~posts/comments/comments.service';
import { CommentsModel } from '~posts/comments/entity/comments.entity';
import { PostExistsMiddelware } from '~posts/comments/middlewares/post-exists.middleware';
import { PostsModule } from '~posts/posts.module';
import { UsersModule } from '~users/users.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([CommentsModel]),
		CommonModule,
		PostsModule,
		AuthModule,
		UsersModule,
	],
	controllers: [CommentsController],
	providers: [CommentsService],
})
export class CommentsModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(PostExistsMiddelware).forRoutes(CommentsController);
	}
}

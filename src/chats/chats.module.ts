import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '~auth/auth.module';
import { ChatsController } from '~chats/chats.controller';
import { ChatsGateway } from '~chats/chats.gateway';
import { ChatsService } from '~chats/chats.service';
import { ChatsModel } from '~chats/entity/chats.entity';
import { MessagesModel } from '~chats/messages/entity/messages.entity';
import { MessagesController } from '~chats/messages/messages.controller';
import { MessagesService } from '~chats/messages/messages.service';
import { CommonModule } from '~common/common.module';
import { UsersModule } from '~users/users.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([ChatsModel, MessagesModel]),
		CommonModule,
		UsersModule,
		AuthModule,
	],
	controllers: [ChatsController, MessagesController],
	providers: [ChatsService, MessagesService, ChatsGateway],
})
export class ChatsModule {}

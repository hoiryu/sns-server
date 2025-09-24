import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatsController } from '~chats/chats.controller';
import { ChatsGateway } from '~chats/chats.gateway';
import { ChatsService } from '~chats/chats.service';
import { ChatsModel } from '~chats/entity/chats.entity';
import { MessagesModel } from '~chats/messages/entity/messages.entity';
import { MessagesController } from '~chats/messages/messages.controller';
import { MessagesService } from '~chats/messages/messages.service';
import { CommonModule } from '~common/common.module';

@Module({
	imports: [TypeOrmModule.forFeature([ChatsModel, MessagesModel]), CommonModule],
	controllers: [ChatsController, MessagesController],
	providers: [ChatsService, MessagesService, ChatsGateway],
})
export class ChatsModule {}

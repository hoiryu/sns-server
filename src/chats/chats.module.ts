import { Module } from '@nestjs/common';
import { ChatsController } from '~chats/chats.controller';
import { ChatsGateway } from '~chats/chats.gateway';
import { ChatsService } from '~chats/chats.service';

@Module({
	controllers: [ChatsController],
	providers: [ChatsService, ChatsGateway],
})
export class ChatsModule {}

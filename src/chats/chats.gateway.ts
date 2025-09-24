import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatsService } from '~chats/chats.service';
import { CreateChatDto } from '~chats/dtos/create-chat.dto';
import { EnterChatDto } from '~chats/dtos/enter-chat.dto';
import { CreateMessageDto } from '~chats/messages/dtos/create-message.dto';
import { MessagesService } from '~chats/messages/messages.service';

@WebSocketGateway({
	namespace: 'chats',
})
export class ChatsGateway implements OnGatewayConnection {
	constructor(
		private readonly chatsService: ChatsService,
		private readonly messagesService: MessagesService,
	) {}

	@WebSocketServer()
	server: Server;

	handleConnection(socket: Socket) {
		console.log(`on connect called: ${socket.id}`);
	}

	@SubscribeMessage('create_chat')
	async createChat(@MessageBody() data: CreateChatDto, @ConnectedSocket() socket: Socket) {
		const chat = await this.chatsService.createChat(data);
	}

	@SubscribeMessage('enter_chat')
	async enterChat(@MessageBody() dto: EnterChatDto, @ConnectedSocket() socket: Socket) {
		for (const chatId of dto.chatIds) {
			const exists = await this.chatsService.checkIfChatExists(chatId);
			if (!exists)
				throw new WsException({
					message: `존재하지 않는 chatId: ${chatId}`,
				});
		}

		socket.join(dto.chatIds.map(id => id.toString()));
	}

	@SubscribeMessage('send_message')
	async sendMessage(@MessageBody() dto: CreateMessageDto, @ConnectedSocket() socket: Socket) {
		const chatExists = await this.chatsService.checkIfChatExists(dto.chatId);
		if (!chatExists)
			throw new WsException({
				message: `존재하지 않는 chatId: ${dto.chatId}`,
			});

		const message = await this.messagesService.createMessage(dto);

		socket.to(message!.chat.id.toString()).emit('receive_message', message!.message);
	}
}

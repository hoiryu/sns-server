import { UnauthorizedException, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
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
import { AuthService } from '~auth/auth.service';
import { ChatsService } from '~chats/chats.service';
import { CreateChatDto } from '~chats/dtos/create-chat.dto';
import { EnterChatDto } from '~chats/dtos/enter-chat.dto';
import { CreateMessageDto } from '~chats/messages/dtos/create-message.dto';
import { MessagesService } from '~chats/messages/messages.service';
import { SocketExceptionFilter } from '~common/exception-filters/socket.exception-filter';
import { UsersModel } from '~users/entity/users.entity';
import { UsersService } from '~users/users.service';

@WebSocketGateway({
	namespace: 'chats',
})
export class ChatsGateway implements OnGatewayConnection {
	constructor(
		private readonly chatsService: ChatsService,
		private readonly messagesService: MessagesService,
		private readonly authService: AuthService,
		private readonly usersService: UsersService,
	) {}

	@WebSocketServer()
	server: Server;

	async handleConnection(socket: Socket & { user: UsersModel }) {
		console.info(`on connect called : ${socket.id}`);

		const headers = socket.handshake.headers;
		const rawToken = headers['authorization']!;

		if (!rawToken) socket.disconnect();

		try {
			const token = this.authService.extractTokenFromHeader(rawToken, true);
			const payload = this.authService.verifyToken(token);
			const user = await this.usersService.getUserByEmail(payload.email);
			if (!user) throw new UnauthorizedException(`유저가 없습니다. Email: ${payload.email}`);

			socket.user = user;

			return true;
		} catch (e) {
			socket.disconnect();
		}
	}

	@SubscribeMessage('create_chat')
	@UsePipes(
		new ValidationPipe({
			transform: true,
			transformOptions: {
				enableImplicitConversion: true,
			},
			whitelist: true,
			forbidNonWhitelisted: true,
		}),
	)
	@UseFilters(SocketExceptionFilter)
	async createChat(
		@MessageBody() data: CreateChatDto,
		@ConnectedSocket() socket: Socket & { user: UsersModel },
	) {
		const chat = await this.chatsService.createChat(data);
	}

	@SubscribeMessage('enter_chat')
	async enterChat(
		@MessageBody() dto: EnterChatDto,
		@ConnectedSocket() socket: Socket & { user: UsersModel },
	) {
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
	async sendMessage(
		@MessageBody() dto: CreateMessageDto,
		@ConnectedSocket() socket: Socket & { user: UsersModel },
	) {
		const chatExists = await this.chatsService.checkIfChatExists(dto.chatId);
		if (!chatExists)
			throw new WsException({
				message: `존재하지 않는 chatId: ${dto.chatId}`,
			});

		const message = await this.messagesService.createMessage(dto, socket.user.id);

		socket.to(message!.chat.id.toString()).emit('receive_message', message!.message);
	}
}

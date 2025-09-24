import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChatDto } from '~chats/dtos/create-chat.dto';
import { PaginateChatDto } from '~chats/dtos/paginate-chat.dto';
import { ChatsModel } from '~chats/entity/chats.entity';
import { CommonService } from '~common/common.service';

@Injectable()
export class ChatsService {
	constructor(
		@InjectRepository(ChatsModel)
		private readonly chatsRepository: Repository<ChatsModel>,
		private readonly commonService: CommonService,
	) {}

	/**
	 * Chat 생성하기
	 * @param dto CreateChatDto
	 */
	async createChat(dto: CreateChatDto) {
		const chat = await this.chatsRepository.save({
			users: dto.userIds.map(id => ({ id })),
		});

		return this.chatsRepository.findOne({
			where: {
				id: chat.id,
			},
		});
	}

	/**
	 * Post 가져오기 (Query String)
	 * @Description dto.page 가 있을 경우 Page Paginate, dto.page 가 없을 경우 Cursor Paginate
	 * @param dto PaginateChatDto
	 */
	paginateChats(dto: PaginateChatDto) {
		return this.commonService.paginate(
			dto,
			this.chatsRepository,
			{
				relations: {
					users: true,
				},
			},
			'chats',
		);
	}

	async checkIfChatExists(chatId: number) {
		const exists = await this.chatsRepository.exists({
			where: {
				id: chatId,
			},
		});

		return exists;
	}
}

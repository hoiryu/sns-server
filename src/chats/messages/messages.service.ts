import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateMessageDto } from '~chats/messages/dtos/create-message.dto';
import { MessagesModel } from '~chats/messages/entity/messages.entity';
import { CommonService } from '~common/common.service';
import { BasePaginationDto } from '~common/dtos/base-pagination.dto';

@Injectable()
export class MessagesService {
	constructor(
		@InjectRepository(MessagesModel)
		private readonly messagesRepository: Repository<MessagesModel>,
		private readonly commonService: CommonService,
	) {}

	/**
	 * Message 생성하기
	 * @param dto CreateMessageDto
	 */
	async createMessage(dto: CreateMessageDto) {
		const message = await this.messagesRepository.save({
			chat: {
				id: dto.authorId,
			},
			author: {
				id: dto.authorId,
			},
			message: dto.message,
		});

		return this.messagesRepository.findOne({
			where: {
				id: message.id,
			},
			relations: {
				chat: true,
			},
		});
	}

	/**
	 * Messages 가져오기 (Query String)
	 * @Description dto.page 가 있을 경우 Page Paginate, dto.page 가 없을 경우 Cursor Paginate
	 * @param dto BasePaginationDto
	 */
	paginateMessages(dto: BasePaginationDto, overrideFindOptions: FindManyOptions<MessagesModel>) {
		return this.commonService.paginate(
			dto,
			this.messagesRepository,
			overrideFindOptions,
			'messages',
		);
	}
}

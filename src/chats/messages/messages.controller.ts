import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { MessagesService } from '~chats/messages/messages.service';
import { BasePaginationDto } from '~common/dtos/base-pagination.dto';

@Controller('chats/:id/messages')
export class MessagesController {
	constructor(private readonly messagesService: MessagesService) {}

	@Get()
	paginateMessage(@Param('id', ParseIntPipe) id: number, @Query() dto: BasePaginationDto) {
		return this.messagesService.paginateMessages(dto, {
			where: {
				chat: {
					id,
				},
			},
			relations: {
				author: true,
				chat: true,
			},
		});
	}
}

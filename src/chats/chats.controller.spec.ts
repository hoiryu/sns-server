import { Test, TestingModule } from '@nestjs/testing';
import { ChatsController } from '~chats/chats.controller';
import { ChatsService } from '~chats/chats.service';

describe('ChatsController', () => {
	let controller: ChatsController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [ChatsController],
			providers: [ChatsService],
		}).compile();

		controller = module.get<ChatsController>(ChatsController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});

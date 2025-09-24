import { IsString } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';
import { ChatsModel } from '~chats/entity/chats.entity';
import { BaseModel } from '~common/entity/base.entity';
import { UsersModel } from '~users/entity/users.entity';

@Entity()
export class MessagesModel extends BaseModel {
	@Column()
	@IsString()
	message: string;

	@ManyToOne(() => ChatsModel, chat => chat.messages)
	chat: ChatsModel;

	@ManyToOne(() => UsersModel, user => user.messages)
	author: UsersModel;
}

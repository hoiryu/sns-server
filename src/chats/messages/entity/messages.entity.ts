import { IsString } from 'class-validator';
import { Column, Entity, JoinTable, ManyToOne } from 'typeorm';
import { ChatsModel } from '~chats/entity/chats.entity';
import { BaseModel } from '~common/entities/base.entity';
import { UsersModel } from '~users/entity/users.entity';

@Entity()
export class MessagesModel extends BaseModel {
	@Column()
	@IsString()
	message: string;

	@ManyToOne(() => ChatsModel, chat => chat.messages)
	@JoinTable()
	chat: ChatsModel;

	@ManyToOne(() => UsersModel, user => user.messages)
	@JoinTable()
	author: UsersModel;
}

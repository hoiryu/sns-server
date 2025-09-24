import { Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { MessagesModel } from '~chats/messages/entity/messages.entity';
import { BaseModel } from '~common/entities/base.entity';
import { UsersModel } from '~users/entity/users.entity';

@Entity()
export class ChatsModel extends BaseModel {
	@ManyToMany(() => UsersModel, user => user.chats)
	@JoinTable()
	users: UsersModel[];

	@OneToMany(() => MessagesModel, message => message.chat)
	messages: MessagesModel;
}

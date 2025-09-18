import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PostsModel {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	author: string;

	@Column()
	title: string;

	@Column()
	content: string;

	@Column()
	likeCount: string;

	@Column()
	commentCount: string;
}

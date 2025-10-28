import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseModel } from '~common/entity/base.entity';
import { ImagesModel } from '~common/entity/images.entity';
import { stringValidationMessage } from '~common/validation-message/string-validation.message';
import { CommentsModel } from '~posts/comments/entity/comments.entity';
import { PostLikesModel } from '~posts/post-likes/entity/post-likes.entity';
import { UsersModel } from '~users/entity/users.entity';

@Entity()
export class PostsModel extends BaseModel {
	@ManyToOne(() => UsersModel, user => user.posts, {
		nullable: false,
	})
	author: UsersModel;

	@ApiProperty({ title: '포스트 본문', example: '포스트 본문입니다.' })
	@IsString({ message: stringValidationMessage })
	@Column()
	content: string;

	@ApiProperty({ title: '좋아요 갯수', example: 99 })
	@Column()
	likeCount: number;

	@ApiProperty({ title: '코멘트 갯수', example: 99 })
	@Column()
	commentCount: number;

	@ApiProperty({ title: '업로드된 이미지들', example: ['/public/posts/image.jpg'] })
	@OneToMany(type => ImagesModel, image => image.post)
	images?: ImagesModel[];

	@OneToMany(() => CommentsModel, comment => comment.post)
	comments: CommentsModel[];

	@OneToMany(() => PostLikesModel, postLikes => postLikes.post)
	postLikes: PostLikesModel[];
}

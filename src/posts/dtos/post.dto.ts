import { ApiProperty, OmitType } from '@nestjs/swagger';
import { PostsModel } from '~posts/entities/posts.entity';
import { UserDto } from '~users/dtos/user.dto';
import { UsersModel } from '~users/entities/users.entity';

export class PostDto extends OmitType(PostsModel, ['author']) {
	@ApiProperty({ type: () => UserDto, title: '작성자' })
	author: UsersModel;
}

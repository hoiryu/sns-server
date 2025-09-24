import { ApiProperty, OmitType } from '@nestjs/swagger';
import { PostsModel } from '~posts/entity/posts.entity';
import { UserDto } from '~users/dtos/user.dto';
import { UsersModel } from '~users/entity/users.entity';

export class PostDto extends OmitType(PostsModel, ['author']) {
	@ApiProperty({ type: () => UserDto, title: '작성자' })
	author: UsersModel;
}

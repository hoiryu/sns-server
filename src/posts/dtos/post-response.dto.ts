import { ApiProperty, OmitType } from '@nestjs/swagger';
import { PostsModel } from '~posts/entities/posts.entity';
import { UserResponseDto } from '~users/dtos/user-response.dto';
import { UsersModel } from '~users/entities/users.entity';

export class PostResponseDto extends OmitType(PostsModel, ['author']) {
	@ApiProperty({ type: () => UserResponseDto, description: '작성자' })
	author: UsersModel;
}

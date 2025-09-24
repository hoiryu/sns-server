import { PickType } from '@nestjs/swagger';
import { ImagesModel } from '~common/entity/images.entity';

export class CreatePostImageDto extends PickType(ImagesModel, ['path', 'post', 'order', 'type']) {}

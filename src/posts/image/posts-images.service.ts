import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImagesModel } from '~common/entities/images.entity';

@Injectable()
export class PostsImagesService {
	constructor(
		@InjectRepository(ImagesModel)
		private readonly,
	) {}
}

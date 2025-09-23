import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { promises } from 'fs';
import { basename, join } from 'path';
import { QueryRunner, Repository } from 'typeorm';
import { POST_IMAGE_PATH, TEMPLATES_FOLDER_PATH } from '~common/constants/path.const';
import { ImagesModel } from '~common/entities/images.entity';
import { CreatePostImageDto } from '~posts/image/dtos/create-image.dto';

@Injectable()
export class PostsImagesService {
	constructor(
		@InjectRepository(ImagesModel)
		private readonly imagesRepository: Repository<ImagesModel>,
	) {}

	getRepository(qr?: QueryRunner) {
		return qr ? qr.manager.getRepository<ImagesModel>(ImagesModel) : this.imagesRepository;
	}

	/**
	 * 이미지 업로드
	 * @param dto CreatePostImageDto
	 * @param qr QueryRunner
	 */
	async createImage(dto: CreatePostImageDto, qr?: QueryRunner) {
		const repository = this.getRepository(qr);
		const tempFilePath = join(TEMPLATES_FOLDER_PATH, dto.path);

		try {
			await promises.access(tempFilePath);
		} catch (e) {
			throw new BadRequestException('존재하지 않는 파일 입니다.');
		}

		const filename = basename(tempFilePath);
		const newPath = join(POST_IMAGE_PATH, filename);

		const result = await repository.save(dto);

		// templates -> posts 로 파일 이동
		await promises.rename(tempFilePath, newPath);

		return result;
	}
}

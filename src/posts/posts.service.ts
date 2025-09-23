import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { promises } from 'fs';
import { basename, join } from 'path';
import { QueryRunner, Repository } from 'typeorm';
import { CommonService } from '~common/common.service';
import { POST_IMAGE_PATH, TEMPLATES_FOLDER_PATH } from '~common/constants/path.const';
import { ImagesModel } from '~common/entities/images.entity';
import { DEFAULT_POST_FIND_OPTIONS } from '~posts/constants/default-post-find-options.const';
import { CreatePostDto } from '~posts/dtos/create-post.dto';
import { PaginatePostDto } from '~posts/dtos/paginte-post.dto';
import { UpdatePostDto } from '~posts/dtos/update-post.dto';
import { PostsModel } from '~posts/entities/posts.entity';
import { CreatePostImageDto } from '~posts/image/dtos/create-image.dto';

@Injectable()
export class PostsService {
	constructor(
		@InjectRepository(PostsModel)
		private readonly postsRepository: Repository<PostsModel>,
		@InjectRepository(ImagesModel)
		private readonly imageRepository: Repository<ImagesModel>,
		private readonly commonService: CommonService,
	) {}
	/**
	 * 테스트용 Seeding
	 * @param userId user.id
	 */
	async generatePosts(userId: number) {
		for (let i = 0; i < 100; i++) {
			await this.createPost(userId, {
				content: `임의로 생성된 포스트 내용 ${i}`,
				images: [],
			});
		}
	}

	getRepository(qr?: QueryRunner) {
		return qr ? qr.manager.getRepository<PostsModel>(PostsModel) : this.postsRepository;
	}

	/**
	 * Post 생성하기
	 * @param authorId user.id
	 * @param dto CreatePostDto
	 * @param qr QueryRunner
	 */
	async createPost(authorId: number, dto: CreatePostDto, qr?: QueryRunner) {
		const repository = this.getRepository(qr);

		const post = repository.create({
			author: {
				id: authorId,
			},
			...dto,
			images: [],
			likeCount: 0,
			commentCount: 0,
		});

		const newPost = await repository.save(post);

		return newPost;
	}

	/**
	 * 이미지 업로드
	 * @param dto CreatePostImageDto
	 */
	async createPostImage(dto: CreatePostImageDto) {
		const tempFilePath = join(TEMPLATES_FOLDER_PATH, dto.path);

		try {
			await promises.access(tempFilePath);
		} catch (e) {
			throw new BadRequestException('존재하지 않는 파일 입니다.');
		}

		const filename = basename(tempFilePath);
		const newPath = join(POST_IMAGE_PATH, filename);

		const result = await this.imageRepository.save(dto);

		// templates -> posts 로 파일 이동
		await promises.rename(tempFilePath, newPath);

		return result;
	}

	/**
	 * Post 가져오기 (Query String)
	 * @Description dto.page 가 있을 경우 Page Paginate, dto.page 가 없을 경우 Cursor Paginate
	 * @param dto PaginatePostDto
	 */
	async paginatePosts(dto: PaginatePostDto) {
		return this.commonService.paginate(
			dto,
			this.postsRepository,
			{
				...DEFAULT_POST_FIND_OPTIONS,
			},
			'posts',
		);
	}

	/**
	 * Post 가져오기 (ID)
	 * @param id post.id
	 */
	async getPostById(id: number) {
		const post = await this.postsRepository.findOne({
			...DEFAULT_POST_FIND_OPTIONS,
			where: {
				id,
			},
		});
		if (!post) throw new NotFoundException();

		return post;
	}

	/**
	 * Post 수정하기 (ID)
	 * @param id post.id
	 * @param dto UpdatePostDto
	 */
	async updatePost(id: number, dto: UpdatePostDto) {
		const { content } = dto;
		const post = await this.postsRepository.findOne({
			where: {
				id,
			},
		});
		if (!post) throw new NotFoundException();

		if (content) post.content = content;

		const newPost = await this.postsRepository.save(post);

		return newPost;
	}
}

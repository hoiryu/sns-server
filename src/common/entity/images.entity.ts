import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { join } from 'path';
import { Column, Entity, ManyToOne } from 'typeorm';
import { POST_PUBLIC_IMAGE_PATH } from '~common/consts/path.const';
import { PostsModel } from '~posts/entity/posts.entity';
import { BaseModel } from './base.entity';

export enum EImagesModelType {
	POST_IMAGE,
}

@Entity()
export class ImagesModel extends BaseModel {
	@IsInt()
	@IsOptional()
	@Column({
		default: 0,
	})
	order: number;

	@IsEnum(EImagesModelType)
	@IsString()
	@Column({
		enum: EImagesModelType,
	})
	type: EImagesModelType;

	@IsString()
	@Transform(({ value, obj }) => {
		// class -> plain 변환시 적용
		if (obj.type === EImagesModelType.POST_IMAGE) {
			// /public/posts/image.jpg 형태로 변환
			return `/${join(POST_PUBLIC_IMAGE_PATH, value)}`;
		} else {
			return value;
		}
	})
	@Column()
	path: string;

	@ManyToOne(type => PostsModel, post => post.images)
	post?: PostsModel;
}

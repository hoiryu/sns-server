import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';
import { join } from 'path';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { USERS_PUBLIC_IMAGE_PATH } from '~common/consts/path.const';
import { BaseModel } from '~common/entity/base.entity';
import { UsersModel } from '~users/entity/users.entity';

@Entity()
export class UserProfilesModel extends BaseModel {
	@ApiProperty({ title: '유저 프로필 이미지', example: ['/public/users/image.jpg'] })
	@IsString()
	@Transform(({ value }) => {
		// class -> plain 변환시 적용
		// /public/users/image.jpg 형태로 변환
		return `/${join(USERS_PUBLIC_IMAGE_PATH, value)}`;
	})
	@Column()
	path: string;

	@OneToOne(() => UsersModel, user => user.profile, {
		onDelete: 'CASCADE', // user 삭제 시 profile 도 삭제
		nullable: false,
	})
	@JoinColumn()
	user: UsersModel;
}

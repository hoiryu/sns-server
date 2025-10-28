import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { promises } from 'fs';
import { join } from 'path';
import { QueryRunner, Repository } from 'typeorm';
import { RegisterUserDto } from '~auth/dtos/register-user.dto';
import { CommonService } from '~common/common.service';
import { USERS_IMAGE_PATH } from '~common/consts/path.const';
import { PaginateUserDto } from '~users/dtos/paginte-user.dto';
import { UsersModel } from '~users/entity/users.entity';
import { UserFollowersModel } from '~users/user-followers/entity/user-followers.entity';
import { UserProfilesModel } from '~users/user-profiles/entity/user-profiles.entity';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(UsersModel)
		private readonly usersRepository: Repository<UsersModel>,
		@InjectRepository(UserFollowersModel)
		private readonly userFollowersRepository: Repository<UserFollowersModel>,
		@InjectRepository(UserProfilesModel)
		private readonly userProfilesRepository: Repository<UserProfilesModel>,
		private readonly commonService: CommonService,
	) {}

	/**
	 * User 생성하기
	 * @param dto RegisterUserDto
	 */
	async createUser(dto: RegisterUserDto, image: string, qr?: QueryRunner) {
		const usersRepository = this.commonService.getRepository(
			UsersModel,
			this.usersRepository,
			qr,
		);

		const userProfilesRepository = this.commonService.getRepository(
			UserProfilesModel,
			this.userProfilesRepository,
			qr,
		);

		const nicknameExists = await usersRepository.exists({
			where: {
				nickname: dto.nickname,
			},
		});

		if (nicknameExists)
			throw new BadRequestException(`nickname-이미 존재합니다. ${dto.nickname}`);

		const emailExists = await usersRepository.exists({
			where: {
				email: dto.email,
			},
		});

		if (emailExists) throw new BadRequestException(`email-이미 존재합니다. ${dto.email}`);

		const createdUser = usersRepository.create({
			name: dto.name,
			nickname: dto.nickname,
			email: dto.email,
			password: dto.password,
		});

		const imagePath = join(USERS_IMAGE_PATH, image);

		try {
			await promises.access(imagePath);
		} catch (e) {
			throw new BadRequestException('존재하지 않는 파일 입니다.');
		}

		const createdUserProfile = userProfilesRepository.create({
			user: createdUser,
			path: image,
		});

		const savedUser = await usersRepository.save(createdUser);
		const savedUserProfile = await userProfilesRepository.save(createdUserProfile);

		return savedUser;
	}

	/**
	 * Users 가져오기
	 */
	async getAllUsers() {
		return this.usersRepository.find();
	}

	/**
	 * Users 가져오기 (Query String)
	 * @Description dto.page 가 있을 경우 Page Paginate
	 * @Description dto.page 가 없을 경우 Cursor Paginate
	 * @param dto PaginatePostDto
	 */
	async paginateUsers(dto: PaginateUserDto) {
		return this.commonService.paginate(
			dto,
			this.usersRepository,
			{
				select: {
					profile: {
						path: true,
					},
				},
				relations: {
					profile: true,
				},
			},
			'users',
		);
	}

	/**
	 * User 가져오기 (email)
	 * @param email user.email
	 */
	async getUserByEmail(email: string, qr?: QueryRunner) {
		const repository = this.commonService.getRepository(UsersModel, this.usersRepository, qr);

		return repository.findOne({
			where: {
				email,
			},
			select: {
				profile: {
					path: true,
				},
			},
			relations: {
				profile: true,
			},
		});
	}

	/**
	 * follow 추가하기
	 * @param followerId 현재 user.id
	 * @param followeeId 상대방 user.id
	 * @param qr QueryRunner
	 * @return boolean
	 */
	async followUser(followerId: number, followingId: number, qr?: QueryRunner) {
		const userFollowersRepository = this.commonService.getRepository(
			UserFollowersModel,
			this.userFollowersRepository,
			qr,
		);

		await userFollowersRepository.save({
			follower: {
				id: followerId,
			},
			following: {
				id: followingId,
			},
		});

		return true;
	}

	/**
	 * followers 가져오기 (isConfirmed)
	 * @param userId 현재 user.id
	 * @param includeNotConfirmed UserFollowersModel.isConfirmed
	 * @param qr QueryRunner
	 * @return UsersModel[]
	 */
	async getFollowers(userId: number, includeNotConfirmed: boolean) {
		const where = {
			following: {
				id: userId,
			},
		};

		if (!includeNotConfirmed) where['isConfirmed'] = true;

		const result = await this.userFollowersRepository.find({
			where,
			relations: {
				follower: true,
				following: true,
			},
		});

		return result.map(record => ({
			id: record.follower.id,
			nickname: record.follower.nickname,
			email: record.follower.email,
			isConfirmed: record.isConfirmed,
		}));
	}

	/**
	 * follow 승인하기
	 * @param followerId 현재 user.id
	 * @param followingId 상대 user.id
	 * @param qr QueryRunner
	 * @return boolean
	 */
	async confirmFollow(followerId: number, followingId: number, qr?: QueryRunner) {
		const userFollowersRepository = this.commonService.getRepository(
			UserFollowersModel,
			this.userFollowersRepository,
			qr,
		);

		const existing = await userFollowersRepository.findOne({
			where: {
				follower: {
					id: followerId,
				},
				following: {
					id: followingId,
				},
			},
			relations: {
				follower: true,
				following: true,
			},
		});

		if (!existing)
			throw new BadRequestException(
				`존재하지 않는 요청입니다. followerId: ${followerId} followingId: ${followingId}`,
			);

		await userFollowersRepository.save({
			...existing,
			isConfirmed: true,
		});

		return true;
	}

	/**
	 * follow 취소하기
	 * @param followerId 현재 user.id
	 * @param followingId 상대 user.id
	 * @param qr QueryRunner
	 * @return boolean
	 */
	async deleteFollow(followerId: number, followingId: number, qr?: QueryRunner) {
		const userFollowersRepository = this.commonService.getRepository(
			UserFollowersModel,
			this.userFollowersRepository,
			qr,
		);

		await userFollowersRepository.delete({
			follower: {
				id: followerId,
			},
			following: {
				id: followingId,
			},
		});

		return true;
	}

	/**
	 * FollowerCount 증가하기
	 * @param userId 현재 user.id
	 * @param qr QueryRunner
	 * @return boolean
	 */
	async incrementFollowerCount(userId: number, qr?: QueryRunner) {
		const userRepository = this.commonService.getRepository(
			UsersModel,
			this.usersRepository,
			qr,
		);

		await userRepository.increment(
			{
				id: userId,
			},
			'followerCount',
			1,
		);
	}

	/**
	 * FollowerCount 감소하기
	 * @param userId 현재 user.id
	 * @param qr QueryRunner
	 * @return boolean
	 */
	async decrementFollowerCount(userId: number, qr?: QueryRunner) {
		const userRepository = this.commonService.getRepository(
			UsersModel,
			this.usersRepository,
			qr,
		);

		await userRepository.decrement(
			{
				id: userId,
			},
			'followerCount',
			1,
		);
	}

	/**
	 * FollowingCount 증가하기
	 * @param userId 현재 user.id
	 * @param qr QueryRunner
	 * @return boolean
	 */
	async incrementFollowingCount(userId: number, qr?: QueryRunner) {
		const userRepository = this.commonService.getRepository(
			UsersModel,
			this.usersRepository,
			qr,
		);

		await userRepository.increment(
			{
				id: userId,
			},
			'followingCount',
			1,
		);
	}

	/**
	 * FollowingCount 감소하기
	 * @param userId 현재 user.id
	 * @param qr QueryRunner
	 * @return boolean
	 */
	async decrementFollowingCount(userId: number, qr?: QueryRunner) {
		const userRepository = this.commonService.getRepository(
			UsersModel,
			this.usersRepository,
			qr,
		);

		await userRepository.decrement(
			{
				id: userId,
			},
			'followingCount',
			1,
		);
	}
}

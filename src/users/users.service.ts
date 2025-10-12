import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { RegisterUserDto } from '~auth/dtos/register-user.dto';
import { CommonService } from '~common/common.service';
import { UsersModel } from '~users/entity/users.entity';
import { UserFollowersModel } from '~users/user-followers/entity/user-followers.entity';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(UsersModel)
		private readonly usersRepository: Repository<UsersModel>,
		@InjectRepository(UserFollowersModel)
		private readonly userFollowersRepository: Repository<UserFollowersModel>,
		private readonly commonService: CommonService,
	) {}

	/**
	 * User 생성하기
	 * @param dto RegisterUserDto
	 */
	async createUser(dto: RegisterUserDto) {
		const nicknameExists = await this.usersRepository.exists({
			where: {
				nickname: dto.nickname,
			},
		});

		if (nicknameExists)
			throw new BadRequestException(`nickname-이미 존재합니다. ${dto.nickname}`);

		const emailExists = await this.usersRepository.exists({
			where: {
				email: dto.email,
			},
		});

		if (emailExists) throw new BadRequestException(`email-이미 존재합니다. ${dto.email}`);

		const createdUser = this.usersRepository.create({
			name: dto.name,
			nickname: dto.nickname,
			email: dto.email,
			password: dto.password,
		});

		const savedUser = await this.usersRepository.save(createdUser);

		return savedUser;
	}

	/**
	 * Users 가져오기
	 */
	async getAllUsers() {
		return this.usersRepository.find();
	}

	/**
	 * User 가져오기 (email)
	 * @param email user.email
	 */
	async getUserByEmail(email: string) {
		return this.usersRepository.findOne({
			where: {
				email,
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

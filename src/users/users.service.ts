import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersModel } from '~users/entities/users.entity';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(UsersModel)
		private readonly usersRepository: Repository<UsersModel>,
	) {}

	async createUser(user: Pick<UsersModel, 'email' | 'nickname' | 'password'>) {
		// exist() -> 만약에 조건에 해당되는 값이 있으면 true 반환
		const nicknameExists = await this.usersRepository.exists({
			where: {
				nickname: user.nickname,
			},
		});

		if (nicknameExists) throw new BadRequestException('이미 존재하는 nickname 입니다!');

		const emailExists = await this.usersRepository.exists({
			where: {
				email: user.email,
			},
		});

		if (emailExists) throw new BadRequestException('이미 가입한 이메일입니다!');

		const createdUser = this.usersRepository.create({
			nickname: user.nickname,
			email: user.email,
			password: user.password,
		});

		const newUser = await this.usersRepository.save(createdUser);

		return newUser;
	}

	async getAllUsers() {
		return this.usersRepository.find();
	}

	async getUserByEmail(email: string) {
		return this.usersRepository.findOne({
			where: {
				email,
			},
		});
	}
}

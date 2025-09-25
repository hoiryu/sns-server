import {
	BadRequestException,
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { UsersModel } from 'src/users/entity/users.entity';
import { ERoles } from '~users/consts/roles.const';
import { PostsService } from '../posts.service';

@Injectable()
export class IsPostMineOrAdminGuard implements CanActivate {
	constructor(private readonly postService: PostsService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req = context.switchToHttp().getRequest() as Request & { user: UsersModel };

		const { user } = req;

		if (!user) throw new UnauthorizedException('사용자 정보를 가져올 수 없습니다.');

		/**
		 * Admin 일 경우 그냥 패스
		 */
		if (user.role === ERoles.ADMIN) {
			return true;
		}

		const postId = req.params.postId;

		if (!postId) {
			throw new BadRequestException('Post ID가 파라미터로 제공 돼야합니다.');
		}

		const isOk = await this.postService.isPostMine(user.id, parseInt(postId));

		if (!isOk) throw new ForbiddenException('권한이 없습니다.');

		return true;
	}
}

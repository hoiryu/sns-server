import { IsNumber, IsOptional, IsString } from 'class-validator';
import { BasePaginationDto } from '~common/dtos/base-pagination.dto';

export class PaginateUserDto extends BasePaginationDto {
	@IsNumber()
	@IsOptional()
	where__likeCount__more_than: number;

	@IsString()
	@IsOptional()
	where__content__i_like: string;
}

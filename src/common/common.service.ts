import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FindManyOptions, FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { ENV_HOST_KEY, ENV_PORT_KEY, ENV_PROTOCOL_KEY } from '~common/consts/env-keys.const';
import { FILTER_MAPPER } from '~common/consts/filter-mapper.const';
import { BasePaginationDto } from '~common/dtos/base-pagination.dto';
import { BaseModel } from '~common/entity/base.entity';

@Injectable()
export class CommonService {
	constructor(private readonly configService: ConfigService) {}

	/**
	 * Query String 을 기반으로 paginate
	 * @param dto BasePaginationDto
	 * @param repository DB
	 * @param overrideFindOptions find 메서드 옵션
	 */
	paginate<T extends BaseModel>(
		dto: BasePaginationDto,
		repository: Repository<T>,
		overrideFindOptions: FindManyOptions<T> = {},
		path: string,
	) {
		if (dto.page) {
			return this.pagePaginate(dto, repository, overrideFindOptions);
		} else {
			return this.cursorPaginate(dto, repository, overrideFindOptions, path);
		}
	}

	private async pagePaginate<T extends BaseModel>(
		dto: BasePaginationDto,
		repository: Repository<T>,
		overrideFindOptions: FindManyOptions<T> = {},
	) {
		const findOptions = this.composeFindOptions<T>(dto);

		const [data, count] = await repository.findAndCount({
			...findOptions,
			...overrideFindOptions,
		});

		return {
			data,
			total: count,
		};
	}

	private async cursorPaginate<T extends BaseModel>(
		dto: BasePaginationDto,
		repository: Repository<T>,
		overrideFindOptions: FindManyOptions<T> = {},
		path: string,
	) {
		/**
		 * where__컬럼명__유틸리티
		 * ex) where__id__more_than
		 */
		const findOptions = this.composeFindOptions<T>(dto);

		const results = await repository.find({
			...findOptions,
			...overrideFindOptions,
		});
		const lastItem =
			results.length > 0 && results.length === dto.take ? results[results.length - 1] : null;
		const protocol = this.configService.get<string>(ENV_PROTOCOL_KEY);
		const host = this.configService.get<string>(ENV_HOST_KEY);
		const port = this.configService.get<string>(ENV_PORT_KEY);
		const nextUrl = lastItem && new URL(`${protocol}://${host}:${port}/${path}`);

		if (nextUrl) {
			for (const key of Object.keys(dto)) {
				if (!dto[key] || key === 'where__id__more_than' || key === 'where__id__less_than')
					continue;

				nextUrl.searchParams.append(key, dto[key]);
			}

			const key =
				dto.order__createdAt === 'ASC' ? 'where__id__more_than' : 'where__id__less_than';

			nextUrl.searchParams.append(key, lastItem.id.toString());
		}

		return {
			data: results,
			cursor: {
				after: lastItem?.id ?? null,
			},
			count: results.length,
			next: nextUrl?.toString() ?? null,
		};
	}

	/**
	 * Where 문 완성
	 */
	private composeFindOptions<T extends BaseModel>(dto: BasePaginationDto): FindManyOptions<T> {
		let where: FindOptionsWhere<T> = {};
		let order: FindOptionsOrder<T> = {};
		let findOrderValue = 'ASC';

		for (const [key, value] of Object.entries(dto))
			if (key.startsWith('order__')) findOrderValue = value;

		for (const [key, value] of Object.entries(dto)) {
			if (key.startsWith('where__')) {
				// ASC 인데 less_than 은 조건에 맞지 않음
				if (findOrderValue === 'ASC' && key.includes('less_than')) continue;
				// DESC 인데 more_than 은 조건에 맞지 않음
				if (findOrderValue === 'DESC' && key.includes('more_than')) continue;

				where = {
					...where,
					...this.parseWhereFilter(key, value),
				};
			} else if (key.startsWith('order__')) {
				order = {
					...order,
					...this.parseWhereFilter(key, value),
				};
			}
		}

		return {
			where,
			order,
			take: dto.take,
			skip: dto.page ? dto.take * (dto.page - 1) : undefined,
		};
	}

	/**
	 * String -> FILTER_MAPPER 로 변환
	 */
	private parseWhereFilter<T extends BaseModel>(
		key: string,
		value: any,
	): FindOptionsWhere<T> | FindOptionsOrder<T> {
		const options: FindOptionsWhere<T> = {};
		const split = key.split('__');
		// Primary key 를 제외한 Key 는 undefined 인 경우 where 제외
		if (key !== 'where__id__less_than' && key !== 'where__id__more_than' && value === undefined)
			return options;

		if (split.length !== 2 && split.length !== 3)
			throw new BadRequestException(`Key length must be 2 or 3 (Key: ${key})`);

		if (split.length === 2) {
			const [_, field] = split;

			options[field] = value;
		} else {
			const [_, field, operator] = split;

			if (operator === 'i_like') {
				options[field] = FILTER_MAPPER[operator](`%${value}%`);
			} else {
				if (value === undefined) options[field] = FILTER_MAPPER['more_than_or_equal'](0);
				else options[field] = FILTER_MAPPER[operator](value);
			}
		}

		return options;
	}
}

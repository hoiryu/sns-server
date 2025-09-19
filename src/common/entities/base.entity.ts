import { ApiProperty } from '@nestjs/swagger';
import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

/**
 * BaseModel
 * Model 의 공통 Column 정의
 */
export abstract class BaseModel {
	@ApiProperty({ description: '고유 ID' })
	@PrimaryGeneratedColumn()
	id: number;

	@ApiProperty({ description: '생성 일자' })
	@UpdateDateColumn()
	updatedAt: Date;

	@ApiProperty({ description: '수정 일자' })
	@CreateDateColumn()
	createdAt: Date;
}

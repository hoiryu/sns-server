import { ApiProperty } from '@nestjs/swagger';
import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

/**
 * Model 의 공통 Column 정의
 * @property id PK
 * @property updatedAt 수정일
 * @property createdAt 생성일
 */
export abstract class BaseModel {
	@ApiProperty({ title: '고유 ID' })
	@PrimaryGeneratedColumn()
	id: number;

	@ApiProperty({ title: '수정 일자', type: String, format: 'date-time' })
	@UpdateDateColumn({
		type: 'timestamptz',
		default: () => 'CURRENT_TIMESTAMP',
	})
	updatedAt: Date;

	@ApiProperty({ title: '생성 일자', type: String, format: 'date-time' })
	@CreateDateColumn({
		type: 'timestamptz',
		default: () => 'CURRENT_TIMESTAMP',
	})
	createdAt: Date;
}

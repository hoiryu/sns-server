import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

/**
 * BaseModel
 * Model 의 공통 Column 정의
 */
export abstract class BaseModel {
	@PrimaryGeneratedColumn()
	id: number;

	@UpdateDateColumn()
	updatedAt: Date;

	@CreateDateColumn()
	createdAt: Date;
}

import { ValidationArguments } from 'class-validator';

/**
 * Email Validation 문구
 */
export const emailValidationMessage = (args: ValidationArguments) => {
	return `${args.property}-email`;
};

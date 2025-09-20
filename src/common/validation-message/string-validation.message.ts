import { ValidationArguments } from 'class-validator';

/**
 * String Validation 문구
 */
export const stringValidationMessage = (args: ValidationArguments) => {
	return `${args.property}-string`;
};

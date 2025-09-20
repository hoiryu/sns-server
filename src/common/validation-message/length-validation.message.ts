import { ValidationArguments } from 'class-validator';

/**
 * Length Validation 문구
 */
export const lengthValidationMessage = (args: ValidationArguments) => {
	return `${args.property}-${args.constraints.join('-')}`;
};

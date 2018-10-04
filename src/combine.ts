import { ValueValidator, ValidationError } from './base';

/**
 * Create a validator that requires at least one validator to be valid.
 */
export function combine<T = {}>(
  justOne: boolean,
  ...validators: ValueValidator<T>[]
): ValueValidator<T> {
  return ctx => {
    let errors: ValidationError[] = [];

    for (let validator of validators) {
      const result = validator(ctx);
      if (justOne && result.length === 0) {
        return [];
      }
      errors = [...errors, ...result];
    }

    return errors;
  };
}

/**
 * Create a validator that requires at least one validator to be valid.
 */
export const or = <T = {}>(...validators: ValueValidator<T>[]) =>
  combine<T>(true, ...validators);

/**
 * Create a validator that requires at all validators to be valid.
 */
export const and = <T = {}>(...validators: ValueValidator<T>[]) =>
  combine<T>(false, ...validators);

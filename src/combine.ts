import { ValueValidator, ValidationError } from './base';

/**
 * Create a validator that requires at least one validator to be valid.
 */
export function or<T = {}>(
  ...validators: ValueValidator<T>[]
): ValueValidator<T> {
  return ctx => {
    const errors: ValidationError[] = [];

    for (let validator of validators) {
      const result = validator(ctx);
      if (!result.errors || result.errors.length === 0) {
        return result;
      }
      errors.push(...result.errors);
    }

    return { value: ctx.value, errors };
  };
}

/**
 * Create a validator that requires all validators to be valid.
 */
export function and<T = {}>(
  ...validators: ValueValidator<T>[]
): ValueValidator<T> {
  return ({ value, field, options }) => {
    const errors: ValidationError[] = [];

    for (let validator of validators) {
      const result = validator({ value, field, options });
      value = result.value;

      if (result.errors && result.errors.length) {
        errors.push(...result.errors);
        // parse is potentially wrong, so don't validate other validators
        break;
      }
    }

    return { value: value, errors };
  };
}

import { ValueValidator, ValidationError, ValidationResult } from '../core';

/**
 * Create a validator that requires all validators to be valid.
 */
export function and<T = {}>(
  ...validators: ValueValidator<T>[]
): ValueValidator<T> {
  return ({ value, ...ctx }): ValidationResult<T> => {
    let anyError = false;
    const errors: ValidationError[] = [];

    for (const validator of validators) {
      const result = validator({ ...ctx, value });

      if (result.ok) {
        value = result.value;
      } else {
        anyError = true;
        errors.push(...result.errors);
        break;
      }
    }

    if (anyError) {
      return { ok: false, errors };
    } else {
      return { ok: true, value: value as T };
    }
  };
}

import { ValueValidator, ValidationResult } from '../core';

/**
 * Make a value optional.
 */
export function optional<T>(
  validator?: ValueValidator<T>,
): ValueValidator<T | undefined> {
  return (ctx): ValidationResult<T | undefined> => {
    if (ctx.value != undefined && ctx.value !== '' && validator) {
      return validator(ctx);
    }
    return { ok: true, value: undefined };
  };
}

import { ValueValidator } from './base';

/**
 * Make a value optional.
 */
export function optional<T>(
  validator?: ValueValidator<T>,
): ValueValidator<T | undefined> {
  return ctx => {
    if (
      ctx.value !== undefined &&
      ctx.value !== null &&
      <any>ctx.value !== '' &&
      validator
    ) {
      return validator(<any>ctx);
    }
    return [];
  };
}

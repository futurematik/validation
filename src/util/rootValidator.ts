import {
  RootValidator,
  ValueValidator,
  ValidationContextBase,
  ValidationResult,
} from '../core';

export function rootValidator<T>(
  validator: ValueValidator<T>,
  defaultContext: ValidationContextBase,
): RootValidator<T> {
  return (value, context): ValidationResult<T> =>
    validator({ value, ...defaultContext, ...context });
}

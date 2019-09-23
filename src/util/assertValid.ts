import {
  ValueValidator,
  ValidationMode,
  ModelValidationError,
  ValidationContext,
} from '../core';

/**
 * Wrap a validate call to throw an error if validation errors found.
 */
export function assertValid<T>(
  value: unknown,
  validator: ValueValidator<T>,
  ctx?: Omit<ValidationContext, 'value'>,
): T {
  const result = validator({ mode: ValidationMode.Strict, ...ctx, value });

  if (!result.ok) {
    throw new ModelValidationError(result.errors);
  }

  return result.value;
}

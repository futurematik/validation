import { ValueValidator, ValidationResult } from '../core';

/**
 * Don't perform validation.
 */
export function any(): ValueValidator<unknown> {
  return ({ value }): ValidationResult<unknown> => ({ ok: true, value });
}

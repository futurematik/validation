import { ValueValidator, ValidationMode, ValidationResult } from '../core';

export const ExpectedReal = 'EXPECTED_REAL';

/**
 * Require a real value.
 */
export function real(): ValueValidator<number> {
  return ({ value, field, mode }): ValidationResult<number> => {
    if (mode === ValidationMode.String || mode === ValidationMode.Form) {
      if (typeof value === 'string') {
        value = +value;
      }
    }
    if (typeof value === 'number' && isFinite(value)) {
      return { value, ok: true };
    }
    return {
      ok: false,
      errors: [
        {
          id: ExpectedReal,
          text: `expected real number`,
          field,
        },
      ],
    };
  };
}

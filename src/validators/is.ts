import { ValueValidator, ValidationResult } from '../core';

export const ExpectedValue = 'EXPECTED_VALUE';

/**
 * Require one of a list of values.
 */
export function is<T>(...values: T[]): ValueValidator<T> {
  return ({ value, field }): ValidationResult<T> => {
    if (values.indexOf(value as T) >= 0) {
      return { ok: true, value: value as T };
    }
    return {
      ok: false,
      errors: [
        {
          id: ExpectedValue,
          text: `expected one of ${values}`,
          field,
        },
      ],
    };
  };
}

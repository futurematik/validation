import { ValueValidator, ValidationMode, ValidationResult } from '../core';

export const ExpectedInteger = 'EXPECTED_INTEGER';
export const ExpectedIntegerMinimum = 'EXPECTED_INTEGER_MIN';
export const ExpectedIntegerMaximum = 'EXPECTED_INTEGER_MAX';

/**
 * Require an integer value.
 */
export function integer(opts?: {
  minValue?: number;
  maxValue?: number;
}): ValueValidator<number> {
  return ({ value, field, mode }): ValidationResult<number> => {
    if (mode === ValidationMode.String || mode === ValidationMode.Form) {
      if (typeof value === 'string') {
        value = +value;
      }
    }
    if (typeof value === 'number' && Number.isInteger(value)) {
      if (typeof opts?.minValue !== 'undefined' && value < opts.minValue) {
        return {
          ok: false,
          errors: [
            {
              id: ExpectedIntegerMinimum,
              text: `expected number to be at least ${opts.minValue}`,
              field,
            },
          ],
        };
      }
      if (typeof opts?.maxValue !== 'undefined' && value > opts.maxValue) {
        return {
          ok: false,
          errors: [
            {
              id: ExpectedIntegerMaximum,
              text: `expected number to be no more than ${opts.maxValue}`,
              field,
            },
          ],
        };
      }
      return { value, ok: true };
    }
    return {
      ok: false,
      errors: [
        {
          id: ExpectedInteger,
          text: `expected number`,
          field,
        },
      ],
    };
  };
}

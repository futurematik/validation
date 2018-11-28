import { ValueValidator } from './base';

export const ExpectedReal = 'EXPECTED_REAL';

/**
 * Require a real value.
 */
export function real(): ValueValidator<number> {
  return ({ value, field, options }) => {
    const { parse, strict } = options || { parse: false, strict: false };

    if ((parse || !strict) && typeof value === 'string') {
      value = +value;
    }
    if (isFinite(value)) {
      return { value, errors: [] };
    }
    return {
      value,
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

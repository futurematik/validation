import { ValueValidator } from './base';

export const ExpectedInteger = 'EXPECTED_INTEGER';

/**
 * Require an integer value.
 */
export function integer(): ValueValidator<number> {
  return ({ value, field, options }) => {
    const { parse, strict } = options || { parse: false, strict: false };

    if ((parse || !strict) && typeof value === 'string') {
      value = +value;
    }
    if (Number.isInteger(<any>value)) {
      return { value, errors: [] };
    }
    return {
      value,
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

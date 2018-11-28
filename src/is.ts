import { ValueValidator } from './base';

export const ExpectedValue = 'EXPECTED_VALUE';

/**
 * Require one of a list of values.
 */
export function is<T>(...values: T[]): ValueValidator<T> {
  return ({ value, field }) => {
    if (values.indexOf(<T>value) >= 0) {
      return { value, errors: [] };
    }
    return {
      value,
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

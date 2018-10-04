import { ValueValidator } from './base';

export const ExpectedValue = 'EXPECTED_VALUE';

/**
 * Require one of a list of values.
 */
export function is<T>(...values: T[]): ValueValidator<T> {
  return ctx => {
    if (values.indexOf(<T>ctx.value) >= 0) {
      return [];
    }
    return [
      {
        id: ExpectedValue,
        text: `expected one of ${values}`,
        field: ctx.field,
      },
    ];
  };
}

import { ValueValidator } from './base';

export const ExpectedInteger = 'EXPECTED_INTEGER';

/**
 * Require an integer value.
 */
export function integer(coerceStrings?: true): ValueValidator<number> {
  return ctx => {
    let value: any = ctx.value;
    if (coerceStrings && typeof value === 'string') {
      value = +value;
    }
    if (Number.isInteger(<any>value)) {
      ctx.value = value;
      return [];
    }
    return [
      {
        id: ExpectedInteger,
        text: `expected integer`,
        field: ctx.field,
      },
    ];
  };
}

import { ValueValidator } from './base';

export const ExpectedReal = 'EXPECTED_REAL';

/**
 * Require a real value.
 */
export function real(coerceStrings?: true): ValueValidator<number> {
  return ctx => {
    let value: any = ctx.value;
    if (coerceStrings && typeof value === 'string') {
      value = +value;
    }
    if (isFinite(value)) {
      ctx.value = value;
      return [];
    }
    return [
      {
        id: ExpectedReal,
        text: `expected real number`,
        field: ctx.field,
      },
    ];
  };
}

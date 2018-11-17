import { ValueValidator } from './base';

export const ExpectedReal = 'EXPECTED_REAL';

/**
 * Require a real value.
 */
export function real(): ValueValidator<number> {
  return ctx => {
    let value: any = ctx.value;
    let options = ctx.options || {};
    let { noCoerce, permissive } = options;

    if (permissive && typeof value === 'string') {
      value = +value;
    }
    if (isFinite(value)) {
      if (!noCoerce) {
        ctx.value = value;
      }
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

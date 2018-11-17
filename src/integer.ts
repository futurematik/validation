import { ValueValidator } from './base';

export const ExpectedInteger = 'EXPECTED_INTEGER';

/**
 * Require an integer value.
 */
export function integer(): ValueValidator<number> {
  return ctx => {
    let value: any = ctx.value;
    let options = ctx.options || {};
    let { noCoerce, permissive } = options;

    if (permissive && typeof value === 'string') {
      value = +value;
    }
    if (Number.isInteger(<any>value)) {
      if (!noCoerce) {
        ctx.value = value;
      }
      return [];
    }
    return [
      {
        id: ExpectedInteger,
        text: `expected number`,
        field: ctx.field,
      },
    ];
  };
}

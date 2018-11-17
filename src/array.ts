import { ValueValidator } from './base';

export const ExpectedArray = 'EXPECTED_ARRAY';

/**
 * Expect the value to be an array.
 */
export function array<T>(elem: ValueValidator<T>): ValueValidator<T[]> {
  return ctx => {
    let value: any = ctx.value;
    let options = ctx.options || {};
    let { noCoerce, arraySplit } = options;

    if (!noCoerce && arraySplit && typeof value === 'string') {
      value = value.split(arraySplit);
    }

    if (Array.isArray(value)) {
      const errs = value.reduce(
        (a, x, i) => [...a, ...elem({ value: x, field: `${ctx.field}[${i}]` })],
        [],
      );
      if (!errs.length && !noCoerce) {
        // re-assign in case we split a string
        ctx.value = value;
      }
      return errs;
    }
    return [
      {
        id: ExpectedArray,
        text:
          `expected list` + arraySplit ? ` seperated by '${arraySplit}'` : '',
        field: ctx.field,
      },
    ];
  };
}

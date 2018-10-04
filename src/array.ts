import { ValueValidator } from './base';

export const ExpectedArray = 'EXPECTED_ARRAY';

/**
 * Expect the value to be an array.
 */
export function array<T>(
  elem: ValueValidator<T>,
  splitStringOn?: string,
): ValueValidator<T[]> {
  return ctx => {
    let value: any = ctx.value;

    if (splitStringOn && typeof value === 'string') {
      value = value.split(splitStringOn);
    }

    if (Array.isArray(value)) {
      const errs = value.reduce(
        (a, x, i) => [...a, ...elem({ value: x, field: `${ctx.field}[${i}]` })],
        [],
      );
      if (!errs.length) {
        // re-assign in case we split a string
        ctx.value = value;
      }
      return errs;
    }
    return [
      {
        id: ExpectedArray,
        text:
          `expected list` + splitStringOn
            ? ` seperated by '${splitStringOn}'`
            : '',
        field: ctx.field,
      },
    ];
  };
}

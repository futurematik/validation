import { ValueValidator, ValidationError } from './base';

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
    } else {
      value = value.slice();
    }

    if (Array.isArray(value)) {
      let errs: ValidationError[] = [];

      for (let i = 0; i < value.length; ++i) {
        const vctx = { value: value[i], field: `${ctx.field}[${i}]`, options };
        errs = errs.concat(elem(vctx));
        value[i] = vctx.value;
      }

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
          `expected list` + (arraySplit ? ` seperated by '${arraySplit}'` : ''),
        field: ctx.field,
      },
    ];
  };
}

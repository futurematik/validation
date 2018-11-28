import { ValueValidator, ValidationResult } from './base';

export const ExpectedArray = 'EXPECTED_ARRAY';

/**
 * Expect the value to be an array.
 */
export function array<T>(
  elem: ValueValidator<T>,
  arraySplit?: string,
): ValueValidator<T[]> {
  return (ctx): ValidationResult<T[]> => {
    let value: any = ctx.value;
    let options = ctx.options || {};
    let { parse } = options;

    if (parse && typeof value === 'string') {
      value = value.split(arraySplit || ',').map(x => x.trim());
    } else {
      value = value.slice();
    }

    if (Array.isArray(value)) {
      let result: ValidationResult<T[]> = { value: [], errors: [] };

      for (let i = 0; i < value.length; ++i) {
        const subctx = {
          value: value[i],
          field: `${ctx.field}[${i}]`,
          options,
        };
        const subresult = elem(subctx);

        result.errors.push(...subresult.errors);
        result.value[i] = subresult.value;
      }

      return result;
    }
    return {
      value,
      errors: [
        {
          id: ExpectedArray,
          text:
            `expected list` +
            (arraySplit ? ` seperated by '${arraySplit}'` : ''),
          field: ctx.field,
        },
      ],
    };
  };
}

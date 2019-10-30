import { ValueValidator, ValidationResult, ValidationError } from '../core';
import { invalidResult, joinIds, validResult } from '../util';
import { ExpectedObject } from './properties';

export type Dictionary<K extends string, V = unknown> = {
  [P in K]: V;
};

export function dictionary<K extends string, V>(
  validateValue: ValueValidator<V>,
  validateKey?: ValueValidator<K>,
): ValueValidator<Dictionary<K, V>> {
  return ({ value, field, ...ctx }): ValidationResult<Dictionary<K, V>> => {
    if (typeof value !== 'object' || value === null) {
      return invalidResult(ExpectedObject, 'expected object', field);
    }
    const errors: ValidationError[] = [];

    const dict = { ...value } as Dictionary<K, V>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = {};

    for (const key in dict) {
      let parsedKey = key as K;

      if (validateKey) {
        const keyResult = validateKey({
          value: key,
          field: joinIds(field, `[${key}]`),
          ...ctx,
        });

        if (keyResult.ok) {
          parsedKey = keyResult.value;
        } else {
          errors.push(...keyResult.errors);
          continue;
        }
      }

      const propResult = validateValue({
        value: dict[key],
        field: joinIds(field, key),
        ...ctx,
      });
      if (propResult.ok) {
        result[parsedKey] = propResult.value;
      } else {
        errors.push(...propResult.errors);
      }
    }

    if (errors.length) {
      return { ok: false, errors };
    }
    return validResult(result);
  };
}

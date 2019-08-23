import {
  ValueValidator,
  ValidationResult,
  PropertyValidation,
  ModelDefinition,
} from '../core';
import { properties } from './properties';

/**
 * Validate the properties of an object using the validators provided.
 */
export function modelValidator<T>(
  model: ModelDefinition<T>,
  ...extended: PropertyValidation<T>[]
): ValueValidator<T> {
  const validators = [model, ...extended].map((x, i) => properties(x, i > 0));

  return (ctx): ValidationResult<T> => {
    let value = ctx.value;

    for (let i = 0; i < validators.length; ++i) {
      const result = validators[i]({ ...ctx, value });

      if (!result.ok) {
        return { ok: false, errors: result.errors };
      } else {
        value = result.value;
      }
    }
    return { ok: true, value: value as T };
  };
}

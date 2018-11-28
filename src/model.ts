import {
  ValueValidator,
  ValidationContext,
  joinIds,
  ValidationResult,
} from './base';
import { UnexpectedField } from './notProvided';

export const ExpectedObject = 'EXPECTED_OBJECT';

/**
 * ModelDefinition is a type containing validators for all properties of a given
 * type.
 */
export type ModelDefinition<T> = { [K in keyof T]-?: ValueValidator<T[K]> };

/**
 * Define a model with property validation.
 */
export function model<T>(validation: ModelDefinition<T>): ModelDefinition<T> {
  return validation; // this is just a type helper.
}

/**
 * Return the model type.
 */
export type ModelTypeOf<T> = T extends ModelDefinition<infer M> ? M : never;

/**
 * Get the keys of a model.
 */
export function modelKeys<T>(model: T): (keyof T)[] {
  return Object.keys(model) as any;
}

/**
 * Validate the properties of an object using the validators provided.
 */
export function modelValidator<T>(
  model: ModelDefinition<T>,
  ...extended: ((value: T) => Partial<ModelDefinition<T>>)[]
): ValueValidator<T> {
  const baseValidator = properties(model);

  return ctx =>
    extended
      .map(validator => partialProps<T>(validator(ctx.value))(ctx))
      .reduce(
        (a, x) => ({ value: x.value, errors: [...a.errors, ...x.errors] }),
        baseValidator(ctx),
      );
}

/**
 * Validate the properties of an object using the validators provided.
 */
export function properties<T>(
  model: ModelDefinition<T>,
  allowExtraFields?: boolean,
): ValueValidator<T> {
  return ({ value, field, options }) => {
    if (typeof value !== 'object') {
      return {
        value,
        errors: [
          {
            id: ExpectedObject,
            text: `expected object`,
            field,
          },
        ],
      };
    }

    let result: ValidationResult<T> = { value, errors: [] };

    // check all properties validation
    for (let key in model) {
      const validator = model[key];
      const exists = key in value;

      const propCtx: ValidationContext<any> = {
        field: joinIds(field || '', key),
        value: value[key],
        options,
      };

      // validate
      const propResult = validator(propCtx);

      if (propResult.errors && propResult.errors.length) {
        // append validation errors
        result.errors.push(...propResult.errors);
      }
      if (exists) {
        // only assign if it existed in the first place
        result.value[key] = <any>propCtx.value;
      }
    }

    // check for extra fields
    if (!allowExtraFields) {
      for (let key in value) {
        if (!(key in model)) {
          result.errors.push({
            id: UnexpectedField,
            text: 'unexpected value',
            field: key,
          });
        }
      }
    }

    return result;
  };
}

/**
 * Partially validate a model.
 */
export function partialProps<T>(
  model: Partial<ModelDefinition<T>>,
): ValueValidator<T> {
  return properties<T>(model as any, true);
}

/**
 * Make a validator that depends on the current value.
 */
export function propertiesFunc<T>(
  func: (value: T) => ModelDefinition<T>,
): ValueValidator<T> {
  return ctx => properties(func(ctx.value))(ctx);
}

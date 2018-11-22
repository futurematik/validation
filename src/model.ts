import {
  ValueValidator,
  ValidationError,
  ValidationContext,
  joinIds,
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
      .reduce((a, x) => a.concat(x), baseValidator(ctx));
}

/**
 * Validate the properties of an object using the validators provided.
 */
export function properties<T>(
  model: ModelDefinition<T>,
  allowExtraFields?: boolean,
): ValueValidator<T> {
  return ctx => {
    let errors: ValidationError[] = [];
    let options = ctx.options || {};
    let { noCoerce } = options;

    if (typeof ctx.value !== 'object') {
      return [
        {
          id: ExpectedObject,
          text: `expected object`,
          field: ctx.field,
        },
      ];
    }

    // check all properties validation
    for (let key in model) {
      const validator = model[key];
      const exists = key in ctx.value;

      const propCtx: ValidationContext<any> = {
        field: joinIds(ctx.field || '', key),
        value: ctx.value[key],
        options: ctx.options,
      };

      // validate
      const result = validator(propCtx);

      if (result.length) {
        // append validation errors
        errors = [...errors, ...result];
      } else if (exists && !noCoerce) {
        // reassign incase value has been coalesced.
        ctx.value[key] = <any>propCtx.value;
      }
    }

    // check for extra fields
    if (!allowExtraFields) {
      for (let key in ctx.value) {
        if (!(key in model)) {
          errors.push({
            id: UnexpectedField,
            text: 'unexpected value',
            field: key,
          });
        }
      }
    }

    return errors;
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

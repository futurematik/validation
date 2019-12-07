import { UnexpectedField } from './notProvided';
import { joinIds } from '../util';
import {
  PropertyValidation,
  ValidationContext,
  ValidationError,
  ValueValidator,
  ValidationResult,
  ExtraFieldsMode,
} from '../core';

export const ExpectedObject = 'EXPECTED_OBJECT';

/**
 * Validate the properties of an object using the validators provided.
 */
export function properties<T>(
  model: PropertyValidation<T>,
  allowExtraFields?: boolean | ExtraFieldsMode,
): ValueValidator<T> {
  return ({ value, field, ...ctx }): ValidationResult<T> => {
    if (typeof value !== 'object' || value === null) {
      return {
        ok: false,
        errors: [
          {
            id: ExpectedObject,
            text: `expected object`,
            field,
          },
        ],
      };
    }

    let extraFieldsMode = ctx.extraFields || ExtraFieldsMode.Fail;

    if (typeof allowExtraFields !== 'undefined') {
      if (typeof allowExtraFields === 'boolean') {
        extraFieldsMode = allowExtraFields
          ? ExtraFieldsMode.Include
          : ExtraFieldsMode.Fail;
      } else {
        extraFieldsMode = allowExtraFields;
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parsed = {} as any;

    if (typeof model === 'function') {
      model = model((value as unknown) as T);
    }

    let anyErrors = false;
    const errors: ValidationError[] = [];
    const props = keys(value, model);

    // check all properties validation
    for (const key of props) {
      if (key in model) {
        const validator = model[key as keyof T];
        const exists = key in value;

        const propCtx: ValidationContext = {
          ...ctx,
          field: joinIds(field, key),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          value: (value as any)[key],
        };

        // validate
        const propResult = validator(propCtx);

        if (!propResult.ok) {
          anyErrors = true;
          errors.push(...propResult.errors);
        } else if (exists || typeof propResult.value !== 'undefined') {
          // don't just make an explicit undefined prop
          parsed[key] = propResult.value;
        }
      } else {
        // extra field
        switch (extraFieldsMode) {
          case ExtraFieldsMode.Fail:
            anyErrors = true;
            errors.push({
              id: UnexpectedField,
              text: 'unexpected value',
              field: joinIds(field, key),
            });
            break;

          case ExtraFieldsMode.Ignore:
            break;

          case ExtraFieldsMode.Include:
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            parsed[key] = (value as any)[key];
            break;
        }
      }
    }

    if (anyErrors || errors.length) {
      return { ok: false, errors };
    } else {
      return { ok: true, value: parsed };
    }
  };
}

function keys(...objects: object[]): string[] {
  return objects
    .reduce((a: string[], x) => a.concat(Object.keys(x)), [])
    .reduce((a: string[], x) => (a.indexOf(x) < 0 ? a.concat(x) : a), []);
}

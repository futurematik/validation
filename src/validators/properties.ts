import { UnexpectedField } from './notProvided';
import { joinIds } from '../util';
import {
  PropertyValidation,
  ValidationContext,
  ValidationError,
  ValueValidator,
  ValidationResult,
} from '../core';

export const ExpectedObject = 'EXPECTED_OBJECT';

/**
 * Validate the properties of an object using the validators provided.
 */
export function properties<T>(
  model: PropertyValidation<T>,
  allowExtraFields?: boolean,
): ValueValidator<T> {
  return ({ value, field, mode }): ValidationResult<T> => {
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

    // we copy the value here so that partial validators will still have all
    // of the properties, but need to clone it so that parsed[key] later
    // doesn't mutate the input value
    const parsed = { ...value } as T;

    if (typeof model === 'function') {
      model = model((value as unknown) as T);
    }

    let anyErrors = false;
    const errors: ValidationError[] = [];

    // check all properties validation
    for (const key in model) {
      const validator = model[key];
      const exists = key in value;

      const propCtx: ValidationContext = {
        field: joinIds(field || '', key),
        value: ((value as unknown) as T)[key],
        mode,
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
    }

    // check for extra fields
    if (!allowExtraFields) {
      for (const key in value) {
        if (!(key in model)) {
          errors.push({
            id: UnexpectedField,
            text: 'unexpected value',
            field: key,
          });
        }
      }
    }

    if (anyErrors) {
      return { ok: false, errors };
    } else {
      return { ok: true, value: parsed };
    }
  };
}

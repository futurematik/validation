import { ValueValidator } from './base';

export const UnexpectedField = 'UNEXPECTED_FIELD';

/**
 * Require value not to be present.
 */
export function notProvided(opts?: {
  strict?: boolean;
}): ValueValidator<undefined> {
  return ({ value, field, options }) => {
    const { strict } = opts || { strict: false };

    if ((!strict && value == undefined) || value === undefined) {
      return { value: undefined, errors: [] };
    }
    return {
      value,
      errors: [
        {
          id: UnexpectedField,
          text: 'unexpected value',
          field,
        },
      ],
    };
  };
}

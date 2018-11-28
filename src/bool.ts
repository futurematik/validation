import { ValueValidator } from './base';

export const ExpectedBoolean = 'EXPECTED_BOOLEAN';

/**
 * Require an boolean value.
 */
export function bool(): ValueValidator<boolean> {
  return ({ value, field, options }) => {
    if (typeof value === 'string' && options && options.parse) {
      switch (value) {
        case 'true':
          value = true;
          break;
        case 'false':
          value = false;
          break;
      }
    }
    if (typeof value === 'boolean') {
      return { value, errors: [] };
    }
    return {
      value,
      errors: [
        {
          id: ExpectedBoolean,
          text: `expected boolean`,
          field,
        },
      ],
    };
  };
}

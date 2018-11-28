import { ValueValidator } from './base';

export const ExpectedEmail = 'EXPECTED_EMAIL';

/**
 * Require an email.
 */
export function email(): ValueValidator<string> {
  return ({ value, field }) => {
    if (typeof value === 'string') {
      if (/^[^@]+@[^@]+$/.test(value)) {
        return { value, errors: [] };
      }
    }
    return {
      value,
      errors: [
        {
          id: ExpectedEmail,
          text: `enter a valid email address`,
          field,
        },
      ],
    };
  };
}

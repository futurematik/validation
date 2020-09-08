import { ValueValidator, ValidationResult } from '../core';

export const ExpectedEmail = 'EXPECTED_EMAIL';

// This is a slightly simplified version of the regex that appears in the W3C
// HTML5 spec, that doesn't place constraints on the initial character of
// domains since the payoff isn't worth the complexity.
export const W3CEmailValidationRegex = /^[a-zA-Z0-9.!#$%&’*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

/**
 * Require an email.
 */
export function email(): ValueValidator<string> {
  return ({ value, field }): ValidationResult<string> => {
    if (typeof value === 'string') {
      if (W3CEmailValidationRegex.test(value)) {
        return { value, ok: true };
      }
    }
    return {
      ok: false,
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

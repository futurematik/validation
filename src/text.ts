import { ValueValidator } from './base';

export const ExpectedString = 'EXPECTED_STRING';
export const StringTooLong = 'STRING_TOO_LONG';
export const StringTooShort = 'STRING_TOO_SHORT';

/**
 * Require a text value.
 */
export function text(
  maxLength?: number,
  minLength: number = 1,
): ValueValidator<string> {
  return ({ value, field, options }) => {
    if (typeof value !== 'string') {
      return {
        value,
        errors: [
          {
            id: ExpectedString,
            text: `must be text`,
            field,
          },
        ],
      };
    } else if (maxLength !== undefined && value.length > maxLength) {
      return {
        value,
        errors: [
          {
            id: StringTooLong,
            text: `must be ${maxLength} characters or less`,
            field,
          },
        ],
      };
    } else if (minLength !== undefined && value.length < minLength) {
      return {
        value,
        errors: [
          {
            id: StringTooShort,
            text:
              minLength === 1
                ? `required`
                : `must be at least ${minLength} characters`,
            field,
          },
        ],
      };
    }
    return { value, errors: [] };
  };
}

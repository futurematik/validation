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
  return ctx => {
    if (typeof ctx.value !== 'string') {
      return [
        {
          id: ExpectedString,
          text: `must be text`,
          field: ctx.field,
        },
      ];
    } else if (maxLength !== undefined && ctx.value.length > maxLength) {
      return [
        {
          id: StringTooLong,
          text: `must be ${maxLength} characters or less`,
          field: ctx.field,
        },
      ];
    } else if (minLength !== undefined && ctx.value.length < minLength) {
      return [
        {
          id: StringTooShort,
          text: `must be at least ${minLength} characters`,
          field: ctx.field,
        },
      ];
    }
    return [];
  };
}

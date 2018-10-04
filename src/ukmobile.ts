import { ValueValidator } from './base';

export const ExpectedUkMobile = 'EXPECTED_UK_MOBILE';

/**
 * Validate a phone number and coalsece to E.164 format if valid.
 */
export function ukmobile(): ValueValidator<string> {
  return ctx => {
    if (typeof ctx.value === 'string') {
      const value = ctx.value.replace(/[ \.\-\(\)]/g, '');
      const match = value.match(/^(\+44)?0?(7[0-9]{9})$/);

      if (match !== null) {
        ctx.value = '+44' + match[2];
        return [];
      }
    }
    return [
      {
        id: ExpectedUkMobile,
        text: `expected a UK mobile number`,
        field: ctx.field,
      },
    ];
  };
}

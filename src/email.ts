import { ValueValidator } from './base';

export const ExpectedEmail = 'EXPECTED_EMAIL';

/**
 * Require an email.
 */
export function email(): ValueValidator<string> {
  return ctx => {
    if (typeof ctx.value === 'string') {
      if (/^[^@]+@[^@]+$/.test(ctx.value)) {
        return [];
      }
    }
    return [
      {
        id: ExpectedEmail,
        text: `enter a valid email address`,
        field: ctx.field,
      },
    ];
  };
}

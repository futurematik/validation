import { ValueValidator } from './base';

export const ExpectedBoolean = 'EXPECTED_BOOLEAN';

/**
 * Require an boolean value.
 */
export function bool(): ValueValidator<boolean> {
  return ctx => {
    if (typeof ctx.value === 'boolean') {
      return [];
    }
    return [
      {
        id: ExpectedBoolean,
        text: `expected boolean`,
        field: ctx.field,
      },
    ];
  };
}

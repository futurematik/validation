import { ValueValidator } from './base';

export const UnexpectedField = 'UNEXPECTED_FIELD';

/**
 * Require value not to be present. Best used with or().
 */
export function notProvided(): ValueValidator<undefined> {
  return ctx => {
    if (ctx.value === undefined) {
      return [];
    }
    return [
      {
        id: UnexpectedField,
        text: 'unexpected value',
        field: ctx.field,
      },
    ];
  };
}

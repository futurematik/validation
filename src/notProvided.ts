import { ValueValidator } from './base';

export const UnexpectedField = 'UNEXPECTED_FIELD';

/**
 * Require value not to be present. Best used with or().
 */
export function notProvided(opts?: {
  allowNull?: boolean;
}): ValueValidator<undefined> {
  return ctx => {
    if (
      ctx.value === undefined ||
      (opts && opts.allowNull && ctx.value === null)
    ) {
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

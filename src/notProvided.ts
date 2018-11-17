import { ValueValidator } from './base';

export const UnexpectedField = 'UNEXPECTED_FIELD';

/**
 * Require value not to be present.
 */
export function notProvided(opts?: {
  strict?: boolean;
}): ValueValidator<undefined> {
  return ctx => {
    const options = ctx.options || {};
    const { noCoerce } = options;
    const strict = opts && opts.strict;

    if ((!strict && ctx.value == undefined) || ctx.value === undefined) {
      if (!noCoerce) {
        ctx.value = undefined;
      }
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

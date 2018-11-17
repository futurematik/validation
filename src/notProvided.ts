import { ValueValidator } from './base';

export const UnexpectedField = 'UNEXPECTED_FIELD';

/**
 * Require value not to be present. Best used with or().
 */
export function notProvided(): ValueValidator<undefined> {
  return ctx => {
    let options = ctx.options || {};
    let { noCoerce, permissive } = options;

    if ((permissive && ctx.value == undefined) || ctx.value === undefined) {
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

import * as moment from 'moment';
import { ValueValidator } from './base';

export const ExpectedDateFormat = 'EXPECTED_DATE_FORMAT';

/**
 * Validates a date/time against the given format.
 */
export function dateFormat(
  format: string | moment.MomentBuiltinFormat,
): ValueValidator<Date> {
  return ctx => {
    let options = ctx.options || {};
    let { json, noCoerce } = options;

    if (ctx.value instanceof Date) {
      return [];
    }
    if (typeof ctx.value === 'string') {
      let m = moment(ctx.value, format, true);
      if (m.isValid()) {
        if (!noCoerce && !json) {
          ctx.value = m.toDate();
        }
        return [];
      }
    }
    return [
      {
        id: ExpectedDateFormat,
        text:
          `expected a date` + typeof format === 'string'
            ? ` with format ${format}`
            : ``,
        field: ctx.field,
      },
    ];
  };
}

/**
 * Validates a value as an iso date (YYYY-MM-DD).
 */
export function isoDate() {
  return dateFormat('YYYY-MM-DD');
}

/**
 * Validates a value as an iso date and time (e.g. 2013-02-04T22:44:30.652Z).
 */
export function isoDateTime() {
  return dateFormat(moment.ISO_8601);
}

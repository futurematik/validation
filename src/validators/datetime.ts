import {
  ValueValidator,
  ValidationMode,
  ValidationResult,
  ValidationOptions,
} from '../core';
import { isDate } from '../util';

export type DateParser = (str: string) => Date;

export interface DateParserOptions {
  parser?: DateParser;
}

export const DatetimeOptionsKey = 'datetime';
export const ExpectedDateFormat = 'EXPECTED_DATE_FORMAT';

export function datetime(): ValueValidator<Date> {
  return ({ value, field, mode, options }): ValidationResult<Date> => {
    const { parser } = getOpts(options);

    if (typeof value === 'string' && mode !== ValidationMode.Strict) {
      value = parser(value);
    }
    if (isDate(value)) {
      return { ok: true, value };
    }

    return {
      ok: false,
      errors: [
        {
          id: ExpectedDateFormat,
          text: `expected a date`,
          field: field,
        },
      ],
    };
  };
}

export function defaultDateParser(str: string): Date {
  return new Date(str);
}

export function datetimeOptions(opts: DateParserOptions): ValidationOptions {
  return {
    [DatetimeOptionsKey]: opts,
  };
}

function getOpts(options?: ValidationOptions): Required<DateParserOptions> {
  const opts = options && (options[DatetimeOptionsKey] as DateParserOptions);

  return {
    parser: defaultDateParser,
    ...opts,
  };
}

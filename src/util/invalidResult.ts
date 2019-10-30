import { ValidationResult, ValidationError } from '../core';
import { joinIds } from './joinIds';

export function invalidResult(
  id: string,
  text: string,
  field?: string,
  ...subFields: string[]
): ValidationResult<{}> {
  const error: ValidationError = { id, text, field };
  if (!subFields || !subFields.length) {
    return {
      ok: false,
      errors: [error],
    };
  }
  return {
    ok: false,
    errors: subFields.map(x => ({ ...error, field: joinIds(field, x) })),
  };
}

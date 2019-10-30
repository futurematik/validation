import { ValidationResult } from '../core';

export function validResult<T>(value: T): ValidationResult<T> {
  return { ok: true, value };
}

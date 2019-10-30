import { ValidationError } from './ValidationError';

export interface ValidationValidResult<T> {
  ok: true;
  value: T;
}

export interface ValidationInvalidResult {
  ok: false;
  errors: ValidationError[];
}

/**
 * ValidationResult describes the result from a validation operation.
 */
export type ValidationResult<T> =
  | ValidationValidResult<T>
  | ValidationInvalidResult;

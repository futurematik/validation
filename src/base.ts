/**
 * ModelValidationError occurs when validation fails.
 */
export class ModelValidationError extends Error {
  constructor(public errors: ValidationError[]) {
    super('validation failed');
  }
}

/**
 * ValidationError represents an error occuring during validation.
 */
export interface ValidationError {
  text: string; // textual description
  id: string; // programmatic identifier
  field?: string; // field name
  extra?: any; // extra info
}

/**
 * ValidationContext describes a value to be validated.
 */
export interface ValidationContext<T> {
  field?: string;
  value: T;
}

/**
 * ValueValidator is a function which validates a value and returns an error
 * object or undefined if no error found.
 */
export type ValueValidator<T> = (
  value: ValidationContext<T>,
) => ValidationError[];

/**
 * Wrap a validate call to throw an error if validation errors found.
 */
export function assertValid<T>(value: T, validator: ValueValidator<T>): void;
export function assertValid(errs: ValidationError[]): void;
export function assertValid<T>(
  value: ValidationError[] | T,
  validator?: ValueValidator<T>,
) {
  if (validator) {
    value = validator({ value: <T>value });
  } else if (!Array.isArray(value)) {
    throw new Error('expected an array of validation errors');
  }
  if (value.length) {
    throw new ModelValidationError(value);
  }
}

/**
 * Join dot-seperated identifier components.
 */
export function joinIds(first: string | undefined, ...ids: string[]): string {
  return [first, ...ids].filter(x => !!x).join('.');
}

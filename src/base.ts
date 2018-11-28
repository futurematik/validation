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
 * ValidationOptions control a validation operation.
 */
export interface ValidationOptions {
  parse?: boolean;
  strict?: boolean;
}

/**
 * ValidationContext describes a value to be validated.
 */
export interface ValidationContext<T> {
  field?: string;
  value: T;
  options?: ValidationOptions;
}

/**
 * ValidationResult describes the result from a validation operation.
 */
export interface ValidationResult<T> {
  value: T;
  errors: ValidationError[];
}

/**
 * ValueValidator is a function which validates a value and returns an error
 * object or undefined if no error found.
 */
export type ValueValidator<T> = (
  value: ValidationContext<T>,
) => ValidationResult<T>;

/**
 * Wrap a validate call to throw an error if validation errors found.
 */
export function assertValid<T>(
  value: T,
  validator: ValueValidator<T>,
  options?: ValidationOptions & { field?: string },
): T {
  options = options || {};
  const { field, ...opts } = options;
  const result = validator({ value: <T>value, field, options: opts });

  if (result.errors && result.errors.length) {
    throw new ModelValidationError(result.errors);
  }

  return result.value;
}

/**
 * Join dot-seperated identifier components.
 */
export function joinIds(first: string | undefined, ...ids: string[]): string {
  return [first, ...ids].filter(x => !!x).join('.');
}

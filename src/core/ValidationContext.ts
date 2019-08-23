import { ValidationMode } from './ValidationMode';
import { ValidationOptions } from './ValidationOptions';

/**
 * ValidationContext describes a value to be validated.
 */
export interface ValidationContext {
  field?: string;
  value: unknown;
  mode: ValidationMode;
  options?: ValidationOptions;
}

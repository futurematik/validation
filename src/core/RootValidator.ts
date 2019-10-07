import { ValidationContextBase } from './ValidationContext';
import { ValidationResult } from './ValidationResult';

export type RootValidator<T> = (
  value: unknown,
  context?: ValidationContextBase,
) => ValidationResult<T>;

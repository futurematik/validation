import { ExtraFieldsMode } from './ExtraFieldsMode';
import { ValidationMode } from './ValidationMode';
import { ValidationOptions } from './ValidationOptions';

export interface ValidationContextBase {
  extraFields?: ExtraFieldsMode;
  field?: string;
  mode: ValidationMode;
  options?: ValidationOptions;
}

export interface ValidationContext extends ValidationContextBase {
  value: unknown;
}

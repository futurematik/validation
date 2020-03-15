import { ModelDefinition, ValueValidator } from '../core';

/**
 * Return the model type.
 */
export type ModelTypeOf<T> = T extends ValueValidator<infer M>
  ? M
  : T extends ModelDefinition<infer M>
  ? M
  : never;

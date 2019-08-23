import { ModelDefinition } from '../core';

/**
 * Return the model type.
 */
export type ModelTypeOf<T> = T extends ModelDefinition<infer M> ? M : never;

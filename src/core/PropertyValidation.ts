import { ModelDefinition } from './ModelDefinition';

export type PropertyValidation<T> =
  | ModelDefinition<T>
  | ((value: T) => ModelDefinition<T>);

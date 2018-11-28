import { ValueValidator } from './base';

/**
 * Don't perform validation.
 */
export function any(): ValueValidator<any> {
  return ({ value }) => ({ value, errors: [] });
}

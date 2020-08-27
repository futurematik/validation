import 'jest';
import { dictionary } from './dictionary';
import {
  ValidationMode,
  ValidationValidResult,
  ValidationInvalidResult,
  ValueValidator,
  ValidationResult,
} from '../core';
import { integer, ExpectedInteger } from './integer';
import { invalidResult, validResult } from '../util';
import { ExpectedString } from './text';

describe('dictionary', () => {
  it('returns success for a dictionary', () => {
    const value = {
      one: 1,
      two: 2,
      three: 3,
    };

    const result = dictionary(integer())({
      value,
      mode: ValidationMode.Strict,
    });

    expect(result.ok).toBe(true);
    expect((result as ValidationValidResult<typeof value>).value).toEqual(
      value,
    );
  });

  it('returns fail for a dictionary with invalid values', () => {
    const value = {
      one: 1,
      two: 'two',
      three: 3,
    };

    const result = dictionary(integer())({
      value,
      mode: ValidationMode.Strict,
      field: 'somefield',
    });

    expect(result.ok).toBe(false);

    const errors = (result as ValidationInvalidResult).errors;

    expect(errors).toHaveLength(1);
    expect(errors[0].field).toBe('somefield.two');
    expect(errors[0].id).toBe(ExpectedInteger);
  });

  it('returns fail for a dictionary with invalid keys', () => {
    const value = {
      one: 1,
      Two: 'two',
      three: 3,
    };

    const result = dictionary(
      integer(),
      lowercase(),
    )({
      value,
      mode: ValidationMode.Strict,
      field: 'somefield',
    });

    expect(result.ok).toBe(false);

    const errors = (result as ValidationInvalidResult).errors;

    expect(errors).toHaveLength(1);
    expect(errors[0].field).toBe('somefield.[Two]');
    expect(errors[0].id).toBe('EXPECTED_LOWERCASE');
  });
});

function lowercase(): ValueValidator<string> {
  return ({ value, field }): ValidationResult<string> => {
    if (typeof value !== 'string') {
      return invalidResult(ExpectedString, 'expected string', field);
    }
    if (value.toLowerCase() !== value) {
      return invalidResult('EXPECTED_LOWERCASE', 'expected lowercase', field);
    }
    return validResult(value);
  };
}

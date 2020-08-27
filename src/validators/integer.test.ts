import 'jest';
import {
  integer,
  ExpectedInteger,
  ExpectedIntegerMinimum,
  ExpectedIntegerMaximum,
} from './integer';
import { ValidationMode } from '../core';
import { assert } from '../util/assert';

describe('integer', () => {
  it('passes a valid value', () => {
    const result = integer()({ value: 1, mode: ValidationMode.Strict });

    expect(result).toEqual({
      ok: true,
      value: 1,
    });
  });

  it('rejects a string in strict mode', () => {
    const result = integer()({
      value: '1',
      mode: ValidationMode.Strict,
      field: 'thefield',
    });

    expect(result.ok).toBe(false);
    assert(result.ok === false);

    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].id).toEqual(ExpectedInteger);
    expect(result.errors[0].field).toEqual('thefield');
  });

  it('accepts a string in string mode', () => {
    const result = integer()({ value: '1', mode: ValidationMode.String });

    expect(result).toEqual({
      ok: true,
      value: 1,
    });
  });

  it('accepts a value higher than minValue', () => {
    const result = integer({ minValue: 10 })({
      value: 11,
      mode: ValidationMode.Strict,
      field: 'thefield',
    });

    expect(result).toEqual({
      ok: true,
      value: 11,
    });
  });

  it('accepts a value equal to minValue', () => {
    const result = integer({ minValue: 10 })({
      value: 10,
      mode: ValidationMode.Strict,
      field: 'thefield',
    });

    expect(result).toEqual({
      ok: true,
      value: 10,
    });
  });

  it('rejects a value lower than minValue', () => {
    const result = integer({ minValue: 10 })({
      value: 9,
      mode: ValidationMode.Strict,
      field: 'thefield',
    });

    expect(result.ok).toBe(false);
    assert(result.ok === false);

    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].id).toEqual(ExpectedIntegerMinimum);
    expect(result.errors[0].field).toEqual('thefield');
  });

  it('accepts a value lower than maxValue', () => {
    const result = integer({ maxValue: 10 })({
      value: 9,
      mode: ValidationMode.Strict,
      field: 'thefield',
    });

    expect(result).toEqual({
      ok: true,
      value: 9,
    });
  });

  it('accepts a value equal to maxValue', () => {
    const result = integer({ maxValue: 10 })({
      value: 10,
      mode: ValidationMode.Strict,
      field: 'thefield',
    });

    expect(result).toEqual({
      ok: true,
      value: 10,
    });
  });

  it('rejects a value higher than maxValue', () => {
    const result = integer({ maxValue: 10 })({
      value: 11,
      mode: ValidationMode.Strict,
      field: 'thefield',
    });

    expect(result.ok).toBe(false);
    assert(result.ok === false);

    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].id).toEqual(ExpectedIntegerMaximum);
    expect(result.errors[0].field).toEqual('thefield');
  });
});

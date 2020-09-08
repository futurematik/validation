import 'jest';
import { email, ExpectedEmail } from './email';
import { ValidationMode } from '../core';
import { assert } from '../util/assert';

describe('email', () => {
  it('accepts a common email format', () => {
    const result = email()({
      value: 'gordon.leigh.101@example.com',
      field: 'theemail',
      mode: ValidationMode.Strict,
    });

    expect(result).toEqual({
      ok: true,
      value: 'gordon.leigh.101@example.com',
    });
  });

  it('accepts plus addressing', () => {
    const result = email()({
      value: 'gordon.leigh+some.other.stuff9@example.com',
      field: 'theemail',
      mode: ValidationMode.Strict,
    });

    expect(result).toEqual({
      ok: true,
      value: 'gordon.leigh+some.other.stuff9@example.com',
    });
  });

  it('accepts emails on TLDs', () => {
    const result = email()({
      value: 'g@example',
      field: 'theemail',
      mode: ValidationMode.Strict,
    });

    expect(result).toEqual({
      ok: true,
      value: 'g@example',
    });
  });

  it('rejects a comma in the domain', () => {
    const result = email()({
      value: 'gordon.leigh.101@example,com',
      field: 'theemail',
      mode: ValidationMode.Strict,
    });

    expect(result.ok).toBe(false);
    assert(!result.ok);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].id).toEqual(ExpectedEmail);
    expect(result.errors[0].field).toEqual('theemail');
  });

  it('rejects a space in the domain', () => {
    const result = email()({
      value: 'gordon.leigh.101@ example.com',
      field: 'theemail',
      mode: ValidationMode.Strict,
    });

    expect(result.ok).toBe(false);
    assert(!result.ok);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].id).toEqual(ExpectedEmail);
    expect(result.errors[0].field).toEqual('theemail');
  });

  it('rejects a space in the user part', () => {
    const result = email()({
      value: 'gordon leigh@example.com',
      field: 'theemail',
      mode: ValidationMode.Strict,
    });

    expect(result.ok).toBe(false);
    assert(!result.ok);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].id).toEqual(ExpectedEmail);
    expect(result.errors[0].field).toEqual('theemail');
  });

  it('rejects multiple ats', () => {
    const result = email()({
      value: 'gordon@leigh@example.com',
      field: 'theemail',
      mode: ValidationMode.Strict,
    });

    expect(result.ok).toBe(false);
    assert(!result.ok);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].id).toEqual(ExpectedEmail);
    expect(result.errors[0].field).toEqual('theemail');
  });

  it('rejects zero ats', () => {
    const result = email()({
      value: 'example.com',
      field: 'theemail',
      mode: ValidationMode.Strict,
    });

    expect(result.ok).toBe(false);
    assert(!result.ok);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].id).toEqual(ExpectedEmail);
    expect(result.errors[0].field).toEqual('theemail');
  });
});

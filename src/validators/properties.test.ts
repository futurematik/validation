import 'jest';
import { properties } from './properties';
import { integer } from './integer';
import { text } from './text';
import { ValidationMode, ExtraFieldsMode } from '../core';
import { optional } from './optional';

describe('properties', () => {
  it('passes a valid object', () => {
    const value = {
      one: 1,
      two: 2,
      three: '3',
    };

    const validator = properties({
      one: integer(),
      two: integer(),
      three: text(),
    });

    const result = validator({ value, mode: ValidationMode.Strict });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value).toEqual({
        one: 1,
        two: 2,
        three: '3',
      });
    }
  });

  it('fails an invalid object', () => {
    const value = {
      one: 1,
      two: 2,
      three: '3',
    };

    const validator = properties({
      one: integer(),
      two: integer(),
      three: integer(),
    });

    const result = validator({ value, mode: ValidationMode.Strict });

    expect(result.ok).toBe(false);
  });

  it('does not modify the source value', () => {
    const value = {
      one: 1,
      two: 2,
      three: '3',
    };

    const validator = properties({
      one: integer(),
      two: integer(),
      three: integer(),
    });

    const result = validator({ value, mode: ValidationMode.String });

    expect(result.ok).toBe(true);

    expect(value).toEqual({
      one: 1,
      two: 2,
      three: '3',
    });

    if (result.ok) {
      expect(result.value).toEqual({
        one: 1,
        two: 2,
        three: 3,
      });
    }
  });

  it('allows optional props to be omitted', () => {
    const value = {
      one: 1,
      two: 2,
    };

    const validator = properties({
      one: integer(),
      two: integer(),
      three: optional(text()),
    });

    const result = validator({ value, mode: ValidationMode.Strict });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value).toEqual({
        one: 1,
        two: 2,
      });
    }
  });

  it('rejects extra fields by default', () => {
    const value = {
      one: 1,
      two: 2,
      extra1: 'a',
      extra2: 'b',
    };

    const validator = properties({
      one: integer(),
      two: integer(),
    });

    const result = validator({
      value,
      mode: ValidationMode.Strict,
    });

    expect(result.ok).toBe(false);
  });

  it('rejects extra fields if extraFields is Fail', () => {
    const value = {
      one: 1,
      two: 2,
      extra1: 'a',
      extra2: 'b',
    };

    const validator = properties({
      one: integer(),
      two: integer(),
    });

    const result = validator({
      value,
      mode: ValidationMode.Strict,
      extraFields: ExtraFieldsMode.Fail,
    });

    expect(result.ok).toBe(false);
  });

  it('ignores extra fields if extraFields is Ignore', () => {
    const value = {
      one: 1,
      two: 2,
      extra1: 'a',
      extra2: 'b',
    };

    const validator = properties({
      one: integer(),
      two: integer(),
    });

    const result = validator({
      value,
      mode: ValidationMode.Strict,
      extraFields: ExtraFieldsMode.Ignore,
    });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value).toEqual({
        one: 1,
        two: 2,
      });
    }
  });

  it('includes extra fields if extraFields is Include', () => {
    const value = {
      one: 1,
      two: 2,
      extra1: 'a',
      extra2: 'b',
    };

    const validator = properties({
      one: integer(),
      two: integer(),
    });

    const result = validator({
      value,
      mode: ValidationMode.Strict,
      extraFields: ExtraFieldsMode.Include,
    });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value).toEqual({
        one: 1,
        two: 2,
        extra1: 'a',
        extra2: 'b',
      });
    }
  });

  it('rejects extra fields if allowExtraFields is Fail', () => {
    const value = {
      one: 1,
      two: 2,
      extra1: 'a',
      extra2: 'b',
    };

    const validator = properties(
      {
        one: integer(),
        two: integer(),
      },
      ExtraFieldsMode.Fail,
    );

    const result = validator({
      value,
      mode: ValidationMode.Strict,
      extraFields: ExtraFieldsMode.Include,
    });

    expect(result.ok).toBe(false);
  });

  it('ignores extra fields if allowExtraFields is Ignore', () => {
    const value = {
      one: 1,
      two: 2,
      extra1: 'a',
      extra2: 'b',
    };

    const validator = properties(
      {
        one: integer(),
        two: integer(),
      },
      ExtraFieldsMode.Ignore,
    );

    const result = validator({
      value,
      mode: ValidationMode.Strict,
      extraFields: ExtraFieldsMode.Fail,
    });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value).toEqual({
        one: 1,
        two: 2,
      });
    }
  });

  it('includes extra fields if allowExtraFields is Include', () => {
    const value = {
      one: 1,
      two: 2,
      extra1: 'a',
      extra2: 'b',
    };

    const validator = properties(
      {
        one: integer(),
        two: integer(),
      },
      ExtraFieldsMode.Include,
    );

    const result = validator({
      value,
      mode: ValidationMode.Strict,
      extraFields: ExtraFieldsMode.Fail,
    });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.value).toEqual({
        one: 1,
        two: 2,
        extra1: 'a',
        extra2: 'b',
      });
    }
  });
});

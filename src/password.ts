import * as zxcvbn from 'zxcvbn';
import { ValueValidator } from './base';

export const ExpectedSecurePassword = 'EXPECTED_SECURE_PASSWORD';

/**
 * Validate a password against a complexity score.
 * @param minScore Minimum complexity score 0 <= x <= 4.
 */
export function password(minScore: number = 3): ValueValidator<string> {
  return ctx => {
    const result = zxcvbn(ctx.value);

    if (result.score >= minScore) {
      return { value: ctx.value, errors: [] };
    }
    return {
      value: ctx.value,
      errors: [
        {
          id: ExpectedSecurePassword,
          text: ctx.value ? formatPasswordResult(result) : 'required',
          field: ctx.field,
          extra: result,
        },
      ],
    };
  };
}

export function formatPasswordResult(result: zxcvbn.ZXCVBNResult): string {
  let suggestion = '';
  if (result.feedback.suggestions && result.feedback.suggestions.length) {
    suggestion = ` (${result.feedback.suggestions[0]})`;
  }
  const warning =
    result.feedback.warning ||
    `This can be cracked in ${
      result.crack_times_display.online_no_throttling_10_per_second
    }`;
  const score = Math.round(Math.min(10 * result.guesses_log10, 100));
  return `Score ${score}%. ` + warning + suggestion;
}

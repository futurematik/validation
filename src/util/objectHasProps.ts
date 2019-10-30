export function objectHasProps<K extends PropertyKey>(
  value: unknown,
  ...props: K[]
): value is { [P in K]: unknown } {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  return props.reduce((a, x) => a && x in value, true as boolean);
}

export const isNumber = (value: unknown): value is number => !isNaN(Number(value));

export const isBigInt = (value: unknown): value is bigint => {
  return typeof value === 'bigint' ||
    (typeof value === 'object' &&
      value !== null &&
      value.constructor === BigInt);
};

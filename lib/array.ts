export const isValidStringArray = (value: unknown): value is Array<string> => {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
};

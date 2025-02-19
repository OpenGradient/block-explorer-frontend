/** A type-safe function that uses Object.keys(). */
export const getObjectKeys = <T extends object>(obj: T): Array<keyof T> => {
  return Object.keys(obj) as Array<keyof T>;
};

export const getObjectEntries = <T extends object>(
  obj: T,
): Array<{ [K in keyof T]: [K, T[K]] }[keyof T]> => {
  return Object.entries(obj) as Array<{ [K in keyof T]: [K, T[K]] }[keyof T]>;
};

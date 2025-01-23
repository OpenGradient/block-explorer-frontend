export interface TensorLibJsonScalar {
  name: string;
  value: string;
}

export interface TensorLibNumber {
  value: string;
  decimals: string;
}

export interface TensorLibStringTensor {
  name: string;
  values: Array<string>;
}

export interface TensorLibMultiDimensionalNumberTensor {
  name: string;
  values: Array<TensorLibNumber>;
  shape: Array<number>;
}

export interface ModelOutput {
  numbers: Array<TensorLibMultiDimensionalNumberTensor>;
  strings: Array<TensorLibStringTensor>;
  jsons: Array<TensorLibJsonScalar>;
  isSimulationResult: boolean;
}

/**
 * ```ts
 * [string, string]
 * ```
 */
export type TensorLibNumberArray = [string, string];

/**
 * ```ts
 * [string, Array<[string, string]>, Array<number>]
 * ```
 */
export type TensorLibMultiDimensionalNumberTensorArray = [string, Array<TensorLibNumberArray>, Array<number>];

/**
 * ```ts
 * [string, Array<string>]
 * ```
 */
export type TensorLibStringTensorArray = [string, Array<string>];

/**
 * ```ts
 * [string, string]
 * ```
 */
export type TensorLibJsonScalarArray = [string, string];

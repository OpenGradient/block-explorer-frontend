export enum InferenceEvent {
  InferenceResult = 'InferenceResult',
  LLMChatResult = 'LLMChatResult',
  LLMCompletionResult = 'LLMCompletionResult',
};

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

export type InferenceResultParam = [Array<TensorLibMultiDimensionalNumberTensor>, Array<TensorLibStringTensor>, Array<TensorLibJsonScalar>, string];

/**
 * ```ts
 * [string, string]
 * ```
 */
export type NumberTensorArray = [string, string];

/**
 * ```ts
 * [string, Array<[string, string]>, Array<number>]
 * ```
 */
export type MultiDimensionalNumberTensorArray = [string, Array<NumberTensorArray>, Array<number>];

/**
 * ```ts
 * [string, Array<string>]
 * ```
 */
export type StringTensorArray = [string, Array<string>];

/**
 * ```ts
 * [string, string]
 * ```
 */
export type JsonScalarArray = [string, string];

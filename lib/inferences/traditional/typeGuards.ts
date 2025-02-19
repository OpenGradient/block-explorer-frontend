import type { ModelInput,
  TensorLibJsonScalarArray, TensorLibMultiDimensionalNumberTensorArray,
  TensorLibNumberArray, TensorLibStringTensorArray,
} from 'types/client/inference/traditional';

import { isNumber, isBigInt } from 'lib/number';
import { getObjectKeys } from 'lib/object';

export const isValidNumberTensorArray = (tensor: unknown): tensor is TensorLibNumberArray => {
  if (!Array.isArray(tensor) || tensor.length !== 2) {
    return false;
  }

  const [ value, decimals ] = tensor;
  return (isNumber(value) || isBigInt(value)) && (isNumber(decimals) || isBigInt(decimals));
};

export const isValidMultiDimensionalNumberTensorArray = (tensor: unknown): tensor is TensorLibMultiDimensionalNumberTensorArray => {
  if (!Array.isArray(tensor) || tensor.length !== 3) {
    return false;
  }

  const [ name, values, shape ] = tensor;
  if (typeof name !== 'string') {
    return false;
  }

  // Validate values array
  if (!Array.isArray(values)) {
    return false;
  }
  if (!values.every(isValidNumberTensorArray)) {
    return false;
  }

  // Validate shape array
  return Array.isArray(shape) &&
    shape.every(s => isNumber(s) || isBigInt(s));
};

export const isValidStringTensorArray = (tensor: unknown): tensor is TensorLibStringTensorArray => {
  if (!Array.isArray(tensor) || tensor.length !== 2) {
    return false;
  }

  const [ name, values ] = tensor;
  return typeof name === 'string' &&
    Array.isArray(values) &&
    values.every(v => typeof v === 'string');
};

export const isValidJsonScalarArray = (scalar: unknown): scalar is TensorLibJsonScalarArray => {
  if (!Array.isArray(scalar) || scalar.length !== 2) {
    return false;
  }

  const [ name, value ] = scalar;
  return typeof name === 'string' && typeof value === 'string';
};

export const isModelInput = (value: unknown): value is ModelInput => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const input = value as Record<string, unknown>;

  if (getObjectKeys(input).length !== 2) {
    return false;
  }

  if ('numbers' in input && 'strings' in input) {
    return true;
  }

  return false;
};

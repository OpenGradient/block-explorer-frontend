import {
  type TensorLibJsonScalarArray,
  type ModelOutput,
  type TensorLibMultiDimensionalNumberTensorArray,
  type TensorLibNumberArray,
  type TensorLibStringTensorArray,
  type TensorLibNumber,
} from 'types/client/inference/traditional';

const isNumber = (value: unknown): value is number => !isNaN(Number(value));

export const convertArrayToModelOutput = (value: unknown): false | ModelOutput => {
  const modelOutput: ModelOutput = {
    numbers: [],
    strings: [],
    jsons: [],
    isSimulationResult: false,
  };

  // Check if it's an array with exactly 4 elements
  if (!Array.isArray(value) || value.length !== 4) {
    return false;
  }

  const [ numbersTensor, stringsTensor, jsonsTensor, isSimulation ] = value;

  // Check if last element is a string that can be converted to boolean
  if (typeof isSimulation !== 'string' || (isSimulation !== 'true' && isSimulation !== 'false')) {
    return false;
  }
  modelOutput.isSimulationResult = Boolean(isSimulation === 'true');

  // Validate number tensors array
  if (!Array.isArray(numbersTensor)) {
    return false;
  }
  if (!numbersTensor.every(isValidMultiDimensionalNumberTensorArray)) {
    return false;
  }
  modelOutput.numbers = numbersTensor.map(tensor => {
    const [ name, numberValues, shape ] = tensor;

    return {
      name,
      values: numberValues.map((pair): TensorLibNumber => ({
        value: pair[0],
        decimals: pair[1],
      })),
      shape: shape.map(Number),
    };
  });

  // Validate string tensors array
  if (!Array.isArray(stringsTensor)) {
    return false;
  }
  if (!stringsTensor.every(isValidStringTensorArray)) {
    return false;
  }
  modelOutput.strings = stringsTensor.map(tensor => ({
    name: tensor[0],
    values: tensor[1],
  }));

  // Validate json scalars array
  if (!Array.isArray(jsonsTensor)) {
    return false;
  }
  if (!jsonsTensor.every(isValidJsonScalarArray)) {
    return false;
  }
  modelOutput.jsons = jsonsTensor.map(scalar => ({
    name: scalar[0],
    value: scalar[1],
  }));

  return modelOutput;
};

const isValidNumberTensorArray = (tensor: unknown): tensor is TensorLibNumberArray => {
  if (!Array.isArray(tensor) || tensor.length !== 2) {
    return false;
  }

  const [ value, decimals ] = tensor;
  return typeof value === 'string' && typeof decimals === 'string' && isNumber(value) && isNumber(decimals);
};

const isValidMultiDimensionalNumberTensorArray = (tensor: unknown): tensor is TensorLibMultiDimensionalNumberTensorArray => {
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
    shape.every(s => typeof s === 'string' && isNumber(s));
};

const isValidStringTensorArray = (tensor: unknown): tensor is TensorLibStringTensorArray => {
  if (!Array.isArray(tensor) || tensor.length !== 2) {
    return false;
  }

  const [ name, values ] = tensor;
  return typeof name === 'string' &&
    Array.isArray(values) &&
    values.every(v => typeof v === 'string');
};

const isValidJsonScalarArray = (scalar: unknown): scalar is TensorLibJsonScalarArray => {
  if (!Array.isArray(scalar) || scalar.length !== 2) {
    return false;
  }

  const [ name, value ] = scalar;
  return typeof name === 'string' && typeof value === 'string';
};

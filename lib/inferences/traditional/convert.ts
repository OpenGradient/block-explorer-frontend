import type { ModelInput, TensorLibNumber, type ModelOutput } from 'types/client/inference/traditional';

import { isValidJsonScalarArray, isValidMultiDimensionalNumberTensorArray, isValidStringTensorArray } from './typeGuards';

export const convertArrayToModelInput = (value: unknown): false | ModelInput => {
  const modelInput: ModelInput = {
    numbers: [],
    strings: [],
  };

  // Check if it's an array with exactly 2 elements
  if (!Array.isArray(value) || value.length !== 2) {
    return false;
  }

  const [ numbersTensor, stringsTensor ] = value;

  // Validate number tensors array
  if (!Array.isArray(numbersTensor)) {
    return false;
  }

  if (!numbersTensor.every(isValidMultiDimensionalNumberTensorArray)) {
    return false;
  }

  modelInput.numbers = numbersTensor.map(tensor => {
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
  modelInput.strings = stringsTensor.map(tensor => ({
    name: tensor[0],
    values: tensor[1],
  }));

  return modelInput;
};

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

export default function reshapeArray(array: Array<number>, dimensions: Array<number>): Array<unknown> {
  // Calculate total elements needed based on dimensions
  const totalElements = dimensions.reduce((acc, dim) => acc * dim, 1);

  // Validate input array length matches required elements
  if (array.length !== totalElements) {
    throw new Error(`Array length ${ array.length } does not match required elements ${ totalElements }`);
  }

  // Base case: if only one dimension left, return slice of array
  if (dimensions.length === 1) {
    return array.slice(0, dimensions[0]);
  }

  // Get current dimension and remaining dimensions
  const [ currentDim, ...remainingDims ] = dimensions;
  const subArraySize = remainingDims.reduce((acc, dim) => acc * dim, 1);

  // Create subarrays
  return Array.from({ length: currentDim }, (_, i) => {
    const start = i * subArraySize;
    const subArray = array.slice(start, start + subArraySize);
    return reshapeArray(subArray, remainingDims);
  });
};

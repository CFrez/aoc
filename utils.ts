export function getNumberArray(input: string): number[] {
  const numbersArray: number[] = [];
  for (const number of input.matchAll(/\d+/g)) {
    numbersArray.push(parseInt(number[0]));
  }
  return numbersArray;
}

export function getNumbersArray(input: string): number[][] {
  const linesArray: number[][] = [];
  for (const line of input.split("\n")) {
    linesArray.push(getNumberArray(line));
  }
  return linesArray;
}

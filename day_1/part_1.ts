import { getNumberArray } from "../utils";

const fs = require("fs");

const sample = fs.readFileSync("sample.txt", "utf-8");
const input = fs.readFileSync("input.txt", "utf-8");

/**
 * There are two lists of numbers that are found. The two lists are vertical in the txt
 * file, so we need to split the numbers by the newline character. The numbers are separated
 * by three spaces, so we split the numbers by that. We then sort the two lists of numbers
 * and find the sum of the absolute difference between the two lists.
 */
function getOrderedDifference(label: string, numbers: string) {
  const a: number[] = [];
  const b: number[] = [];

  numbers.split("\n").forEach((element) => {
    const digits = getNumberArray(element);
    a.push(Number(digits[0]));
    b.push(Number(digits[1]));
  });

  a.sort((a, b) => a - b);
  b.sort((a, b) => a - b);

  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += Math.abs(a[i] - b[i]);
  }

  console.log(`${label}: ${sum}`);
}

getOrderedDifference("sample", sample);
getOrderedDifference("input", input);

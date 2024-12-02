import { getNumberArray } from "../utils";

const fs = require("fs");

const sample = fs.readFileSync("sample.txt", "utf-8");
const input = fs.readFileSync("input.txt", "utf-8");

/**
 * There are two lists of numbers that are found. The two lists are vertical in the txt
 * file, so we need to split the numbers by the newline character. The numbers are separated
 * by three spaces, so we split the numbers by that.
 *
 *
 */
function getOrderedDifference(label: string, numbers: string) {
  const a: number[] = [];
  const bCount: Record<number, number> = {};

  numbers.split("\n").forEach((element) => {
    const digits = getNumberArray(element);
    a.push(digits[0]);
    bCount[digits[1]] = (bCount[digits[1]] || 0) + 1;
  });

  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    const num = a[i];
    if (num in bCount) {
      sum += num * bCount[num];
    }
  }

  console.log(`${label}: ${sum}`);
}

getOrderedDifference("sample", sample);
getOrderedDifference("input", input);

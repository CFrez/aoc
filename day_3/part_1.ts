const fs = require("fs");

const sample = fs.readFileSync("sample.txt", "utf-8");
const input = fs.readFileSync("input.txt", "utf-8");

const regex = /mul\((?<first>\d+),(?<second>\d+)\)/g;

const sumAllMatches = (label: string, string: string) => {
  let sum = 0;
  let match;
  while ((match = regex.exec(string)) !== null) {
    const { first, second } = match.groups;
    sum += parseInt(first) * parseInt(second);
  }

  console.log(label, sum);
  return sum;
};

sumAllMatches("Sample:", sample);
sumAllMatches("Input:", input);

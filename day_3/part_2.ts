const fs = require("fs");

const sample = fs.readFileSync("sample2.txt", "utf-8");
const input = fs.readFileSync("input.txt", "utf-8");

const regex = /mul\((?<first>\d+),(?<second>\d+)\)/g;

const sumAllMatches = (string: string) => {
  let sum = 0;
  let match;
  while ((match = regex.exec(string)) !== null) {
    const { first, second } = match.groups;
    sum += parseInt(first) * parseInt(second);
  }
  return sum;
};

const findUsableStrings = (label: string, string: string) => {
  let doString = "";

  const dontArray = string.split("don't()");
  dontArray.forEach((dont, index) => {
    if (index === 0) {
      doString += dont;
    } else if (dont.includes("do()")) {
      const doIndex = dont.indexOf("do()");
      doString += dont.slice(doIndex);
    }
  });

  const sum = sumAllMatches(doString);

  console.log(label, sum);
};

findUsableStrings("Sample:", sample);
findUsableStrings("Input:", input);

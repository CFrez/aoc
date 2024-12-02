import { getNumbersArray } from "../utils";

const fs = require("fs");

const sample = fs.readFileSync("sample.txt", "utf-8");
const input = fs.readFileSync("input.txt", "utf-8");

const determineIfReportIsSafe = (report: number[]): boolean => {
  const checkAll = (array: number[]): boolean => {
    const allDescending = array.every((num, i, arr) => {
      if (i === 0) return true;
      if (num >= arr[i - 1]) {
        const diff = num - arr[i - 1];
        return diff <= 3 && diff >= 1;
      }
    });

    const allAscending = array.every((num, i, arr) => {
      if (i === 0) return true;
      if (num <= arr[i - 1]) {
        const diff = arr[i - 1] - num;
        return diff <= 3 && diff >= 1;
      }
    });

    return allDescending || allAscending;
  };

  if (checkAll(report)) {
    return true;
  }

  for (let i = 0; i < report.length; i++) {
    const copy = [...report];
    copy.splice(i, 1);
    if (checkAll(copy)) {
      return true;
    }
  }

  return false;
};

const countSafeReports = (label: string, input: string): number => {
  const reports = getNumbersArray(input);
  let count = 0;
  for (let i = 0; i < reports.length; i++) {
    if (determineIfReportIsSafe(reports[i])) {
      count += 1;
    }
  }

  console.log(label, count);
  return count;
};

countSafeReports("Sample:", sample);
countSafeReports("Input:", input);

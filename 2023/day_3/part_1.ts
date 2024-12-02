const fs = require("fs")

const sample = fs.readFileSync("sample.txt", "utf-8")
const input = fs.readFileSync("input.txt", "utf-8")

/**
 * New Line Separated Input.
 * Fixed width.
 * Can have numbers and symbols spaced with periods.
 */
type Input = string

type LineIndex = number

/**
 * For each line with symbols, store the index of each symbol
 */
type Symbols = {
    [key: LineIndex]: number[]
}

/**
 * For each line with numbers, store an object with the line number,
 * then an array of the index of each number of the number
 */
type Numbers = {
    [key: LineIndex]: LineNumber[]
}

/**
 * For each number on a line, store the line number,
 * then index of each number of the number,
 * and the index of one previous and one after the number
 */
type LineNumber = {
    lineNumber: number
    indexArray: number[]
}

function collectSymbols (input: Input) {
    const symbols: Symbols = {}
    let line = 1
    for (const lineString of input.split("\n")) {
        for (const lineSymbols of lineString.matchAll(/[^\d.]/g)) {
            if (!symbols[line]) {
                symbols[line] = [lineSymbols.index!]
            } else {
                symbols[line].push(lineSymbols.index!)
            }
        }
        line += 1
    }
    return symbols
}

function collectNumbers (input: Input) {
    const numbers: Numbers = {}
    let line = 1
    for (const lineString of input.split("\n")) {
        for (const match of lineString.matchAll(/\d+/g)) {
            function generateLineNumber(match: RegExpMatchArray) {
                const length = match[0].length
                const indexArray: number[] = [match.index!]
                indexArray.push(match.index! - 1)
                if (length > 1 ) {
                    for (let i = 1; i < length; i++) {
                        indexArray.push(match.index! + i)
                    }
                }
                indexArray.push(match.index! + length)
                return {
                    lineNumber: parseInt(match[0]),
                    indexArray: indexArray
                }
            }

            if (!numbers[line]) {
                numbers[line] = [generateLineNumber(match)]
            } else {
                numbers[line].push(generateLineNumber(match))
            }
        }
        line += 1
    }
    return numbers
}

function checkLinesOfSymbols(symbols: Symbols, line: number, indexArray: number[]) {
    for (const index of indexArray) {
        if (symbols[line - 1] && symbols[line - 1].includes(index)) {
            return true
        }
        if (symbols[line] && symbols[line].includes(index)) {
            return true
        }
        if (symbols[line + 1] && symbols[line + 1].includes(index)) {
            return true
        }

    }
    return false
}

function findPartNumbers(label:string, input: Input) {
    const symbols: Symbols = collectSymbols(input)
    const numbers: Numbers = collectNumbers(input)

    const partNumbers: number[] = []

    for (const [lineIndex, lineNumbers] of Object.entries(numbers)) {
        const lineIndexInt = parseInt(lineIndex)
        for (const lineNumber of lineNumbers) {
            if (checkLinesOfSymbols(symbols, lineIndexInt, lineNumber.indexArray)) {
                partNumbers.push(lineNumber.lineNumber)
            }
        }
    }
    console.log(`${label}: ${partNumbers.reduce((a, b) => a + b, 0)}`)
}

findPartNumbers("Sample", sample)
findPartNumbers("Input", input)

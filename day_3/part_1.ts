const fs = require("fs")

const sample = fs.readFileSync("sample.txt", "utf-8")
const input = fs.readFileSync("input.txt", "utf-8")

type Line = number

type Symbols = {
    [key: Line]: number[]
}

type LineNumber = {
    lineNumber: number
    indexArray: number[]
}

type Numbers = {
    [key: Line]: LineNumber[]
}

const collectSymbols = (input: string) => {
    const symbols: Symbols = {}
    let line = 1
    for (const lineString of input.split("\n")) {
        for (const lineSymbols of lineString.matchAll(/[^\d.]/g)) {
            if (lineSymbols.index) {
                if (!symbols[line]) {
                    symbols[line] = [lineSymbols.index]
                } else {
                    symbols[line].push(lineSymbols.index)
                }
            }
        }
        line += 1
    }
    return symbols
}

const collectNumbers = (input: string) => {
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

function findPartNumbers(label:string, input: string) {
    const symbols = collectSymbols(input)
    const numbers = collectNumbers(input)
    const partNumbers: number[] = []
    for (const [line, lineNumbers] of Object.entries(numbers)) {
        const lineInt = parseInt(line)
        for (const lineNumber of lineNumbers) {
            if (checkLinesOfSymbols(symbols, lineInt, lineNumber.indexArray)) {
                partNumbers.push(lineNumber.lineNumber)
            }
        }
    }
    console.log(`${label}: ${partNumbers.reduce((a, b) => a + b, 0)}`)
}

findPartNumbers("Sample", sample)
findPartNumbers("Input", input)

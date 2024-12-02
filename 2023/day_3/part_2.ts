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
        for (const lineSymbols of lineString.matchAll(/\*/g)) {
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

function checkIfTwoNumbers(line: number, index: number, numbers: Numbers) {
    const gearNumbers: number[] = []

    function checkLineNumbers(offset: number) {
        if (numbers[line + offset]) {
            for (const lineNumber of numbers[line + offset]) {
                if (lineNumber.indexArray.includes(index)) {
                    gearNumbers.push(lineNumber.lineNumber)
                }
            }
        }
    }

    checkLineNumbers(-1)
    checkLineNumbers(0)
    checkLineNumbers(1)

    if (gearNumbers.length === 2) {
        return gearNumbers[0] * gearNumbers[1]
    }
}

function findTotalGearRatio(label:string, input: string) {
    const symbols = collectSymbols(input)
    const numbers = collectNumbers(input)
    const gearRatios: number[] = []
    for (const line in symbols) {
        for (const index of symbols[line]) {
            const gearRatio = checkIfTwoNumbers(parseInt(line), index, numbers)
            if (gearRatio) {
                gearRatios.push(gearRatio)
            }
        }
    }
    console.log(`${label}: ${gearRatios.reduce((a, b) => a + b, 0)}`)
}

findTotalGearRatio("Sample", sample)
findTotalGearRatio("Input", input)

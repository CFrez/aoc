import { getNumberArray } from "../utils"
const fs = require("fs")

const sample = fs.readFileSync("sample.txt", "utf-8")
const input = fs.readFileSync("input.txt", "utf-8")

// There is a toy boat with a button to charge it, the amount of seconds you hold
// the button for is how much distance it will go for each second remaining.

/**
 * Each Race in the Input has a time limit and a record distance.
 * The input is a string with `Time:` with numbers separated by spaces, newline,
 * then `Distance:` with numbers separated by spaces.
 */
type Input = string

/**
 * The Input will be modified into the object below.
 * The quantity of numbers in each array will be the same.
 * The index of the number in the array will be the race number.
 */
type Data = {
    time: number[]
    distance: number[]
}

/**
 * These are the items that will be used to calculate the results.
 * timeLimit and recordDistance will come from the input object.
 *
 * buttonTime = speed
 * remainingTime = timeLimit - buttonTime
 * distance = speed * remainingTime
 * success = distance >= recordDistance
*/

/**
 * To collect the answer needed we need to know the product of how many ways
 * each race can be won.
 * This will collect the quantity of ways for each race.
 */
type WinQuantities = number[]



function cleanInputData(input: Input): Data {
    const time = getNumberArray(input.split("\n")[0].split(":")[1])
    const distance = getNumberArray(input.split("\n")[1].split(":")[1])
    return {
        time,
        distance
    }
}

function calculateResult(timeLimit: number, recordDistance: number, buttonTime: number) {
    const remainingTime = timeLimit - buttonTime
    const distance = buttonTime * remainingTime
    if (distance > recordDistance) {
        return 1
    }
    return 0
}

function calculateWinQuantities(data: Data): WinQuantities {
    const winQuantities: WinQuantities = []
    for (let i = 0; i < data.time.length; i++) {
        const timeLimit = data.time[i]
        const recordDistance = data.distance[i]
        let winQuantity = 0
        for (let buttonTime = 1; buttonTime < timeLimit; buttonTime++) {
            winQuantity += calculateResult(timeLimit, recordDistance, buttonTime)
        }
        winQuantities.push(winQuantity)
    }
    return winQuantities
}

function determineWaysToWin(label: string, input: string) {
    const data = cleanInputData(input)
    const answer = calculateWinQuantities(data).reduce((acc, winQuantity) => acc * winQuantity, 1)
    console.log(`${label} answer: ${answer}`)
}

determineWaysToWin("Sample", sample)
determineWaysToWin("Input", input)
const fs = require("fs")

const sample = fs.readFileSync("sample.txt", "utf-8")
const input = fs.readFileSync("input.txt", "utf-8")

function getNumberArray(input: string): number[] {
    const numberArray: number[] = []
    for (const number of input.matchAll(/\d+/g)) {
        numberArray.push(parseInt(number[0]))
    }
    return numberArray
}

function checkCard(cardsString: string) {
    const cardData = cardsString.split(":")[1]
    const winningSet = getNumberArray(cardData.split("|")[0])
    const numberSet = getNumberArray(cardData.split("|")[1])
    let quantity = 0
    for (const number of numberSet) {
        if (winningSet.includes(number)) {
            if (quantity === 0) {
                quantity += 1
            } else {
                quantity *= 2
            }
        }
    }
    return quantity
}

function checkCards(label: string, input: string) {
    const cards = input.split("\n")
    let total = 0
    for (const card of cards) {
        total += checkCard(card)
    }
    console.log(`${label}: ${total}`)
}

checkCards("sample", sample)
checkCards("input", input)
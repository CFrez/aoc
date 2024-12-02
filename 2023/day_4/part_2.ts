const fs = require("fs")

const sample = fs.readFileSync("sample.txt", "utf-8")
const input = fs.readFileSync("input.txt", "utf-8")

type Card = {
    cardNumber: number,
    winningSet: number[],
    numberSet: number[]
}


type Cards = Card[]

type CardCounts = {
    [key: number]: number
}

function getNumberArray(input: string): number[] {
    const numberArray: number[] = []
    for (const number of input.matchAll(/\d+/g)) {
        numberArray.push(parseInt(number[0]))
    }
    return numberArray
}

function processCards(input: string){
    const cards = input.split("\n")
    const cardsArray: Cards = []

    for (const card of cards) {
        const cardNumber = parseInt(card.split(":")[0].replace(/\D/g,''))
        const cardData = card.split(":")[1]
        const winningSet = getNumberArray(cardData.split("|")[0])
        const numberSet = getNumberArray(cardData.split("|")[1])
        cardsArray.push({ cardNumber, winningSet, numberSet })
    }

    return cardsArray
}


function countWinners(card: Card) {
    let quantity = 0
    for (const number of card.numberSet) {
        if (card.winningSet.includes(number)) {
            quantity += 1
        }
    }
    return quantity
}

function checkCards(label: string, input: string) {
    const cards = processCards(input)
    const cardCounts: CardCounts = {}
    for (const card of cards) {
        cardCounts[card.cardNumber] = 1
    }

    for (const card of cards) {
        const cardCount = cardCounts[card.cardNumber]
        const quantity = countWinners(card)
        for (let i = 1; i <= quantity; i++) {
            cardCounts[card.cardNumber + i] += 1 * cardCount
        }
    }
    console.log(`${label}: ${Object.values(cardCounts).reduce((a, b) => a + b, 0)}`)
}

checkCards("sample", sample)
checkCards("input", input)
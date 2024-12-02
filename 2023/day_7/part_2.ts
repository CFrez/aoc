const fs = require("fs")

const sample = fs.readFileSync("sample.txt", "utf-8")
const input = fs.readFileSync("input.txt", "utf-8")

// There is a version of poker that is played while riding Camels called Camel Cards
// There are five cards to each hand each which can consist of combinations of
// A, K, Q, T, 9, 8, 7, 6, 5, 4, 3, 2, 1 and they are ranked from highest to lowest
// in that order. The hand rankings from highest to lowest are five of a kind,
// four of a kind, full house, three of a kind, two pair, one pair, high card.
// If any two match then it goes to a battle of the highest card starting with the
// first and moving right until one is higher than the other. Each hand also has a bid
// that is multiplied by the final ranking to get total winnings.

enum Card {
    Ace = 'A',
    King = 'K',
    Queen = 'Q',
    Jack = 'J',
    Ten = 'T',
    Nine = '9',
    Eight = '8',
    Seven = '7',
    Six = '6',
    Five = '5',
    Four = '4',
    Three = '3',
    Two = '2',
    One = '1'
}

/** Jack is now lowest value as it becomes a Joker */
const cardValue: Record<Card, number> =
    {
        [Card.Ace]: 14,
        [Card.King]: 13,
        [Card.Queen]: 12,
        [Card.Jack]: 0,
        [Card.Ten]: 10,
        [Card.Nine]: 9,
        [Card.Eight]: 8,
        [Card.Seven]: 7,
        [Card.Six]: 6,
        [Card.Five]: 5,
        [Card.Four]: 4,
        [Card.Three]: 3,
        [Card.Two]: 2,
        [Card.One]: 1
    }

/**
 * There will be a function to test if a set of cards is each type of hand.
 */
enum Hand {
    FiveOfAKind = "Five of a kind",
    FourOfAKind = "Four of a kind",
    FullHouse = "Full house",
    ThreeOfAKind = "Three of a kind",
    TwoPair = "Two pair",
    OnePair = "One pair",
    HighCard = "High card"
}


/**
 * The Input consists of each player separated by a new line.
 * Each line consists of five cards and a bid separated by a space.
 */
type Input = string


/**
 * The Input will be modified into an array of objects, one for each player.
 */
type Data = {
    hand: Card[]
    bid: number
    type: Hand
    rank?: number
    winning?: number
}

type HandData = {
    [key: string]: Data[]
}

function determineHandType(hand: Data['hand']) {
    const cards: Record<Card, number> = {
        [Card.Ace]: 0,
        [Card.King]: 0,
        [Card.Queen]: 0,
        [Card.Jack]: 0,
        [Card.Ten]: 0,
        [Card.Nine]: 0,
        [Card.Eight]: 0,
        [Card.Seven]: 0,
        [Card.Six]: 0,
        [Card.Five]: 0,
        [Card.Four]: 0,
        [Card.Three]: 0,
        [Card.Two]: 0,
        [Card.One]: 0
    }

    hand.forEach(card => {
        cards[card]++
    })


    if (cards[Card.Jack] > 0) {
        const highestCard = Object.keys(cards).reduce((a, b) => cards[a] > cards[b] ? a : b)
        cards[highestCard] += cards[Card.Jack]
        cards[Card.Jack] = 0
    }


    if (Object.values(cards).includes(5)) {
        return Hand.FiveOfAKind
    }

    if (Object.values(cards).includes(4)) {
        return Hand.FourOfAKind
    }

    if (Object.values(cards).includes(3) && Object.values(cards).includes(2)) {
        return Hand.FullHouse
    }

    if (Object.values(cards).includes(3)) {
        return Hand.ThreeOfAKind
    }

    if (Object.values(cards).filter(value => value === 2).length === 2) {
        return Hand.TwoPair
    }

    if (Object.values(cards).includes(2)) {
        return Hand.OnePair
    }

    return Hand.HighCard
}

function cleanInputData(input: Input) {
    const players = input.split("\n")
    const data = players.map(player => {
        const hand = player.split(" ")[0].split("") as Card[]
        const bid = parseInt(player.split(" ")[1])
        return {
            hand,
            bid,
            type: determineHandType(hand)
        }
    })
    return data
}

function printHandData(data: HandData) {
    Object.keys(data).forEach(type => {
        console.log(`${type}: ${data[type].length}`)
        data[type].forEach(hand => {
            console.log(`\t${hand.rank} ${hand.hand.join("")} ${hand.bid} ${hand.winning}`)
        })
    })
}

/**
 * For all hands of the same type, sort by the highest card starting with index 0.
 */
function sortHands(data: Data[]) {
    const totalCount = data.length
    // Prepare the data structure to ensure correct order of hands
    const handData: HandData = {
        [Hand.FiveOfAKind]: [],
        [Hand.FourOfAKind]: [],
        [Hand.FullHouse]: [],
        [Hand.ThreeOfAKind]: [],
        [Hand.TwoPair]: [],
        [Hand.OnePair]: [],
        [Hand.HighCard]: []
    }

    data.forEach(hand => {
        handData[hand.type].push(hand)
    })

    // sort each type of hand
    Object.keys(handData).forEach(type => {
        handData[type].sort((a, b) => {
            for (let i = 0; i < a.hand.length; i++) {
                if (cardValue[a.hand[i]] > cardValue[b.hand[i]]) {
                    return -1
                }
                if (cardValue[a.hand[i]] < cardValue[b.hand[i]]) {
                    return 1
                }
            }
            return 0
        })
    })

    // assign rank and winnings
    let previousCount = totalCount
    Object.keys(handData).forEach(type => {
        handData[type].forEach((hand) => {
            hand.rank = previousCount
            hand.winning = previousCount * hand.bid
            previousCount -= 1
        })
    })

    printHandData(handData)

    return handData
}

function countWinnings(label: string, input: Input) {
    const handData = sortHands(cleanInputData(input))
    let total = 0
    Object.keys(handData).forEach(type => {
        handData[type].forEach(hand => {
            total += hand.winning!
        })
    })
    console.log(`${label}: ${total}`)
}

// countWinnings("Sample", sample) // sol: 5905
countWinnings("Input", input) // sol: 
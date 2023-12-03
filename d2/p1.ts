const fs = require("fs")

const sample = fs.readFileSync("sample.txt", "utf-8")
const input = fs.readFileSync("input.txt", "utf-8")

type Bag = {
    blue: number,
    red: number,
    green: number

}

const bag: Bag = { blue: 14, red: 12, green: 13 };

function countColors(dice: RegExpMatchArray[]) {
    let colors: Bag = { blue: 0, red: 0, green: 0 };
    dice.forEach((hand) => {
        const [count, color] = hand[0].split(' ');
        const number = parseInt(count);
        if (number > colors[color]) {
            colors[color] = number
        }
    });
    return colors;
}

function testCount(bag: Bag, dice: RegExpMatchArray[]){
    const colors = countColors(dice);
    if (colors.blue > bag.blue || colors.red > bag.red || colors.green > bag.green) {
        return false;
    }
    return true;
}

function processGame(game: string){
    const gameNumber = game.split(':')[0].replace(/\D/g,'');
    const dice = game.split(':')[1];

    const diceArray = [...dice.matchAll(/\d+ \w+/g)]

    const test = testCount(bag, diceArray);
    if (test) {
        return parseInt(gameNumber)
    } else {
        return 0
    }
}

function processGames(label: string, games: string){
    let total = 0;
    games.split('\n').forEach((game) => {
        total += processGame(game);
    });
    console.log(`${label}: ${total}`)
}

processGames('sample', sample)
processGames('input', input)

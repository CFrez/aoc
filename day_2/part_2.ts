const fs = require("fs")

const sample = fs.readFileSync("sample.txt", "utf-8")
const input = fs.readFileSync("input.txt", "utf-8")

type Bag = {
    blue: number,
    red: number,
    green: number

}

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

function processGame(game: string){
    const dice = game.split(':')[1];
    const { blue, red, green } = countColors([...dice.matchAll(/\d+ \w+/g)]);
    return blue * red * green
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

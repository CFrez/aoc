const fs = require("fs")

const sample = fs.readFileSync("sample.txt", "utf-8")
const input = fs.readFileSync("input.txt", "utf-8")

function getNumber(string: string){
    const digits = string.replace(/\D/g,'')
    return Number(digits[0]+digits.slice(-1))
}


function sumNumbers(label: string, numbers: string) {
    let sum = 0
    numbers.split('\n').forEach((element) => {
        sum += getNumber(element)
    })
    console.log(`${label}: ${sum}`)
}

sumNumbers('sample', sample)
sumNumbers('input', input)
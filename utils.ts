export function getNumberArray(input: string): number[] {
    const numberArray: number[] = []
    for (const number of input.matchAll(/\d+/g)) {
        numberArray.push(parseInt(number[0]))
    }
    return numberArray
}

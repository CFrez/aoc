const fs = require("fs")

const sample = fs.readFileSync("sample.txt", "utf-8")
const input = fs.readFileSync("input.txt", "utf-8")

// This makes the assumption that the input data is always in order for steps of mapping

type Mapping = {
    label: string
    maps: {
        fromStart?: number
        fromEnd?: number
        to?: number
        range?: number
    }[]
}

type Maps = Mapping[]
// used array to maintain order

type Seed = {
    seed: number
    [key: string]: number
}

type Almanac = Seed[]


function cleanInputData(data: string): [string, string[]] {
    const label = data.split(":")[0].replace('map', '').trim().split("-").pop() || ''
    const maps = data.split(":")[1].split("\n").map(map => map.trim()).filter(map => map)
    return [label, maps]
}

function generateMapping(label: string, maps: string[]): Mapping {
    const mapping: Mapping = {
        label,
        maps: []
    }

    maps.forEach(map => {
        const [to, fromStart, range] = map.split(" ").map(Number)
        mapping.maps.push({
            fromStart,
            fromEnd: fromStart + range - 1,
            to,
            range
        })
    })

    mapping.maps.sort((a, b) => {
        return a.fromStart! - b.fromStart!
    })

    return mapping
}

function mapSeed(seedNumber: number, maps: Maps) {
    const seed: Seed = {
        seed: seedNumber
    }

    let newNumber = seedNumber
    let fromNumber = seedNumber

    for (const map of maps) {
        for (const mapping of map.maps) {
            // Assuming that data always has the numbers
            if (fromNumber >= mapping.fromStart! && fromNumber <= mapping.fromEnd!) {
                const difference = fromNumber - mapping.fromStart!
                newNumber = mapping.to! + difference
            }
        }
        seed[map.label] = newNumber
        fromNumber = newNumber
    }
    return seed
}

function sortSeeds(label: string, input: string) {
    const allMaps = input.split("\n\n").map(cleanInputData)
    const almanac: Almanac = []
    const maps: Maps = []
    const seeds: number[] = []

    allMaps.map(([label, map]) => {
        if (label === 'seeds') {
            for (const seed of map[0].split(" ")){
                seeds.push(Number(seed))
            }
        } else {
            maps.push(generateMapping(label, map))
        }
    })

    seeds.map(seed => {
        almanac.push(mapSeed(seed, maps))
    })

    const lowest = almanac.reduce((acc, seed) => {
        return seed.location < acc.location ? seed : acc
    })

    console.log(almanac)

    console.log(`${label}: ${lowest.location}`)
}

sortSeeds('sample', sample)
// sortSeeds('input', input)

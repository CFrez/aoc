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

type SeedSet = number[]

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

function mapSeedSet(seedSet: SeedSet, maps: Maps): [number, number | undefined] {
    const [seedNumber, seedRange] = seedSet

    let lowestSeedNumber: number = 0
    let lowestLocation: number | undefined = undefined

    for (let i = 0; i < seedRange; i++) {
        const seed = mapSeed(seedNumber + i, maps)
        if (!lowestLocation){
            lowestSeedNumber = seed['seed']
            lowestLocation = seed['location']

        }
        if (seed['location'] < lowestLocation) {
            lowestSeedNumber = seed['seed']
            lowestLocation = seed['location']
        }
    }

    return [lowestSeedNumber, lowestLocation]
}

function sortSeeds(label: string, input: string) {
    const allMaps = input.split("\n\n").map(cleanInputData)
    const maps: Maps = []
    const seeds: SeedSet[] = []

    allMaps.map(([label, map]) => {
        if (label === 'seeds') {
            for (const seed of map[0].matchAll(/(\d+) (\d+)/g)){
                seeds.push(seed[0].split(" ").map(Number))
            }
        } else {
            maps.push(generateMapping(label, map))
        }
    })

    const lowestLocations = {}

    seeds.map(seed => {
        const [lowestSeedNumber, lowestLocation] = mapSeedSet(seed, maps)
        lowestLocations[lowestSeedNumber] = lowestLocation
    })

    const lowest = Object.values(lowestLocations).reduce((acc, loc) => {
        return loc! < acc! ? loc : acc
    })

    console.log(`${label}: ${lowest}`)

}

sortSeeds('sample', sample)
sortSeeds('input', input)
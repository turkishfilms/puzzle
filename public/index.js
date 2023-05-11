/**
 * big problem.
 * solution can be an array of arrays, each with numbers. no numbers may repeat between buckets. 
 * the numbers must "cover" or be at most one binary bit flip from every possible number up to 2**n for n cells
 * 
 * patterns:
 * the sum of all the numbers in a bucket, is the same sum across all buckets. 0,1,2,3,4 
 * my flip and constant jump algorithm works for 0,1,2,4 
 * 0,1,2,4 all have a number of leftover positions after all buckets are minimally filled of 1 or 0
 * flip and constant jump doesn't work for any n other than 0,1,2,4 below 66
 * 
 * number of buckets is equal to n
 * number of positions covered by a position is equal to n + 1
 * minimum number of positions needed to cover is equal to ceiling(2**n /(n+1))
 * 
 * amount of overlaps come in pairs for small "chains"
 * 
 * TODO: Create a fx which generates the new position after doing the mixing without mixing. its too hard with 2**64
 */


let n = 5
let w, h
let cols = []

function setup() {
    w = windowWidth
    h = windowHeight
    createCanvas(w, h)
    background(0)
    for (let i = 0; i < n; i++) cols.push([random(255), random(255), random(255)])
    drawOrderedAndUnorderedCircles(n)
}

const drawCircleWithDots = (n, mixed) => {
    stroke(255)
    if (n <= 0) return "bruh"
    const points = []
    const angle = TWO_PI / n
    const radius = 120
    const offset = 10
    const inds = mixed ? binaryMixer(makeSequentialArr(n)) : makeSequentialArr(n)

    for (let i = 0; i < n; i++) {
        const x = cos(i * angle) * radius + (mixed ? +radius + offset : w - radius - offset)
        const y = sin(i * angle) * radius + h / 2
        points.push({ index: inds[i], x: x, y: y })
        ellipse(x, y, 5)
        text(inds[i], x, y - 10)
    }
    return points
}

const drawUn_OrderedAndCircles = (n) => {
    connectDots(drawCircleWithDots(2 ** n, false), originalSolution(n))
    connectDots(drawCircleWithDots(2 ** n, true), originalSolution(n))
}

const originalSolution = (n) => consantLeapBucket(binaryMixer(makeSequentialArr(2 ** n)))

const connectDots = (points, sol) => {

    for (let i = 0; i < sol.length; i++) {
        const bucket = sol[i];
        noFill()
        stroke(cols[i][0], cols[i][1], cols[i][2])
        beginShape()
        for (let j = 0; j < bucket.length; j++) {
            const num = bucket[j];
            const { x, y } = points.find((n) => n.index == num)
            vertex(x, y)
            // text(points[i].index,x,y-10)
        }
        endShape()
    }
}

const sumUpBuckets = (sol) => {
    sol.forEach(bucket => {
        let tot = 0
        bucket.forEach(pos => tot += pos)
        return tot
    })
}

function keyPressed() {
    background(0)
    if (key == "w") drawUn_OrderedAndCircles(n += 1)
    if (key == "s") drawUn_OrderedAndCircles(n += -1)
}

const numUnusedPositions = (n) => {
    return (2 ** n) - ((ceil((2 ** n) / (n + 1))) * n)
}

function draw() {

}

const binaryMixer = (arr) => {
    let sectionLen = arr.length / 2
    let curArr = arr.slice()
    while (sectionLen >= 1) {
        for (let i = 0; i < (arr.length / sectionLen); i += 2) {
            curArr.splice((i + 1) * sectionLen, sectionLen,
                ...curArr.slice(
                    (i + 1) * sectionLen, (i + 1) *
                    sectionLen + sectionLen).reverse())
        }
        sectionLen /= 2
    }
    return curArr
}

const makeSequentialArr = (n) => {
    const arr = []
    for (let i = 0; i < n; i++) arr.push(i)
    return arr
}

const consantLeapBucket = (arr) => {
    const buckets = []
    const n = Math.log2(arr.length)
    for (let i = 0; i < n; i++) {
        let bucket = []
        for (let j = i; j < arr.length; j += n) bucket.push(arr[j])
        buckets.push(bucket)
    }
    return buckets
}

const bAD = (arr, val) => {
    const ind = arr.findIndex(n => n == val)
    if (ind >= 0) arr.splice(ind, 1)
}

const ct = (n, bucket) => {
    //add break statement for if there are too many overlaps
    //add break if there are too many targets left over by certain pos
    const targets = makeSequentialArr(2 ** n)
    for (let i = 0; i < bucket.length; i++) {
        const pos = bucket[i]
        const bPos = toFixedLengthBinary(pos, n)
        bAD(targets, parseInt(bPos, 2))
        for (let j = 0; j < n; j++) {
            const bpost = bPos.slice()
            const vv = bpost.substring(0, j) + (bpost[j] == '1' ? '0' : '1') + bpost.substring(j + 1);
            bAD(targets, parseInt(vv, 2))
        }
    }
    return targets.length == 0 ? 1 : targets
}

const solt = (n) => {
    const sol = originalSolution(n)
    const counters = []
    for (let i = 0; i < sol.length; i++) {
        const b = sol[i]
        let a = ct(sol.length, b)
        if (a == true) continue
        else counters.push(a)
    }
    return counters

}

const toFixedLengthBinary = (number, length) => {
    // const binaryString = ; // Convert the number to a binary string
    return number.toString(2).padStart(length, '0'); // Pad the binary string with zeros to achieve the fixed length
}
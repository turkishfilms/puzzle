let n = 5
let w, h
let cols = []

function setup() {
    w = windowWidth
    h = windowHeight
    createCanvas(w, h)
    background(0)
    let sol = [0, 0, 0, 0, 0, 0, 0, 0]
    sol.forEach((sol) => cols.push([random(255), random(255), random(255)]))
    cc(n)
}

const dotsCircle = (n, mixed) => {
    stroke(255)
    if (n <= 0) return "bruh"
    const points = []
    const angle = TWO_PI / n
    const radius = 120
    const offset = 10
    const inds = mixed ? mixArr(makeArr(n)) : makeArr(n)

    for (let i = 0; i < n; i++) {
        const x = cos(i * angle) * radius + (mixed ? +radius + offset : w - radius - offset)
        const y = sin(i * angle) * radius + h / 2
        points.push({ index: inds[i], x: x, y: y })
        ellipse(x, y, 5)
        text(inds[i], x, y - 10)
    }
    return points
}

const cc = (m) => {
    cdw(n);
    cdwM(n)
}

const cdw = (n) => connectDots(dotsCircle(2 ** n, false), dude(n))

const cdwM = (n) => connectDots(dotsCircle(2 ** n, true), dude(n))

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



function keyPressed() {
    background(0)
    if (key == "w") cc(n += 1)
    if (key == "s") cc(n += -1)
}

function draw() {

}



const mixArr = (arr) => {
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

const makeArr = (n) => {
    const arr = []
    for (let i = 0; i < n; i++) arr.push(i)
    return arr
}

const bucketify = (arr) => {
    const buckets = []
    const n = Math.log2(arr.length)
    for (let i = 0; i < n; i++) {
        let bucket = []
        for (let j = i; j < arr.length; j += ny) bucket.push(arr[j])
        buckets.push(bucket)
    }
    return buckets
}

const dude = (n) => bucketify(mixArr(makeArr(2 ** n)))

let bAD = (arr, val) => {
    const ind = arr.findIndex(n => n == val)
    if (ind >= 0) arr.splice(ind, 1)
}

const ct = (n, bucket) => {
    //add break statement for if there are too many overlaps
    //add break if there are too many targets left over by certain pos
    const targets = makeArr(2 ** n)
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


let solt = (n) => {
    const sol = dude(n)
    const counters = []
    for (let i = 0; i < sol.length; i++) {
        const b = sol[i]
        let a = ct(sol.length, b)
        if (a == true) continue
        else counters.push(a)
    }
    return counters

}

function toFixedLengthBinary(number, length) {
    // const binaryString = ; // Convert the number to a binary string
    return number.toString(2).padStart(length, '0'); // Pad the binary string with zeros to achieve the fixed length
}
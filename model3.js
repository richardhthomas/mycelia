

// screen array contains the state of mycelia (0 or 1) at each x,y position.
function createScreen() {
    const result = [];
    for (let i = 0; i < 2000; i++) {
        result[i] = [];
    };
    return result;
}

function setupScreen(screen) {
    screen[1000][1000] = {mycelium: "primary"};
    const openEnds = createOpenEnds();
    openEnds.forEach(openEnd => {
        screen[openEnd[0]][openEnd[1]] = {mycelium: "primary"};
    });
}

function createOpenEnds() {
    return [[1000, 998, 0],
        [1002, 998, 2],
        [1002, 1000, 4],
        [1002, 1002, 6],
        [1000, 1002, 8],
        [998, 1002, 10],
        [998, 1000, 12],
        [998, 998, 14]];
}

function createAllGrowthDirections() {
    return [[0,-2],
    [1,-2],
    [2,-2],
    [2,-1],
    [2,0],
    [2,1],
    [2,2],
    [1,2],
    [0,2],
    [-1,2],
    [-2,2],
    [-2,1],
    [-2,0],
    [-2,-1],
    [-2,-2],
    [-1,-2]];
}

function createAllDirections() {
    return [[0,-1],
        [0,-2],
        [1,-2],
        [1,-1],
        [2,-2],
        [2,-1],
        [1,0],
        [2,0],
        [2,1],
        [1,1],
        [2,2],
        [1,2],
        [0,1],
        [0,2],
        [-1,2],
        [-1,1],
        [-2,2],
        [-2,1],
        [-1,0],
        [-2,0],
        [-2,-1],
        [-1,-1],
        [-2,-2],
        [-1,-2]];
}

// defines probabilities of growing bigger or splitting (vs doing nothing)
function createGrowthTypeProbability() {
    return {bigger: 40, split: 20, nothing: 50};
}

// defines probabilities of growing 2 deviations or 1 deviation from straight ahead
function createGrowthDirectionProbability() {
    return {"0": 5, "1": 12, "2": 120, "3": 12, "4": 5};
}

function runMyc() {
	const screen = createScreen(); 
    setupScreen(screen);
    let openEnds = createOpenEnds();
    const delay = 100;
    const canvas = document.getElementById("mainCanvas");
    const ctx = canvas.getContext("2d");


    // Create gradient
    ctx.globalCompositeOperation = "multiply";
    const grad=ctx.createRadialGradient(500,500,40,500,500,3500);
    grad.addColorStop(0,"red");
    grad.addColorStop(0.03,"#ff9999");
    grad.addColorStop(1,"white");
    ctx.fillStyle = grad;
    ctx.fillRect(10,10,4980,4980);
    
    const grad2=ctx.createRadialGradient(2000,1000,40,2000,1000,3500);
    grad2.addColorStop(0,"#0000ff");
    grad2.addColorStop(0.03,"#9999ff");
    grad2.addColorStop(1,"white");
    ctx.fillStyle = grad2;
    ctx.fillRect(10,10,4980,4980);

    // draw starting mycelia
    ctx.globalCompositeOperation = "source-over";
    drawMyc(1000, 1000, ctx);
    openEnds.forEach(openEnd => {
        drawMyc(openEnd[0], openEnd[1], ctx);
    });

    growAll(openEnds, screen, ctx, delay);
}

function growAll(openEnds, screen, ctx, delay) {
    let newOpenEnds = [];
    const growthTypeProbability = createGrowthTypeProbability();
    const growthDirectionProbability = createGrowthDirectionProbability();
    openEnds.forEach(openEnd => {
        if (isOpenEnd(screen, openEnd)) {
            let action = probResult(growthTypeProbability);
            if (action == "nothing") {
                newOpenEnds.push(openEnd);
            } else {
                let directions = growthDirections(openEnd, growthDirectionProbability);
                if (action == "bigger") {directions.pop();}
                growMyc(screen, openEnd, newOpenEnds, directions, ctx);
            }
        }
    });
    openEnds = newOpenEnds;
    if (!bigEnough(openEnds)) {
        setTimeout(() => {growAll(openEnds, screen, ctx, delay);}, delay);
    }
}

function drawMyc(x, y, ctx) {
    ctx.fillStyle = "red";
    ctx.fillRect(x*2,y*2,4,4);
}

function bigEnough(openEnds) {
    let result = false;
    openEnds.forEach(openEnd => {
        if (openEnd[0] <= 2 ||
            openEnd[0] >= 1998 ||
            openEnd[1] <= 2 ||
            openEnd[1] >= 1998) {
            result = true;
        }
    });
    return result;
}

function possibleGrowthDirections(openEnd) {
    const v = openEnd[2]; 
    const w = [v+14, v+15, v+16, v+17, v+18];
    return w.map(val => {return val % 16});
}

function overlapDirections(openEnd) {
    const v = openEnd[2]; //centre of spread with 16 directions
    const c = v + Math.floor((v+2)/2); //convert to 24 instead of 16 directions
    const spread24 = [c+21, c+22, c+23, c+24, c+25, c+26, c+27];
    if (v % 2 === 0) {spread24.unshift(c+20)};
    return spread24.map(val => {return val % 24});
}

function isOpenEnd(screen, openEnd) {
    const allDirections = createAllDirections();
    const directionsToCheck = overlapDirections(openEnd);
    for (let dir of directionsToCheck) {
        let xToCheck = openEnd[0] + allDirections[dir][0];
        let yToCheck = openEnd[1] + allDirections[dir][1];
        if (screen[xToCheck][yToCheck] !== undefined) {return false};
    }
    return true;
}

function probResult(probability) {
    let total = 0;
    for (let p in probability) {
        total += probability[p];
    }
    let x = Math.floor((Math.random() * total) + 1);
    for (let [result, prob] of Object.entries(probability)) {
        if (x <= prob) {
            return result;
        } else {
            x -= prob;
        }
    }
}

function growthDirections(openEnd, growthDirectionProbability) {
    const copygdp = {...growthDirectionProbability};
    const result = [];
    let p = probResult(copygdp);
    result.push(possibleGrowthDirections(openEnd)[Number.parseInt(p)]);
    copygdp[p] = 0;
    let q = probResult(copygdp);
    result.push(possibleGrowthDirections(openEnd)[Number.parseInt(q)]);
    return result;
}

function growMyc(screen, openEnd, newOpenEnds, growthDirections, ctx) {
    const allGrowthDirections = createAllGrowthDirections();
    growthDirections.forEach(direction => {
        // calc position of new growth
        let newX = openEnd[0] + allGrowthDirections[direction][0];
        let newY = openEnd[1] + allGrowthDirections[direction][1];
        // update Screen 
        screen[newX][newY] = {mycelium: "primary"};
        // add new openEnd
        newOpenEnds.push([newX, newY, direction]);
        // draw
        drawMyc(newX, newY, ctx);
    });
}

module.exports.createAllGrowthDirections = createAllGrowthDirections;
module.exports.createScreen = createScreen;
module.exports.createOpenEnds = createOpenEnds;
module.exports.setupScreen = setupScreen;
module.exports.bigEnough = bigEnough;
module.exports.possibleGrowthDirections = possibleGrowthDirections;
module.exports.overlapDirections = overlapDirections;
module.exports.isOpenEnd = isOpenEnd;
module.exports.growMyc = growMyc;
module.exports.createGrowthTypeProbability = createGrowthTypeProbability;
module.exports.createGrowthDirectionProbability = createGrowthDirectionProbability;
module.exports.probResult = probResult;
module.exports.growthDirections = growthDirections;

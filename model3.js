

// mycMap array contains the state of mycelia (0 or 1) at each x,y position.
function createMycMap() {
    const result = [];
    for (let i = 0; i < 5000; i++) {
        result[i] = [];
    };
    return result;
}

function setupMycMap(mycMap) {
    mycMap[2500][2500] = {mycelium: "primary"};
    const openEnds = createOpenEnds();
    openEnds.forEach(openEnd => {
        mycMap[openEnd[0]][openEnd[1]] = {mycelium: "primary"};
    });
}

function createOpenEnds() {
    return [[2500, 2498, 0],
        [2502, 2498, 2],
        [2502, 2500, 4],
        [2502, 2502, 6],
        [2500, 2502, 8],
        [2498, 2502, 10],
        [2498, 2500, 12],
        [2498, 2498, 14]];
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
	const mycMap = createMycMap(); 
    setupMycMap(mycMap);
    let openEnds = createOpenEnds();
    const delay = 100;
    const canvas = document.getElementById("mainCanvas");
    const ctx = canvas.getContext("2d");


    // Create gradient
    ctx.globalCompositeOperation = "multiply";
    const grad=ctx.createRadialGradient(1000,1000,100,1000,1000,5000);
    grad.addColorStop(0,"red");
    grad.addColorStop(0.03,"#ff9999");
    grad.addColorStop(1,"white");
    ctx.fillStyle = grad;
    ctx.fillRect(10,10,9980,9980);
    
    const grad2=ctx.createRadialGradient(6000,1000,100,6000,1000,5000);
    grad2.addColorStop(0,"#0000ff");
    grad2.addColorStop(0.03,"#9999ff");
    grad2.addColorStop(1,"white");
    ctx.fillStyle = grad2;
    ctx.fillRect(10,10,9980,9980);

    // draw starting mycelia
    drawMyc(2500, 2500, ctx);
    openEnds.forEach(openEnd => {
        drawMyc(openEnd[0], openEnd[1], ctx);
    });

    //growAll(openEnds, mycMap, ctx, delay);
}

function growAll(openEnds, mycMap, ctx, delay) {
    let newOpenEnds = [];
    const growthTypeProbability = createGrowthTypeProbability();
    const growthDirectionProbability = createGrowthDirectionProbability();
    openEnds.forEach(openEnd => {
        if (isOpenEnd(mycMap, openEnd)) {
            let action = probResult(growthTypeProbability);
            if (action == "nothing") {
                newOpenEnds.push(openEnd);
            } else {
                let directions = growthDirections(openEnd, growthDirectionProbability);
                if (action == "bigger") {directions.pop();}
                growMyc(mycMap, openEnd, newOpenEnds, directions, ctx);
            }
        }
    });
    openEnds = newOpenEnds;
    if (!bigEnough(openEnds)) {
        setTimeout(() => {growAll(openEnds, mycMap, ctx, delay);}, delay);
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
            openEnd[0] >= 4998 ||
            openEnd[1] <= 2 ||
            openEnd[1] >= 4998) {
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

function isOpenEnd(mycMap, openEnd) {
    const allDirections = createAllDirections();
    const directionsToCheck = overlapDirections(openEnd);
    for (let dir of directionsToCheck) {
        let xToCheck = openEnd[0] + allDirections[dir][0];
        let yToCheck = openEnd[1] + allDirections[dir][1];
        if (mycMap[xToCheck][yToCheck] !== undefined) {return false};
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

function growMyc(mycMap, openEnd, newOpenEnds, growthDirections, ctx) {
    const allGrowthDirections = createAllGrowthDirections();
    growthDirections.forEach(direction => {
        // calc position of new growth
        let newX = openEnd[0] + allGrowthDirections[direction][0];
        let newY = openEnd[1] + allGrowthDirections[direction][1];
        // update MycMap 
        mycMap[newX][newY] = {mycelium: "primary"};
        // add new openEnd
        newOpenEnds.push([newX, newY, direction]);
        // draw
        drawMyc(newX, newY, ctx);
    });
}

module.exports.createAllGrowthDirections = createAllGrowthDirections;
module.exports.createMycMap = createMycMap;
module.exports.createOpenEnds = createOpenEnds;
module.exports.setupMycMap = setupMycMap;
module.exports.bigEnough = bigEnough;
module.exports.possibleGrowthDirections = possibleGrowthDirections;
module.exports.overlapDirections = overlapDirections;
module.exports.isOpenEnd = isOpenEnd;
module.exports.growMyc = growMyc;
module.exports.createGrowthTypeProbability = createGrowthTypeProbability;
module.exports.createGrowthDirectionProbability = createGrowthDirectionProbability;
module.exports.probResult = probResult;
module.exports.growthDirections = growthDirections;

// mycMap array contains the state of mycelia (0 or 1) at each x,y position.
function createMycMap() {
    const result = [];
    for (let i = 0; i < 500; i++) {
        result[i] = [];
        for (let j = 0; j < 300; j++) {
            result[i][j] = 0;
        };
    };
    return result;
}

function setupMycMap(mycMap) {
    mycMap[250][150] = 1;
    const openEnds = createOpenEnds();
    openEnds.forEach(openEnd => {
        mycMap[openEnd[0]][openEnd[1]] = 1
    });
    return mycMap;
}

function createOpenEnds() {
    return [[250, 148, 0],
        [252, 148, 2],
        [252, 150, 4],
        [252, 152, 6],
        [250, 152, 8],
        [248, 152, 10],
        [248, 150, 12],
        [248, 148, 14]];
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
    return {bigger: 40, split: 10};
}

// defines probabilities of growing 2 deviations or 1 deviation from straight ahead
function createGrowthDirectionProbability() {
    return {"0": 5, "1": 12, "2": 66, "3": 12, "4": 5};
}

function runMyc() {
	const mycMap = createMycMap(); 

	// mycSearch has the same format as mycMap but the binary represents whether travel has occured in the specified direction.
//	const mycSearch = [[],[]];

    const mycMapValues = createMycMapValues();
    const growthTypeProbability = createGrowthTypeProbability();
    const growthDirectionProbability = createGrowthDirectionProbability();
    const canvas = document.getElementById("mainCanvas");
    const ctx = canvas.getContext("2d");

    //drawMyc(250, 150, ctx);
    ctx.fillStyle = "red";
    ctx.fillRect(500,300,4,4);
    mycMap[250,150] = 65535;
}

function drawMyc(x, y, ctx) {
    ctx.fillStyle = "red";
    ctx.fillRect(x*2,y*2,4,4);
}

function calcMycMap(myM, values, x, y) {
    let result = 0;
    values.forEach((coord, index) => {
        if (myM[x + coord[0]][y + coord[1]] != 0) {
            result += Math.pow(2, index);
        }
    });
    return result;
}

function bigEnough(openEnds) {
    let result = false;
    openEnds.forEach(openEnd => {
        if (openEnd[0] <= 2 ||
            openEnd[0] >= 498 ||
            openEnd[1] <= 2 ||
            openEnd[1] >= 298) {
            result = true;
        }
    });
    return result;
}

function growthDirections(openEnd) {
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
    const allGrowthDirections = createAllGrowthDirections();
    const allDirections = createAllDirections();

}

function probResult(probability) {
    let x = Math.floor((Math.random() * 100) + 1);
    for (let [result, prob] of Object.entries(probability)) {
        if (x <= prob) {
            return result;
        } else {
            x -= prob;
        }
    }
    return "nothing";
}

function growthDirection(openEnd, growthDirectionProbability) {
    let p = Number.parseInt(probResult(growthDirectionProbability));
    return growthDirections(openEnd)[p];
}

function growMyc(mycMap, openEnd, newOpenEnds, mycMapValues, growthType, growthDirection, ctx) {
    if (growthType == 'bigger') {
        // calc position of new growth
        let newX = openEnd[0] + mycMapValues[growthDirection][0];
        let newY = openEnd[1] + mycMapValues[growthDirection][1];
        // update MycMap with new value for new growth
        let newMycMapVal = calcMycMap(mycMap, mycMapValues, newX, newY);
        mycMap[newX][newY] = newMycMapVal;
        // update MycMap for location of old open end
        let updatedMycMapVal = calcMycMap(mycMap, mycMapValues, openEnd[0], openEnd[1]);
        mycMap[openEnd[0]][openEnd[1]] = updatedMycMapVal;
        // add new openEnd if not joined to something else
        if (isOpenEnd(mycMap, newX, newY)) { newOpenEnds.push([newX, newY]); }
        // draw
        drawMyc(newX, newY, ctx);
    }

}

module.exports.createAllGrowthDirections = createAllGrowthDirections;
module.exports.createMycMap = createMycMap;
module.exports.createOpenEnds = createOpenEnds;
module.exports.setupMycMap = setupMycMap;
module.exports.calcMycMap = calcMycMap;
module.exports.bigEnough = bigEnough;
module.exports.growthDirections = growthDirections;
module.exports.overlapDirections = overlapDirections;
module.exports.isOpenEnd = isOpenEnd;
module.exports.growMyc = growMyc;
module.exports.createGrowthTypeProbability = createGrowthTypeProbability;
module.exports.createGrowthDirectionProbability = createGrowthDirectionProbability;
module.exports.probResult = probResult;
module.exports.growthDirection = growthDirection;

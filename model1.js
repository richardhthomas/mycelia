// mycMap array contains the state of mycelia at each x,y position.
// The state is given by an integer that represents a 16 bit binary
// The binary represents whether there is a connection in each of 16 directions,
//starting with 1 due North and proceeding clockwise
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

// map x and y offset coordinates to binary to be used in mycMap
// 2 raised to power of index gives binary code stored in mycMap 
function createMycMapValues() {
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

// or for 24 bit - [v+9, v+10, v+12, v+13, v+15]
function growthDirections(openEnd, mycMap) {
    const v = Math.log2(mycMap[openEnd[0]][openEnd[1]]);
    const w = [v+6, v+7, v+8, v+9, v+10];
    return w.map(remainder16);
}

function remainder16(val) {
    return val % 16;
}

function isOpenEnd(mycMap, x, y) {
    return Number.isInteger(Math.log2(mycMap[x][y]));
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

function growthDirection(openEnd, mycMap, growthDirectionProbability) {
    let p = Number.parseInt(probResult(growthDirectionProbability));
    return growthDirections(openEnd, mycMap)[p];
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

module.exports.createMycMapValues = createMycMapValues;
module.exports.createMycMap = createMycMap;
module.exports.calcMycMap = calcMycMap;
module.exports.bigEnough = bigEnough;
module.exports.growthDirections = growthDirections;
module.exports.isOpenEnd = isOpenEnd;
module.exports.growMyc = growMyc;
module.exports.createGrowthTypeProbability = createGrowthTypeProbability;
module.exports.createGrowthDirectionProbability = createGrowthDirectionProbability;
module.exports.probResult = probResult;
module.exports.growthDirection = growthDirection;

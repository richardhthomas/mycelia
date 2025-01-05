const Mycelium = require('./mycelium.js');
const OpenEnds = require('./openEnds.js');
const OpenEnd = require('./openEnd.js');

// screen array contains the state of mycelia (0 or 1) at each x,y position.
function createScreen() {
    const result = [];
    for (let i = 0; i < 2000; i++) {
        result[i] = [];
    };
    return result;
}

function setupScreen(screen, mycelia) {
    screen[1000][1000] = {mycelium: "primary"};
    //***line above needs to be generalised
    for (let [name, mycelium] of Object.entries(mycelia)) {
        mycelium.openEnds.forEach(openEnd => {
            screen[openEnd.xposn][openEnd.yposn] = {mycelium: name};
        });
    };
}

function createOpenEnds() {
    let data = [[1000, 998, 0],
        [1002, 998, 2],
        [1002, 1000, 4],
        [1002, 1002, 6],
        [1000, 1002, 8],
        [998, 1002, 10],
        [998, 1000, 12],
        [998, 998, 14]];
    let openEnds = new OpenEnds();
    data.forEach(openEnd => {
        openEnds.push(new OpenEnd(openEnd[0], openEnd[1], openEnd[2]));
    });
    return openEnds;
}


// defines probabilities of growing bigger or splitting (vs doing nothing)
function createGrowthTypeProb() {
    return {bigger: 40, split: 20, nothing: 50};
}

// defines probabilities of growing 2 deviations or 1 deviation from straight ahead
function createGrowthDirProb() {
    return {"0": 5, "1": 12, "2": 120, "3": 12, "4": 5};
}

function runMyc() {
    let mycelium = new Mycelium(
        createGrowthTypeProb(),
        createGrowthDirProb(),
        "red",
        createOpenEnds());
	let mycelia = { primary: mycelium };
    const screen = createScreen(); 
    setupScreen(screen, mycelium);
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
//    drawMyc(1000, 1000, ctx);
    ctx.fillStyle = "red";
    ctx.fillRect(2000, 2000, 4, 4);
    mycelium.openEnds.forEach(openEnd => {
        openEnd.drawMyc(ctx);
    });

    //*** line below needs generalising to multiple mycelia
    growAll(mycelium, screen, ctx, delay);
}

function growAll(mycelium, screen, ctx, delay) {
    let newOpenEnds = new OpenEnds();
    mycelium.openEnds.forEach(openEnd => {
        if (openEnd.isOpenEnd(screen)) {
            let action = probResult(mycelium.growthTypeProb);
            if (action == "nothing") {
                newOpenEnds.push(openEnd);
            } else {
                let directions = openEnd.growthDirections(mycelium.growthDirProb);
                if (action == "bigger") {directions.pop();}
                openEnd.grow(screen, newOpenEnds, directions, ctx);
            }
        }
    });
    mycelium.openEnds = newOpenEnds;
    if (!mycelium.bigEnough()) {
        setTimeout(() => {growAll(mycelium, screen, ctx, delay);}, delay);
    }
}

//function drawMyc(x, y, ctx) {
//    ctx.fillStyle = "red";
//    ctx.fillRect(x*2,y*2,4,4);
//}

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

module.exports.createScreen = createScreen;
module.exports.createOpenEnds = createOpenEnds;
module.exports.setupScreen = setupScreen;
module.exports.createGrowthTypeProb = createGrowthTypeProb;
module.exports.createGrowthDirProb = createGrowthDirProb;
module.exports.probResult = probResult;

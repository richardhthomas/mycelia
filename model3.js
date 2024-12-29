class Mycelium {
    #growthTypeProb;
    #growthDirProb;
    #colour;
    #openEnds;

    constructor(growthTypeProb, growthDirProb, colour, openEnds) {
        if (this.#growthTypeProbValidation(growthTypeProb)) {
            this.#growthTypeProb = growthTypeProb;
        }
        if (this.#growthDirProbValidation(growthDirProb)) {
            this.#growthDirProb = growthDirProb;
        }
        this.#colour = colour;
        if (this.#openEndsValidation(openEnds)) {
            this.#openEnds = new OpenEnds(...openEnds);
        }
    }

    get growthTypeProb() {
        return this.#growthTypeProb;
    }

    set growthTypeProb(value) {
        if (this.#growthTypeProbValidation(value)) {
            this.#growthTypeProb = value;
        }
    }

    get growthDirProb() {
        return this.#growthDirProb;
    }

    set growthDirProb(value) {
        if (this.#growthDirProbValidation(value)) {
            this.#growthDirProb = value;
        }
    }

    get colour() {
        return this.#colour;
    }

    set colour(value) {
        this.#colour = value;
    }

    get openEnds() {
        return this.#openEnds;
    }

    set openEnds(value) {
        if (this.#openEndsValidation(value)) {
            this.#openEnds = new OpenEnds(...value);
        }
    }

    #growthTypeProbValidation(value) {
        const keys = Object.keys(value);
        const goodKeys = ['bigger', 'split', 'nothing'];
        let keysAreValid = true;
        goodKeys.forEach(goodKey => {
            if (!keys.includes(goodKey)) {keysAreValid = false;}
        });
        const vals = Object.values(value);
        let valsAreValid = true;
        vals.forEach(val => {
            if (!Number.isInteger(val) || val < 1) {valsAreValid = false;}
        });
        if (keys.length == 3 && keysAreValid && valsAreValid) {
            return true;
        } else {
            throw 'Invalid growthTypeProb';
        }
    }

    #growthDirProbValidation(value) {
        const keys = Object.keys(value);
        const goodKeys = ['0', '1', '2', '3', '4'];
        let keysAreValid = true;
        goodKeys.forEach(goodKey => {
            if (!keys.includes(goodKey)) {keysAreValid = false;}
        });
        const vals = Object.values(value);
        let valsAreValid = true;
        vals.forEach(val => {
            if (!Number.isInteger(val) || val < 0) {valsAreValid = false;}
        });
        if (keys.length == 5 && keysAreValid && valsAreValid) {
            return true;
        } else {
            throw 'Invalid growthDirProb';
        }
    }

    //see openEnds and openEnd classes for validation of array elements
    #openEndsValidation(value) {
        if (Array.isArray(value)) {return true;} else {throw 'Invalid openEnds';}
    }

    static get allDirs() {
        return allDirections;
    }

    static set allDirs(value) {
        throw 'Cannot redefine constant allDirs';
    }
    
    static get allGrowthDirs() {
        return allGrowthDirections;
    }

    static set allGrowthDirs(value) {
        throw 'Cannot redefine constant allGrowthDirs';
    }

    bigEnough() {
        let result = false;
        this.openEnds.forEach(openEnd => {
            if (openEnd.xposn <= 2 ||
                openEnd.xposn >= 1998 ||
                openEnd.yposn <= 2 ||
                openEnd.yposn >= 1998) {
                result = true;
            }
        });
        return result;
    }
}

class OpenEnds extends Array {
    constructor(...elements) {
        super(...elements);
        if (!elements.every((element) => this.#openEndsElementValidation(element))) {
            throw 'Invalid openEnds';
        }
    }

    push(element) {
        if (this.#openEndsElementValidation(element)) {
            super.push(element);
        } else {
            throw 'Invalid openEnds';
        }
    }

    #openEndsElementValidation(element) {
        return (element.constructor.name === OpenEnd.name) ? true : false;
    }
}

class OpenEnd {
    #xposn
    #yposn
    #dirn

    constructor(xposn, yposn, dirn) {
        if (this.#xposnValidation(xposn)) {this.#xposn = xposn;}
        if (this.#yposnValidation(yposn)) {this.#yposn = yposn;}
        if (this.#dirnValidation(dirn)) {this.#dirn = dirn;}
    }
    
    get xposn() {
        return this.#xposn;
    }

    set xposn(value) {
        if (this.#xposnValidation(value)) {
            this.#xposn = value;
        }
    }
    
    get yposn() {
        return this.#yposn;
    }

    set yposn(value) {
        if (this.#yposnValidation(value)) {
            this.#yposn = value;
        }
    }
    
    get dirn() {
        return this.#dirn;
    }

    set dirn(value) {
        if (this.#dirnValidation(value)) {
            this.#dirn = value;
        }
    }

    #xposnValidation(xposn) {
        if (Number.isInteger(xposn) && xposn > 1) {
            return true;
        } else {
            throw 'Invalid openEnd';
        }
    }
    
    #yposnValidation(yposn) {
        if (Number.isInteger(yposn) && yposn > 1) {
            return true;
        } else {
            throw 'Invalid openEnd';
        }
    }
    
    #dirnValidation(dirn) {
        if (Number.isInteger(dirn) && dirn >= 0 && dirn < 16) {
            return true;
        } else {
            throw 'Invalid openEnd';
        }
    }

    possibleGrowthDirections() {
        const v = this.dirn; 
        const w = [v+14, v+15, v+16, v+17, v+18];
        return w.map(val => {return val % 16});
    }

    overlapDirections() {
        const v = this.dirn; //centre of spread with 16 directions
        const c = v + Math.floor((v+2)/2); //convert to 24 instead of 16 directions
        const spread24 = [c+21, c+22, c+23, c+24, c+25, c+26, c+27];
        if (v % 2 === 0) {spread24.unshift(c+20)};
        return spread24.map(val => {return val % 24});
    }

    isOpenEnd(screen) {
        const allDirections = Mycelium.allDirs;
        const directionsToCheck = this.overlapDirections();
        for (let dir of directionsToCheck) {
            let xToCheck = this.xposn + allDirections[dir][0];
            let yToCheck = this.yposn + allDirections[dir][1];
            if (screen[xToCheck][yToCheck] !== undefined) {return false};
        }
        return true;
    }

    growthDirections(growthDirProb) {
        const copygdp = {...growthDirProb};
        const result = [];
        let p = probResult(copygdp);
        result.push(this.possibleGrowthDirections()[Number.parseInt(p)]);
        copygdp[p] = 0;
        let q = probResult(copygdp);
        result.push(this.possibleGrowthDirections()[Number.parseInt(q)]);
        return result;
    }

    grow(screen, newOpenEnds, growthDirections, ctx) {
        const allGrowthDirections = Mycelium.allGrowthDirs;
        growthDirections.forEach(direction => {
            // calc position of new growth
            let newX = this.xposn + allGrowthDirections[direction][0];
            let newY = this.yposn + allGrowthDirections[direction][1];
            // update Screen 
            screen[newX][newY] = {mycelium: "primary"};
            // add new openEnd
            newOpenEnds.push(new OpenEnd(newX, newY, direction));
            // draw
            drawMyc(newX, newY, ctx);
        });
    }
}


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
    let openEnds = [];
    data.forEach(openEnd => {
        openEnds.push(new OpenEnd(openEnd[0], openEnd[1], openEnd[2]));
    });
    return openEnds;
}

const allGrowthDirections = [
    [0,-2],
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

const allDirections = [
    [0,-1],
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
    drawMyc(1000, 1000, ctx);
    mycelium.openEnds.forEach(openEnd => {
        drawMyc(openEnd.xposn, openEnd.yposn, ctx);
    });

    //*** line below needs generalising to multiple mycelia
    growAll(mycelium, screen, ctx, delay);
}

function growAll(mycelium, screen, ctx, delay) {
    let newOpenEnds = [];
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

function drawMyc(x, y, ctx) {
    ctx.fillStyle = "red";
    ctx.fillRect(x*2,y*2,4,4);
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

module.exports.createScreen = createScreen;
module.exports.createOpenEnds = createOpenEnds;
module.exports.setupScreen = setupScreen;
module.exports.createGrowthTypeProb = createGrowthTypeProb;
module.exports.createGrowthDirProb = createGrowthDirProb;
module.exports.probResult = probResult;
module.exports.Mycelium = Mycelium;
module.exports.OpenEnd = OpenEnd;

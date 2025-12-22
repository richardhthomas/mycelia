import {Mycelium} from "./mycelium.js";
import {OpenEnds} from "./openEnds.js";
import {OpenEnd} from "./openEnd.js";
import {probResult, hoveroverDetection} from "./utils.js";
import {pointerScroll, createButtons, buttons} from "./ui.js";

class GameState {
    #mycelia;
    #screen;
    #delay;
    #dragOver;
    #background;

    constructor(mycelia, screen, delay, dragOver, background) {
        if (this.#myceliaValidation(mycelia)) {
            this.#mycelia = mycelia;
        }
        if (this.#screenValidation(screen)) {
            this.#screen = screen;
        }
        if (this.#delayValidation(delay)) {
            this.#delay = delay;
        }
        if (this.#dragOverValidation(dragOver)) {
            this.#dragOver = dragOver;
        }
        this.#background = background;
    }
    
    get mycelia() {
        return this.#mycelia;
    }

    set mycelia(value) {
        if (this.#myceliaValidation(value)) {
            this.#mycelia = value;
        }
    }
    
    get screen() {
        return this.#screen;
    }

    set screen(value) {
        if (this.#screenValidation(value)) {
            this.#screen = value;
        }
    }

    get delay() {
        return this.#delay;
    }

    set delay(value) {
        if (this.#delayValidation(value)) {
            this.#delay = value;
        }
    }

    get dragOver() {
        return this.#dragOver;
    }

    set dragOver(value) {
        if (this.#dragOverValidation(value)) {
            this.#dragOver = value;
        }
    }

    get background() {
        return this.#background;
    }

    set background(value) {
        this.#background = value;
    }

    #myceliaValidation(value) {
        if (!Array.isArray(value)) {
            throw 'Invalid mycelia on GameState';
        } else {
            value.forEach(val => {
                if (val.constructor.name !== Mycelium.name) {
                    throw 'Invalid mycelia on GameState';
                }
            });
        }
        return true;
    }

    #screenValidation(value) {
        if (this.#screenIs2DArray(value)) {
            value.forEach(val1 => {
                val1.forEach(val2 => {
                    if ((typeof val2) == "object") {
                    for (const [k, v] of Object.entries(val2)) {
                        if (k != 'mycelium') {
                            throw 'Invalid screen on GameState';
                        }
                        if ((typeof v) != "string") {
                            throw 'Invalid screen on GameState';
                        }
                    }
                    }
                });
            });
            return true;
        } 
    }

    #screenIs2DArray(value) {
        if (!Array.isArray(value)) {
            throw 'Invalid screen on GameState';
        } else {
            value.forEach(val => {
                if(!Array.isArray(val)) {
                    throw 'Invalid screen on GameState';
                }
            });
        }
        return true;
    }

    #delayValidation(value) {

    }

    #dragOverValidation(value) {

    }

}

// screen array contains the state of mycelia (0 or 1) at each x,y position.
function createScreen() {
    const result = [];
    for (let i = 0; i < 1200; i++) {
        result[i] = [];
    };
    return result;
}

function setupScreen(screen, mycelia) {
    screen[600][350] = {mycelium: "primary"};
    screen[300][174] = {mycelium: "secondary"};
    //***line above needs to be generalised
    mycelia.forEach(mycelium => {
        mycelium.openEnds.forEach(openEnd => {
            screen[openEnd.xposn][openEnd.yposn] = {mycelium: mycelium.name};
        });
    });
}

function createOpenEnds1() {
    let data = [[600, 348, 0],
        [602, 348, 2],
        [602, 350, 4],
        [602, 352, 6],
        [600, 352, 8],
        [598, 352, 10],
        [598, 350, 12],
        [598, 348, 14]];
    let openEnds = new OpenEnds();
    data.forEach(openEnd => {
        openEnds.push(new OpenEnd(openEnd[0], openEnd[1], openEnd[2]));
    });
    return openEnds;
}

function createOpenEnds2() {
    let data = [
        [302, 176, 6],
        [300, 176, 8]];
    let openEnds = new OpenEnds();
    data.forEach(openEnd => {
        openEnds.push(new OpenEnd(openEnd[0], openEnd[1], openEnd[2]));
    });
    return openEnds;
}

// defines probabilities of growing bigger or splitting (vs doing nothing)
function createGrowthTypeProb() {
    return {bigger: 40, split: 20, nothing: 400};
}

// defines probabilities of growing 2 deviations or 1 deviation from straight ahead
function createGrowthDirProb() {
    return {"0": 5, "1": 12, "2": 120, "3": 12, "4": 5};
}

function createGame() {
    const canvasA = document.getElementById("play-areaA-canvas");
    const canvasB = document.getElementById("play-areaB-canvas");
    const canvasC = document.getElementById("play-areaC-canvas");
    const ctxA = canvasA.getContext("2d");
    let mycelium1 = new Mycelium(
        "primary",
        canvasB,
        canvasB.getContext("2d"),
        createGrowthTypeProb(),
        createGrowthDirProb(),
        "red",
        createOpenEnds1());
    let mycelium2 = new Mycelium(
        "secondary",
        canvasC,
        canvasC.getContext("2d"),
        createGrowthTypeProb(),
        createGrowthDirProb(),
        "blue",
        createOpenEnds2());
	let mycelia = [ mycelium1, mycelium2 ];
    const screen = createScreen(); 
    setupScreen(screen, mycelia);
    const delay = 100;
    canvasA.width = canvasB.width = canvasC.width = 2400;
    canvasA.height = canvasB.height = canvasC.height = 1400;


    // Create gradient
    ctxA.globalCompositeOperation = "multiply";
    const grad=ctxA.createRadialGradient(250,250,20,250,250,1000);
    grad.addColorStop(0,"red");
    grad.addColorStop(0.03,"#ff9999");
    grad.addColorStop(1,"white");
    ctxA.fillStyle = grad;
    ctxA.fillRect(0,0,2400,1400);
    
    const grad2=ctxA.createRadialGradient(1200,500,20,1200,500,1000);
    grad2.addColorStop(0,"#0000ff");
    grad2.addColorStop(0.03,"#9999ff");
    grad2.addColorStop(1,"white");
    ctxA.fillStyle = grad2;
    ctxA.fillRect(0,0,2400,1400);


    // draw starting mycelia
    mycelia[0].ctx.globalCompositeOperation = "source-over";
    mycelia[1].ctx.globalCompositeOperation = "source-over";
    //mycelia1
    mycelia[0].ctx.fillStyle = "red";
    mycelia[0].ctx.fillRect(1200, 700, 4, 4);
    mycelia[0].openEnds.forEach(openEnd => {
        openEnd.drawMyc(mycelia[0]);
    });
    //mycelia2
    mycelia[1].ctx.fillStyle = "blue";
    mycelia[1].ctx.fillRect(600, 348, 4, 4);
    mycelia[1].openEnds.forEach(openEnd => {
        openEnd.drawMyc(mycelia[1]);
    });

    return {
        "mycelia": mycelia,
        "screen": screen,
        "delay": delay,
        "dragover": null}
}

function runMyc(gameState) {
    if (!pause) {
        gameState.mycelia.forEach(mycelium => {
            if (!mycelium.bigEnough()) {
                growAll(mycelium, gameState.screen, gameState.delay);
            }
        }); 
    }
    setTimeout(() => {runMyc(gameState);}, gameState.delay);
}

function growAll(mycelium, screen, delay) {
    let newOpenEnds = new OpenEnds();
    mycelium.openEnds.forEach(openEnd => {
        if (openEnd.isOpenEnd(screen)) {
            let action = probResult(mycelium.growthTypeProb);
            if (action == "nothing") {
                newOpenEnds.push(openEnd);
            } else {
                let directions = openEnd.growthDirections(mycelium.growthDirProb);
                if (action == "bigger") {directions.pop();}
                openEnd.grow(mycelium, screen, newOpenEnds, directions);
            }
        }
    });
    mycelium.openEnds = newOpenEnds;
}

export { GameState, createScreen, createOpenEnds1, setupScreen, createGrowthTypeProb, createGrowthDirProb };

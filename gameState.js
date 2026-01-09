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
    #backgroundCanvas;
    #backgroundCtx;

    constructor(mycelia, delay, dragOver, backgroundCanvas) {
        if (this.#myceliaValidation(mycelia)) {
            this.#mycelia = mycelia;
        }
        this.#screen = this.#createScreen();
        if (this.#delayValidation(delay)) {
            this.#delay = delay;
        }
        if (this.#dragOverValidation(dragOver)) {
            this.#dragOver = dragOver;
        }
        if (this.#backgroundCanvasValidation(backgroundCanvas)) {
            this.#backgroundCanvas = backgroundCanvas;
            this.#backgroundCtx = backgroundCanvas.getContext('2d');
        }
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

    get backgroundCanvas() {
        return this.#backgroundCanvas;
    }

    set backgroundCanvas(value) {
        if (this.#backgroundCanvasValidation(value)) {
            this.#backgroundCanvas = value;
            this.#backgroundCtx = value.getContext('2d');
        }
    }

    get backgroundCtx() {
        return this.#backgroundCtx;
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

    // screen array contains object at each x,y position. Currently has just one key
    // 'mycelium' which contains name of mycelium
    #createScreen() {
        const result = [];
        for (let i = 0; i < 1200; i++) {
            result[i] = [];
        };
        return result;
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
        if (!Number.isInteger(value)) {
            throw 'Invalid delay on GameState';
        }
        if (value < 1) {
            throw 'Invalid delay on GameState';
        }
        return true;
    }

    #dragOverValidation(value) {
        if (value !== undefined && (typeof value) != 'string') {
            throw 'Invalid dragOver on GameState';
        }
        return true;
    }

    #backgroundCanvasValidation(value) {
        if (value.tagName != 'CANVAS') {
            throw 'Invalid backgroundCanvas on GameState';
        }
        return true;
    }

    findMyceliumByName(name) {
        for (let i=0; i<this.mycelia.length; i++) {
            if (this.mycelia[i].name == name) {
                return this.mycelia[i];
            }
        }
    }

    //draws starting mycelia plus populates screen array
    setupStartingMycelia() {
        for (let i=0; i<this.mycelia.length; i++) {
            this.mycelia[i].canvas.width = 2400;
            this.mycelia[i].canvas.height = 1400;
            this.mycelia[i].ctx.globalCompositeOperation = "source-over";
            this.mycelia[i].ctx.fillStyle = this.mycelia[i].colour;
            let x = this.mycelia[i].startPosn.xposn;
            let y = this.mycelia[i].startPosn.yposn;
            this.mycelia[i].ctx.fillRect(x*2, y*2, 4, 4);
            this.screen[x][y] = {mycelium: this.mycelia[i].name};
            this.mycelia[i].openEnds.forEach(openEnd => {
                openEnd.drawMyc(this.mycelia[i]);
                this.screen[openEnd.xposn][openEnd.yposn] = {mycelium: this.mycelia[i].name};
            });
        }
    }

}

// defines probabilities of growing bigger or splitting (vs doing nothing)
function createGrowthTypeProb() {
    return {bigger: 40, split: 20, nothing: 400};
}

// defines probabilities of growing 2 deviations or 1 deviation from straight ahead
function createGrowthDirProb() {
    return {"0": 5, "1": 12, "2": 120, "3": 12, "4": 5};
}

function runMyc(gameState) {
    if (!pause) {
        gameState.mycelia.forEach(mycelium => {
            if (!mycelium.bigEnough()) {
                mycelium.growAllOpenEnds(gameState.screen);
            }
        }); 
    }
    setTimeout(() => {runMyc(gameState);}, gameState.delay);
}

export { GameState, createGrowthTypeProb, createGrowthDirProb };

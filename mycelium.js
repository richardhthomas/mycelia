import {OpenEnds} from "./openEnds.js";
import {probResult} from "./utils.js";

class Mycelium {
    #name;
    #canvas;
    #ctx;
    #growthTypeProb;
    #growthDirProb;
    #colour;
    #startPosn;
    #openEnds;

    constructor(name, canvas, growthTypeProb, growthDirProb, colour, startPosn, openEnds) {
        this.#name = name;
        if (this.#canvasValidation(canvas)) {
            this.#canvas = canvas;
            this.#ctx = canvas.getContext('2d');
        }
        if (this.#growthTypeProbValidation(growthTypeProb)) {
            this.#growthTypeProb = growthTypeProb;
        }
        if (this.#growthDirProbValidation(growthDirProb)) {
            this.#growthDirProb = growthDirProb;
        }
        this.#colour = colour;
        if (this.#startPosnValidation(startPosn)) {
            this.#startPosn = startPosn;
        }
        if (this.#openEndsValidation(openEnds)) {
            this.#openEnds = new OpenEnds(...openEnds);
        }
    }

    get name() {
        return this.#name;
    }

    set name(value) {
        this.#name = value;
    }
    
    get canvas() {
        return this.#canvas;
    }

    set canvas(value) {
        if (this.#canvasValidation(value)) {
            this.#canvas = value;
        }
    }

    get ctx() {
        return this.#ctx;
    }

    set ctx(value) {
        if (this.#ctxValidation(value)) {
            this.#ctx = value;
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
    
    get startPosn() {
        return this.#startPosn;
    }

    set startPosn(value) {
        if (this.#startPosnValidation(value)) {
            this.#startPosn = value;
        }
    }

    get openEnds() {
        return this.#openEnds;
    }

    set openEnds(value) {
        if (this.#openEndsValidation(value)) {
            this.#openEnds = new OpenEnds(...value);
        }
    }

    #canvasValidation(value) {
        if (value.tagName != 'CANVAS') {
            throw 'Invalid canvas on Mycelium';
        }
        return true;
    }

    #ctxValidation(value) {
        if (value.constructor.name != 'CanvasRenderingContext2D') {
            throw 'Invalid context on Mycelium';
        }
        return true;
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
        let sum = 0;
        vals.forEach(val => {
            if (!Number.isInteger(val) || val < 0) {valsAreValid = false;}
            sum += val;
        });
        if (sum < 1) {valsAreValid = false;}
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

    #startPosnValidation(value) {
        if ((typeof value) != "object") {
            throw 'Invalid startPosn on Mycelium';
        }
        for (const [k, v] of Object.entries(value)) {
            if (k != 'xposn' && k != 'yposn') {
                throw 'Invalid startPosn on Mycelium';
            }
            if (!Number.isInteger(v)) {
                throw 'Invalid startPosn on Mycelium';
            }
            if (v < 1) {
                throw 'Invalid startPosn on Mycelium';
            }
        }
        return true;
    }

    //see openEnds and openEnd classes for validation of array elements
    #openEndsValidation(value) {
        if (Array.isArray(value)) {return true;} else {throw 'Invalid openEnds';}
    }


    bigEnough() {
        let result = false;
        this.openEnds.forEach(openEnd => {
            if (openEnd.xposn <= 2 ||
                openEnd.xposn >= 1198 ||
                openEnd.yposn <= 2 ||
                openEnd.yposn >= 698) {
                result = true;
            }
        });
        return result;
    }

    growAllOpenEnds(screen) {
        let newOpenEnds = new OpenEnds();
        this.openEnds.forEach(openEnd => {
            if (openEnd.isOpenEnd(screen)) {
                let action = probResult(this.growthTypeProb);
                if (action == "nothing") {
                    newOpenEnds.push(openEnd);
                } else {
                    let directions = openEnd.growthDirections(this.growthDirProb);
                    if (action == "bigger") {directions.pop();}
                    openEnd.grow(this, screen, newOpenEnds, directions);
                }
            }
        });
        this.openEnds = newOpenEnds;
    }

}

export {Mycelium};

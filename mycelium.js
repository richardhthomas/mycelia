export class Mycelium {
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

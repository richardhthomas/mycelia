const {Mycelium} = require('./mycelium.js');

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
        //const allDirections = Mycelium.allDirs;
        const m = new Mycelium(
            {bigger: 40, split: 20, nothing: 50},
            {"0": 5, "1": 12, "2": 120, "3": 12, "4": 5},
        'red',
        [new OpenEnd(252,140,15),
        new OpenEnd(242,152,11),
        new OpenEnd(258,154,4),
        new OpenEnd(256,158,7)]);

        console.log(m.colour);
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
const m = new Mycelium(
            {bigger: 40, split: 20, nothing: 50},
            {"0": 5, "1": 12, "2": 120, "3": 12, "4": 5},
        'red',
        [new OpenEnd(252,140,15),
        new OpenEnd(242,152,11),
        new OpenEnd(258,154,4),
        new OpenEnd(256,158,7)]);

        console.log(m.colour);

module.exports = {OpenEnd};

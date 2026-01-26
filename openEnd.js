import {probResult} from "./utils.js";

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
            throw new Error('Invalid openEnd');
        }
    }
    
    #yposnValidation(yposn) {
        if (Number.isInteger(yposn) && yposn > 1) {
            return true;
        } else {
            throw new Error('Invalid openEnd');
        }
    }
    
    #dirnValidation(dirn) {
        if (Number.isInteger(dirn) && dirn >= 0 && dirn < 16) {
            return true;
        } else {
            throw new Error('Invalid openEnd');
        }
    }
    
    static get ALL_DIRS() {
        return [
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
    }

    static set ALL_DIRS(value) {
        throw new Error('Cannot redefine constant ALL_DIRS');
    }
    
    static get ALL_GROWTH_DIRS() {
        return [
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
    }

    static set ALL_GROWTH_DIRS(value) {
        throw new Error('Cannot redefine constant ALL_GROWTH_DIRS');
    }

    getPrivatePropertyNames() {
        return [
            'xposn',
            'yposn',
            'dirn'];
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
        const directionsToCheck = this.overlapDirections();
        for (let dir of directionsToCheck) {
            let xToCheck = this.xposn + OpenEnd.ALL_DIRS[dir][0];
            let yToCheck = this.yposn + OpenEnd.ALL_DIRS[dir][1];
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

    grow(mycelium, screen, newOpenEnds, growthDirections) {
        growthDirections.forEach(direction => {
            // calc position of new growth
            let newX = this.xposn + OpenEnd.ALL_GROWTH_DIRS[direction][0];
            let newY = this.yposn + OpenEnd.ALL_GROWTH_DIRS[direction][1];
            // update Screen 
            screen[newX][newY] = {mycelium: mycelium.name};
            // add new openEnd
            newOpenEnds.push(new OpenEnd(newX, newY, direction));
            // draw
            newOpenEnds.at(-1).drawMyc(mycelium);
        });
    }

    drawMyc(mycelium) {
        mycelium.ctx.fillStyle = mycelium.colour;
        mycelium.ctx.fillRect(this.xposn*2, this.yposn*2, 4, 4);
    }

}

export {OpenEnd};

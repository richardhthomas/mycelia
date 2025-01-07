import {OpenEnd} from "./openEnd.js";

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

export {OpenEnds};

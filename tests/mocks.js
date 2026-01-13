import {Mycelium} from "../mycelium.js";
import {OpenEnd} from "../openEnd.js";
import {OpenEnds} from "../openEnds.js";
import {GameState} from "../gameState.js";
import * as model from '../model4.js';

function populateMockScreen(gameState) {
    let data = [
        [250,150],
        [250,148],
        [250,146],
        [251,144],
        [253,142],
        [252,140],
        [248,150],
        [246,150],
        [244,151],
        [242,152],
        [252,152],
        [254,154],
        [256,154],
        [258,154],
        [255,156],
        [256,158]]
    for (let i = 0; i < data.length; i++) {
        gameState.screen[data[i][0]][data[i][1]] = {mycelium: "primary"};
    };
}

function createMockMycelium() {
    const canvas = document.createElement('canvas');
    return new Mycelium(
        'primary',
        canvas,
        createMockGrowthTypeProb(),
        createMockGrowthDirProb(),
        'red',
        {xposn: 250, yposn: 150},
        [0,2,4,8]);
}

function createMockOpenEnd() {
    return new OpenEnd(250, 150, 3);
}

function createMockOpenEnds() {
    let openEnds = new OpenEnds();
    openEnds.create([[250, 150, 3], [252, 140, 15]]);
    return openEnds;
}

function createMockGameState() {
    const backgroundCanvas = document.createElement('canvas');
    return new GameState(
        [createMockMycelium()],
        100,
        undefined,
        backgroundCanvas);
}

// defines probabilities of growing bigger or splitting (vs doing nothing)
function createMockGrowthTypeProb() {
    return {bigger: 40, split: 20, nothing: 400};
}

// defines probabilities of growing 2 deviations or 1 deviation from straight ahead
function createMockGrowthDirProb() {
    return {"0": 5, "1": 12, "2": 120, "3": 12, "4": 5};
}

export {populateMockScreen, createMockMycelium, createMockOpenEnd, createMockOpenEnds, createMockGameState, createMockGrowthTypeProb, createMockGrowthDirProb};

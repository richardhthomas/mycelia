import {Mycelium} from "../mycelium.js";
import {OpenEnd} from "../openEnd.js";
import {GameState} from "../gameState.js";
import * as model from '../model4.js';

function createMockScreen() {
    const screen = model.createScreen();
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
        screen[data[i][0]][data[i][1]] = {mycelium: "primary"};
    };
    return screen;
}

function createMockMycelium() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    return new Mycelium(
        'primary',
        canvas,
      //  ctx,
        model.createGrowthTypeProb(),
        model.createGrowthDirProb(),
        'red',
        {xposn: 250, yposn: 150},
        [new OpenEnd(252,140,15),
        new OpenEnd(242,152,11),
        new OpenEnd(258,154,4),
        new OpenEnd(256,158,7)]);
}

function createMockOpenEnd() {
    return new OpenEnd(250, 150, 3);
}

function createMockGameState() {
    const backgroundCanvas = document.createElement('canvas');
    const backgroundCtx = backgroundCanvas.getContext('2d');
    return new GameState(
        [createMockMycelium()],
        createMockScreen(),
        100,
        undefined,
        {canvas: backgroundCanvas, ctx: backgroundCtx});
}


export {createMockScreen, createMockMycelium, createMockOpenEnd, createMockGameState};

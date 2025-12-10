import {Mycelium} from "../mycelium.js";
import {OpenEnds} from "../openEnds.js";
import {OpenEnd} from "../openEnd.js";
import {probResult} from "../utils.js";
import * as model from '../model4.js';
import * as mocks from './mocks.js';

test('screen is setup correctly', () => {
    const mycelium = mocks.createMockMycelium();
    const mycelia = [ mycelium ]; 
    const screen = model.createScreen();
    model.setupScreen(screen, mycelia);
    mycelium.openEnds.forEach(openEnd => {
        expect(screen[openEnd.xposn][openEnd.yposn]).toEqual({mycelium: "primary"});
    });
});


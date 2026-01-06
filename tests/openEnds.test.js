import {Mycelium} from "../mycelium.js";
import {OpenEnd} from "../openEnd.js";
import {OpenEnds} from "../openEnds.js";
import * as model from '../model4.js';
import * as mocks from './mocks.js';

test('OpenEnds create method creates array of OpenEnds', () => {
    const openEnds = mocks.createMockOpenEnds();
    expect(openEnds[0]).toBeInstanceOf(OpenEnd);
});


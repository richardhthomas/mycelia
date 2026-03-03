import * as model from '../model4.js';
import * as utils from '../utils.js';
import * as mocks from './mocks.js';

test('probResult returns result based on given probabilities', () => {
    const growthTypeProb = mocks.createMockGrowthTypeProb();
    expect(utils.probResult(growthTypeProb)).toMatch(/bigger|split|nothing/); 
    let bigger = 0, split = 0, nothing = 0;
    for (let i=0; i<1000; i++) {
        let result = utils.probResult(growthTypeProb);
        if (result == 'bigger') {
            bigger += 1;
        } else if (result == 'split') {
            split += 1;
        } else {
            nothing += 1;
        }
    }
});

test('hoveroverDetection detects when over screen object', () => {
    const gameState = mocks.createMockGameState([mocks.createMockMycelium()]);
    mocks.populateMockScreen(gameState);
    const screen = gameState.screen;
    let hits = [[250,146], [260, 156], [240, 150], [256, 160], [252,138]];
    let misses = [[261, 154], [239, 152], [256, 161], [252, 137]];
    hits.forEach(hit => {
        expect(utils.hoveroverDetection(hit[0], hit[1], screen).mycelium).toBe("primary");
    });
    misses.forEach(miss => {
        expect(utils.hoveroverDetection(miss[0], miss[1], screen)).toBeUndefined();
    });
});

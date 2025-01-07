import * as model from '../model4.js';
import * as utils from '../utils.js';

test('probResult returns result based on given probabilities', () => {
    const growthTypeProb = model.createGrowthTypeProb();
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
    console.log("bigger " + bigger, "split " + split, "nothing " + nothing);
});

const model = require('../model1');

function createMockMycMap() {
    const mycMap = model.createMycMap();
    let data = [
        [250,150,65535],
        [250,148,257],
        [250,146,258],
        [251,144,516],
        [253,142,33792],
        [252,140,128],
        [248,150,4112],
        [246,150,2064],
        [244,151,2056],
        [242,152,8],
        [252,152,16448],
        [254,154,16528],
        [256,154,4112],
        [258,154,4096],
        [255,156,32896],
        [256,158,32768]]
    for (let i = 0; i < data.length; i++) {
        mycMap[data[i][0]][data[i][1]] = data[i][2];
    };
    return mycMap;
}

function createMockOpenEnds() {
    return [
        [252,140],
        [242,152],
        [258,154],
        [256,158]]
}

test('mycMapValues are as expected', () => {
    expect(model.createMycMapValues()[0].toString()).toBe("0,-2");
});

test('mycMap is the right size', () => {
    expect(model.createMycMap().length).toEqual(500);
    model.createMycMap().forEach(mycMapRow => {
        expect(mycMapRow.length).toEqual(300);
    });
});

test('calcMycMap returns correct values', () => {
    const mycMap = createMockMycMap();
    const expectedValues = [
        [254,148,0],
        [246,152,8197],
        [251,142,274],
        [257,156,37378]];
    expectedValues.forEach(values => {
        expect(model.calcMycMap(mycMap, model.createMycMapValues(), values[0], values[1])).toEqual(values[2]);
    });
});

test('bigEnough returns true if reached edge of screen', () => {
    const openEnds = createMockOpenEnds();
    expect(model.bigEnough(openEnds)).toBe(false);
    const edges = [
        [2,150],
        [498,150],
        [250,2],
        [250,298]]
    edges.forEach(edge => {
        openEnds.pop();
        openEnds.push(edge);
        expect(model.bigEnough(openEnds)).toBe(true);
    });
});

test('growthDirections returns array of possible directions', () => {
    const mycMap = createMockMycMap();
    const expectedValues = [
        [[252,140],[13,14,15,0,1]],
        [[242,152],[9,10,11,12,13]],
        [[258,154],[2,3,4,5,6]],
        [[256,158],[5,6,7,8,9]]];
    expectedValues.forEach(values => {
        expect(model.growthDirections(values[0], mycMap)).toEqual(values[1]);
    });
});

test('isOpenEnd returns true if open end', () => {
    const mycMap = createMockMycMap();
    const trueOpenEnds = createMockOpenEnds();
    const falseOpenEnds = [
        [250,148],
        [251,144],
        [253,142],
        [256,154]];
    trueOpenEnds.forEach(openEnd => {
        expect(model.isOpenEnd(mycMap, openEnd[0], openEnd[1])).toBe(true);
    });
    falseOpenEnds.forEach(openEnd => {
        expect(model.isOpenEnd(mycMap, openEnd[0], openEnd[1])).toBe(false);
    });
});

test('probResult returns result based on given probabilities', () => {
    const growthTypeProbability = model.createGrowthTypeProbability();
    expect(model.probResult(growthTypeProbability)).toMatch(/bigger|split|nothing/); 
    let bigger = 0, split = 0, nothing = 0;
    for (let i=0; i<1000; i++) {
        let result = model.probResult(growthTypeProbability);
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

function mycCount(mycMap) {
    const mycMapFlat = mycMap.flat().filter((val) => {return val != 0});
    return mycMapFlat.length;
}

test('growthDirection returns 0-15 value for direction', () => {
    const mycMap = createMockMycMap();
    const openEnds = createMockOpenEnds();
    const p = model.createGrowthDirectionProbability();
    const gd = model.growthDirection(openEnds[2], mycMap, p);
    expect(gd).toBeGreaterThanOrEqual(2);
    expect(gd).toBeLessThanOrEqual(6);
});

test('growMyc increases mycelial size as expected', () => {
    const mycMap = createMockMycMap();
    const openEnds = createMockOpenEnds();
    const newOpenEnds = [];
    const mycMapValues = model.createMycMapValues();
    const initMycCount = mycCount(mycMap);
    const openEndsCount = newOpenEnds.length;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    model.growMyc(mycMap, openEnds[0], newOpenEnds, mycMapValues, "bigger", 15, ctx);
    expect(mycCount(mycMap)).toEqual(initMycCount + 1);
    expect(mycMap[251][138]).toEqual(128);
    expect(mycMap[252][140]).toEqual(32896);
    expect(newOpenEnds.length).toEqual(openEndsCount + 1);
    expect(newOpenEnds[0][0]).toEqual(251);
    expect(newOpenEnds[0][1]).toEqual(138);

    model.growMyc(mycMap, openEnds[2], newOpenEnds, mycMapValues, "split", 4, ctx);
    expect(mycCount(mycMap)).toEqual(initMycCount + 3);
    expect(mycMap[251][138]).toEqual(128);
    expect(mycMap[252][140]).toEqual(32896);
    expect(newOpenEnds.length).toEqual(openEndsCount + 1);
    expect(newOpenEnds[0][0]).toEqual(251);
    expect(newOpenEnds[0][1]).toEqual(138);
});

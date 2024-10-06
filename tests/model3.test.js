const model = require('../model3');

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

function createMockOpenEnds() {
    return [
        [252,140,15],
        [242,152,11],
        [258,154,4],
        [256,158,7]]
}

//test('ScreenData constructor works', () => {
//    const screenData = new ScreenData("main", 100);
//    expect(screenData.mycelium).toEqual("main");
//    expect(screenData.strength).toEqual(100);
//});

test('Mycelium constructor', () => {
    const gtp = model.createGrowthTypeProb();
    const gdp = model.createGrowthDirProb();
    const mycelium = new model.Mycelium(gtp, gdp, "red");
    expect(mycelium.growthTypeProb).toBe(gtp);
    expect(mycelium.growthDirProb).toBe(gdp);
    expect(mycelium.colour).toBe("red");
});

test('Validation on growthTypeProb on Mycelium', () => {
    const badGtps = [
        {bigger: 1, split: 1},
        {bigger: 1, split: 1, xxx: 1},
        {bigger: 1, xxx: 1, nothing: 1},
        {xxx: 1, split: 1, nothing: 1},
        {bigger: "a", split: 1, nothing: 1},
        {bigger: 1, split: "a", nothing: 1},
        {bigger: 1, split: 1, nothing: "a"},
        {bigger: 0, split: 1, nothing: 1}]
    const goodGtp = model.createGrowthTypeProb();
    const gdp = model.createGrowthDirProb();
    const mycelium = new model.Mycelium(goodGtp, gdp, "red");
    badGtps.forEach(badGtp => {
        expect(() => {mycelium.growthTypeProb = badGtp}).toThrow('Invalid growthTypeProb');
    });
    expect(() => {new model.Mycelium(badGtps[1], gdp, "red")}).toThrow('Invalid growthTypeProb');
});

test('Validation on growthDirProb on Mycelium', () => {
    const badGdps = [
        {"a": 5, "1": 12, "2": 120, "3": 12, "4": 5},
        {"0": 5, "a": 12, "2": 120, "3": 12, "4": 5},
        {"0": 5, "1": 12, "a": 120, "3": 12, "4": 5},
        {"0": 5, "1": 12, "2": 120, "a": 12, "4": 5},
        {"0": 5, "1": 12, "2": 120, "3": 12, "a": 5},
        {"0": "a", "1": 12, "2": 120, "3": 12, "4": 5},
        {"0": 5, "1": "a", "2": 120, "3": 12, "4": 5},
        {"0": 5, "1": 12, "2": "a", "3": 12, "4": 5},
        {"0": 5, "1": 12, "2": 120, "3": "a", "4": 5},
        {"0": 5, "1": 12, "2": 120, "3": 12, "4": "a"}]
    const gtp = model.createGrowthTypeProb();
    const goodGdp = model.createGrowthDirProb();
    const mycelium = new model.Mycelium(gtp, goodGdp, "red");
    badGdps.forEach(badGdp => {
        expect(() => {mycelium.growthDirProb = badGdp}).toThrow('Invalid growthDirProb');
    });
    expect(() => {new model.Mycelium(gtp, badGdps[1], "red")}).toThrow('Invalid growthDirProb');
});

test('allDirs is as expected', () => {
    expect(model.Mycelium.allDirs[0].toString()).toBe("0,-1");
    expect(() => {model.Mycelium.allDirs = "a"}).toThrow('Cannot redefine constant allDirs');
});

test('allGrowthDirs is as expected', () => {
    expect(model.Mycelium.allGrowthDirs[0].toString()).toBe("0,-2");
    expect(() => {model.Mycelium.allGrowthDirs = "a"}).toThrow('Cannot redefine constant allGrowthDirs');
});

test('screen is setup correctly', () => {
    const openEnds = model.createOpenEnds();
    const screen = model.createScreen();
    model.setupScreen(screen);
    openEnds.forEach(openEnd => {
        expect(screen[openEnd[0]][openEnd[1]]).toEqual({mycelium: "primary"});
    });
});

test('bigEnough returns true if reached edge of screen', () => {
    const openEnds = createMockOpenEnds();
    expect(model.bigEnough(openEnds)).toBe(false);
    const edges = [
        [2,150],
        [1998,150],
        [250,2],
        [250,1998]]
    edges.forEach(edge => {
        openEnds.pop();
        openEnds.push(edge);
        expect(model.bigEnough(openEnds)).toBe(true);
    });
});

test('possibleGrowthDirections returns array of possible directions', () => {
    const expectedValues = [
        [[252,140,15],[13,14,15,0,1]],
        [[242,152,11],[9,10,11,12,13]],
        [[258,154,4],[2,3,4,5,6]],
        [[256,158,7],[5,6,7,8,9]]];
    expectedValues.forEach(values => {
        expect(model.possibleGrowthDirections(values[0])).toEqual(values[1]);
    });
});

test('overlapDirections returns array of possible directions', () => {
    const expectedValues = [
        [[252,140,15],[20,21,22,23,0,1,2]],
        [[242,152,11],[14,15,16,17,18,19,20]],
        [[258,154,4],[3,4,5,6,7,8,9,10]],
        [[256,158,7],[8,9,10,11,12,13,14]]];
    expectedValues.forEach(values => {
        expect(model.overlapDirections(values[0])).toEqual(values[1]);
    });
});

test('isOpenEnd returns true if open end', () => {
    const screen = createMockScreen();
    const trueOpenEnds = createMockOpenEnds();
    const falseOpenEnds = [
        [250,148,0],
        [251,144,0],
        [253,142,0],
        [256,154,8],
        [245,149,4]];
    trueOpenEnds.forEach(openEnd => {
        expect(model.isOpenEnd(screen, openEnd)).toBe(true);
    });
    falseOpenEnds.forEach(openEnd => {
        expect(model.isOpenEnd(screen, openEnd)).toBe(false);
    });
});

test('probResult returns result based on given probabilities', () => {
    const growthTypeProb = model.createGrowthTypeProb();
    expect(model.probResult(growthTypeProb)).toMatch(/bigger|split|nothing/); 
    let bigger = 0, split = 0, nothing = 0;
    for (let i=0; i<1000; i++) {
        let result = model.probResult(growthTypeProb);
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

function mycCount(screen) {
    const screenFlat = screen.flat().filter((val) => {return val != undefined});
    return screenFlat.length;
}

test('growthDirections returns array of two 0-15 values for directions', () => {
    const openEnds = createMockOpenEnds();
    const p = model.createGrowthDirProb();
    const gd = model.growthDirections(openEnds[2], p);
    expect(gd[0]).toBeGreaterThanOrEqual(2);
    expect(gd[0]).toBeLessThanOrEqual(6);
    expect(gd[1]).toBeGreaterThanOrEqual(2);
    expect(gd[1]).toBeLessThanOrEqual(6);
});

test('growMyc increases mycelial size as expected', () => {
    const screen = createMockScreen();
    const openEnds = createMockOpenEnds();
    const newOpenEnds = [];
    const initMycCount = mycCount(screen);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    model.growMyc(screen, openEnds[0], newOpenEnds, [15, 13], ctx);
    expect(mycCount(screen)).toEqual(initMycCount + 2);
    expect(screen[251][138].mycelium).toEqual("primary");
    expect(screen[250][139].mycelium).toEqual("primary");
    expect(newOpenEnds.length).toEqual(2);
    expect(newOpenEnds[0]).toEqual([251, 138, 15]);
    expect(newOpenEnds[1]).toEqual([250, 139, 13]);
});

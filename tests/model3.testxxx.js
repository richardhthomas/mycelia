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

function createMockMycelium() {
    return new model.Mycelium(
        model.createGrowthTypeProb(),
        model.createGrowthDirProb(),
        'red',
        [new model.OpenEnd(252,140,15),
        new model.OpenEnd(242,152,11),
        new model.OpenEnd(258,154,4),
        new model.OpenEnd(256,158,7)]);
}

function createMockOpenEnd() {
    return new model.OpenEnd(250, 150, 3);
}

test('Mycelium constructor', () => {
    const mycelium = createMockMycelium();
    expect(mycelium.growthTypeProb).toEqual(model.createGrowthTypeProb());
    expect(mycelium.growthDirProb).toEqual(model.createGrowthDirProb());
    expect(mycelium.colour).toBe("red");
    expect(mycelium.openEnds[0].xposn).toEqual(252);
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
        {bigger: 0, split: 1, nothing: 1}];
    const mycelium = createMockMycelium(); 
    badGtps.forEach(badGtp => {
        expect(() => {mycelium.growthTypeProb = badGtp}).toThrow('Invalid growthTypeProb');
    });
    expect(() => {new model.Mycelium(
        badGtps[1], 
        model.createGrowthDirProb(), 
        "red", 
        [createMockOpenEnd()])}).toThrow('Invalid growthTypeProb');
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
        {"0": 5, "1": 12, "2": 120, "3": 12, "4": "a"}];
    const mycelium = createMockMycelium(); 
    badGdps.forEach(badGdp => {
        expect(() => {mycelium.growthDirProb = badGdp}).toThrow('Invalid growthDirProb');
    });
    expect(() => {new model.Mycelium(
        model.createGrowthTypeProb(), 
        badGdps[1], 
        "red", 
        [createMockOpenEnd()])}).toThrow('Invalid growthDirProb');
});

test('validation of openEnds', () => {
    const mycelium = createMockMycelium();
    expect(() => {mycelium.openEnds = 250}).toThrow('Invalid openEnds');
    expect(() => {mycelium.openEnds = [250, 150, 3]}).toThrow('Invalid openEnds');
    expect(() => {new model.Mycelium(
        model.createGrowthTypeProb(), 
        model.createGrowthDirProb(), 
       "red", 
        250)}).toThrow('Invalid openEnds');
});

test('OpenEnd constructor', () => {
    const openEnd = createMockOpenEnd();
    expect(openEnd.xposn).toEqual(250);
    expect(openEnd.yposn).toEqual(150);
    expect(openEnd.dirn).toEqual(3);
});

test('validation of openEnd', () => {
    const openEnd = createMockOpenEnd();
    const badOpenEnds = [
        [130.5, 'a', null],
        [-250, -150, 16]];
    badOpenEnds.forEach(badOpenEnd => {
        expect(() => {openEnd.xposn = badOpenEnd[0]}).toThrow('Invalid openEnd'); 
        expect(() => {openEnd.yposn = badOpenEnd[1]}).toThrow('Invalid openEnd'); 
        expect(() => {openEnd.dirn = badOpenEnd[2]}).toThrow('Invalid openEnd'); 
        expect(() => {new model.OpenEnd(badOpenEnd[0],
            badOpenEnd[1],
            badOpenEnd[2])}).toThrow('Invalid openEnd');
    });
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
    const mycelium = createMockMycelium();
    const mycelia = { primary: mycelium }
    const screen = model.createScreen();
    model.setupScreen(screen, mycelia);
    mycelium.openEnds.forEach(openEnd => {
        expect(screen[openEnd.xposn][openEnd.yposn]).toEqual({mycelium: "primary"});
    });
});

test('bigEnough returns true if reached edge of screen', () => {
    const mycelium = createMockMycelium();
    expect(mycelium.bigEnough()).toBe(false);
    const edges = [
        new model.OpenEnd(2,150,1),
        new model.OpenEnd(1998,150,1),
        new model.OpenEnd(250,2,1),
        new model.OpenEnd(250,1998,1)]
    edges.forEach(edge => {
        mycelium.openEnds.pop();
        mycelium.openEnds.push(edge);
        expect(mycelium.bigEnough()).toBe(true);
    });
});

test('possibleGrowthDirections returns array of possible directions', () => {
    const mycelium = createMockMycelium();
    const expectedValues = [
        [13,14,15,0,1],
        [9,10,11,12,13],
        [2,3,4,5,6],
        [5,6,7,8,9]];
    expectedValues.forEach((values, index) => {
        expect(mycelium.openEnds[index].possibleGrowthDirections()).toEqual(values);
    });
});

test('overlapDirections returns array of possible directions', () => {
    const mycelium = createMockMycelium();
    const expectedValues = [
        [20,21,22,23,0,1,2],
        [14,15,16,17,18,19,20],
        [3,4,5,6,7,8,9,10],
        [8,9,10,11,12,13,14]];
    expectedValues.forEach((values, index) => {
        expect(mycelium.openEnds[index].overlapDirections()).toEqual(values);
    });
});

test('isOpenEnd returns true if open end', () => {
    const screen = createMockScreen();
    const falseOpenEnds = [
        new model.OpenEnd(250,148,0),
        new model.OpenEnd(251,144,0),
        new model.OpenEnd(253,142,0),
        new model.OpenEnd(256,154,8),
        new model.OpenEnd(245,149,4)];
    createMockMycelium().openEnds.forEach(openEnd => {
        expect(openEnd.isOpenEnd(screen)).toBe(true);
    });
    falseOpenEnds.forEach(openEnd => {
        expect(openEnd.isOpenEnd(screen)).toBe(false);
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
    const mycelium = createMockMycelium();
    const gd = mycelium.openEnds[2].growthDirections(mycelium.growthDirProb);
    expect(gd[0]).toBeGreaterThanOrEqual(2);
    expect(gd[0]).toBeLessThanOrEqual(6);
    expect(gd[1]).toBeGreaterThanOrEqual(2);
    expect(gd[1]).toBeLessThanOrEqual(6);
});

test('grow on OpenEnd increases mycelial size as expected', () => {
    const screen = createMockScreen();
    const mycelium = createMockMycelium();
    const newOpenEnds = [];
    const initMycCount = mycCount(screen);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    mycelium.openEnds[0].grow(screen, newOpenEnds, [15, 13], ctx);
    expect(mycCount(screen)).toEqual(initMycCount + 2);
    expect(screen[251][138].mycelium).toEqual("primary");
    expect(screen[250][139].mycelium).toEqual("primary");
    expect(newOpenEnds.length).toEqual(2);
    expect(newOpenEnds[0].xposn).toEqual(251);
    expect(newOpenEnds[0].yposn).toEqual(138);
    expect(newOpenEnds[0].dirn).toEqual(15);
    expect(newOpenEnds[1].xposn).toEqual(250);
    expect(newOpenEnds[1].yposn).toEqual(139);
    expect(newOpenEnds[1].dirn).toEqual(13);
});

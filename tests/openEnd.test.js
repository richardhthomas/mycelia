const model = require('../model4');
const Mycelium = require('../mycelium.js');
const OpenEnd = require('../openEnd.js');

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
    return new Mycelium(
        model.createGrowthTypeProb(),
        model.createGrowthDirProb(),
        'red',
        [new OpenEnd(252,140,15),
        new OpenEnd(242,152,11),
        new OpenEnd(258,154,4),
        new OpenEnd(256,158,7)]);
}

function createMockOpenEnd() {
    return new OpenEnd(250, 150, 3);
}


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
        expect(() => {new OpenEnd(badOpenEnd[0],
            badOpenEnd[1],
            badOpenEnd[2])}).toThrow('Invalid openEnd');
    });
});

test('allDirs is as expected', () => {
    expect(OpenEnd.allDirs[0].toString()).toBe("0,-1");
    expect(() => {OpenEnd.allDirs = "a"}).toThrow('Cannot redefine constant allDirs');
});

test('allGrowthDirs is as expected', () => {
    expect(OpenEnd.allGrowthDirs[0].toString()).toBe("0,-2");
    expect(() => {OpenEnd.allGrowthDirs = "a"}).toThrow('Cannot redefine constant allGrowthDirs');
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
        new OpenEnd(250,148,0),
        new OpenEnd(251,144,0),
        new OpenEnd(253,142,0),
        new OpenEnd(256,154,8),
        new OpenEnd(245,149,4)];
    const mycelium = createMockMycelium();
    createMockMycelium().openEnds.forEach(openEnd => {
        expect(openEnd.isOpenEnd(screen)).toBe(true);
    });
    falseOpenEnds.forEach(openEnd => {
        expect(openEnd.isOpenEnd(screen)).toBe(false);
    });
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

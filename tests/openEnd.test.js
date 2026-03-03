import {Mycelium} from "../mycelium.js";
import {OpenEnd} from "../openEnd.js";
import * as model from '../model4.js';
import * as mocks from './mocks.js';

test('OpenEnd constructor', () => {
    const openEnd = mocks.createMockOpenEnd();
    expect(openEnd.xposn).toEqual(250);
    expect(openEnd.yposn).toEqual(150);
    expect(openEnd.dirn).toEqual(3);
});

test('validation of openEnd', () => {
    const openEnd = mocks.createMockOpenEnd();
    const badOpenEnds = [
        [130.5, 'a', null],
        [-250, -150, 16]];
    badOpenEnds.forEach(badOpenEnd => {
        expect(() => {openEnd.xposn = badOpenEnd[0]}).toThrow(new Error('Invalid openEnd')); 
        expect(() => {openEnd.yposn = badOpenEnd[1]}).toThrow(new Error('Invalid openEnd')); 
        expect(() => {openEnd.dirn = badOpenEnd[2]}).toThrow(new Error('Invalid openEnd')); 
        expect(() => {new OpenEnd(badOpenEnd[0],
            badOpenEnd[1],
            badOpenEnd[2])}).toThrow(new Error('Invalid openEnd'));
    });
});

test('ALL_DIRS is as expected', () => {
    expect(OpenEnd.ALL_DIRS[0].toString()).toBe("0,-1");
    expect(() => {OpenEnd.ALL_DIRS = "a"}).toThrow(new Error('Cannot redefine constant ALL_DIRS'));
});

test('ALL_GROWTH_DIRS is as expected', () => {
    expect(OpenEnd.ALL_GROWTH_DIRS[0].toString()).toBe("0,-2");
    expect(() => {OpenEnd.ALL_GROWTH_DIRS = "a"}).toThrow(new Error('Cannot redefine constant ALL_GROWTH_DIRS'));
});

test('possibleGrowthDirections returns array of possible directions', () => {
    const mycelium = mocks.createMockMycelium();
    const expectedValues = [
        [14,15,0,1,2],
        [0,1,2,3,4],
        [2,3,4,5,6],
        [6,7,8,9,10]];
    expectedValues.forEach((values, index) => {
        expect(mycelium.openEnds[index].possibleGrowthDirections()).toEqual(values);
    });
});

test('overlapDirections returns array of possible directions', () => {
    const mycelium = mocks.createMockMycelium();
    const expectedValues = [
        [21,22,23,0,1,2,3,4],
        [0,1,2,3,4,5,6,7],
        [3,4,5,6,7,8,9,10],
        [9,10,11,12,13,14,15,16]];
    expectedValues.forEach((values, index) => {
        expect(mycelium.openEnds[index].overlapDirections()).toEqual(values);
    });
    //added openEnd test below that has an odd rather than even dirn
    const oddOpenEnd = new OpenEnd(10,10,3);
    expect(oddOpenEnd.overlapDirections()).toEqual([2,3,4,5,6,7,8]);
});

test('isOpenEnd returns true if open end', () => {
    const gameState = mocks.createMockGameState([mocks.createMockMycelium()]);
    mocks.populateMockScreen(gameState);
    const screen = gameState.screen;
    const falseOpenEnds = [
        new OpenEnd(250,148,0),
        new OpenEnd(251,144,0),
        new OpenEnd(253,142,0),
        new OpenEnd(256,154,8),
        new OpenEnd(245,149,4)];
    const trueOpenEnds = [
        new OpenEnd(252,140,15),
        new OpenEnd(242,152,11),
        new OpenEnd(258,154,4),
        new OpenEnd(256,158,7)];
    trueOpenEnds.forEach(openEnd => {
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
    const mycelium = mocks.createMockMycelium();
    const gd = mycelium.openEnds[2].growthDirections(mycelium.growthDirProb);
    expect(gd[0]).toBeGreaterThanOrEqual(2);
    expect(gd[0]).toBeLessThanOrEqual(6);
    expect(gd[1]).toBeGreaterThanOrEqual(2);
    expect(gd[1]).toBeLessThanOrEqual(6);
});

test('grow on OpenEnd increases mycelial size as expected', () => {
    const gameState = mocks.createMockGameState([mocks.createMockMycelium()]);
    mocks.populateMockScreen(gameState);
    const screen = gameState.screen;
    const mycelium = gameState.mycelia[0];
    mycelium.openEnds = [
        new OpenEnd(252,140,15),
        new OpenEnd(242,152,11),
        new OpenEnd(258,154,4),
        new OpenEnd(256,158,7)];
    const newOpenEnds = [];
    const initMycCount = mycCount(screen);

    mycelium.openEnds[0].grow(mycelium, screen, newOpenEnds, [15, 13]);
    expect(mycCount(screen)).toEqual(initMycCount + 2);
    expect(screen[251][138].mycelium).toEqual(mycelium.name);
    expect(screen[250][139].mycelium).toEqual(mycelium.name);
    expect(newOpenEnds.length).toEqual(2);
    expect(newOpenEnds[0].xposn).toEqual(251);
    expect(newOpenEnds[0].yposn).toEqual(138);
    expect(newOpenEnds[0].dirn).toEqual(15);
    expect(newOpenEnds[1].xposn).toEqual(250);
    expect(newOpenEnds[1].yposn).toEqual(139);
    expect(newOpenEnds[1].dirn).toEqual(13);
});

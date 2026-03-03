import {Mycelium} from "../mycelium.js";
import {OpenEnd} from "../openEnd.js";
import * as model from '../model4.js';
import * as mocks from './mocks.js';

test('Mycelium constructor', () => {
    const mycelium = mocks.createMockMycelium();
    expect(mycelium.name).toBe("primary");
    expect(mycelium.canvas.tagName).toBe("CANVAS");
    expect(mycelium.ctx).toBeInstanceOf(CanvasRenderingContext2D);
    expect(mycelium.growthTypeProb).toEqual(mocks.createMockGrowthTypeProb());
    expect(mycelium.growthDirProb).toEqual(mocks.createMockGrowthDirProb());
    expect(mycelium.change.bent).toBe(0);
    expect(mycelium.colour).toBe("red");
    expect(mycelium.openEnds[0].xposn).toEqual(250);
    expect(mycelium.startPosn.xposn).toEqual(250);
});

test('Validation of canvas on Mycelium', () => {
    const canvas = document.createElement('canvas');
    const badCanvases = [
        "string",
        10,
        [1, 2, 3],
        {something: "anything"}];
    const mycelium = mocks.createMockMycelium(); 
    badCanvases.forEach(badCanvas => {
        expect(() => {mycelium.canvas = badCanvas}).toThrow(new Error('Invalid canvas on Mycelium'));
    });
    expect(() => {new Mycelium(
        "primary",
        "string",
        mocks.createMockGrowthTypeProb(), 
        mocks.createMockGrowthDirProb(), 
        "red", 
        {xposn: 250, yposn: 150},
        [3])}).toThrow(new Error('Invalid canvas on Mycelium'));
});

test('Validation of growthTypeProb on Mycelium', () => {
    const canvas = document.createElement('canvas');
    const badGtps = [
        {bigger: 1, split: 1},
        {bigger: 1, split: 1, xxx: 1},
        {bigger: 1, xxx: 1, nothing: 1},
        {xxx: 1, split: 1, nothing: 1},
        {bigger: "a", split: 1, nothing: 1},
        {bigger: 1, split: "a", nothing: 1},
        {bigger: 1, split: 1, nothing: "a"},
        {bigger: 0, split: 0, nothing: 0}];
    const mycelium = mocks.createMockMycelium(); 
    badGtps.forEach(badGtp => {
        expect(() => {mycelium.growthTypeProb = badGtp}).toThrow(new Error('Invalid growthTypeProb'));
    });
    expect(() => {new Mycelium(
        "primary",
        canvas,
        badGtps[1], 
        mocks.createMockGrowthDirProb(), 
        "red", 
        {xposn: 250, yposn: 150},
        [3])}).toThrow(new Error('Invalid growthTypeProb'));
});

test('Validation of growthDirProb on Mycelium', () => {
    const canvas = document.createElement('canvas');
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
    const mycelium = mocks.createMockMycelium(); 
    badGdps.forEach(badGdp => {
        expect(() => {mycelium.growthDirProb = badGdp}).toThrow(new Error('Invalid growthDirProb'));
    });
    expect(() => {new Mycelium(
        "primary",
        canvas,
        mocks.createMockGrowthTypeProb(), 
        badGdps[1], 
        "red", 
        {xposn: 250, yposn: 150},
        [3])}).toThrow(new Error('Invalid growthDirProb'));
});

test('Validation of change on Mycelium', () => {
    const badChanges = [
        {"bent": 6, "split": 0, "speed": 0},
        {"bent": -6, "split": 0, "speed": 0},
        {"bent": 0, "split": 6, "speed": 0},
        {"bent": 0, "split": -6, "speed": 0},
        {"bent": 0, "split": 0, "speed": 6},
        {"bent": 0, "split": 0, "speed": -6},
        {"anything": 0, "split": 0, "speed": 6},
        {"bent": 0, "anything": 0, "speed": 0},
        {"bent": 0, "split": 0, "anything": 0}]
    const mycelium = mocks.createMockMycelium(); 
    badChanges.forEach(badChange => {
        expect(() => {mycelium.change = badChange}).toThrow(new Error('Invalid change on Mycelium'));
    });
});

test ('Validation of startPosn on Mycelium', () => {
    const canvas = document.createElement('canvas');
    const badStartPosns = [
        "string",
        10,
        [1, 2, 3],
        {something: "anything"},
        {xposn: "string", yposn: 6},
        {xposn: 6, yposn: 0},
        {xposn: 6, yposn: "string"}];
    const mycelium = mocks.createMockMycelium(); 
    badStartPosns.forEach(badStartPosn => {
        expect(() => {mycelium.startPosn = badStartPosn}).toThrow(new Error('Invalid startPosn on Mycelium'));
    });
    expect(() => {new Mycelium(
        "primary",
        canvas,
        mocks.createMockGrowthTypeProb(), 
        mocks.createMockGrowthDirProb(), 
        "red", 
        {xposn: "string", yposn: 150},
        [3])}).toThrow(new Error('Invalid startPosn on Mycelium'));
});

test('validation of openEnds on Mycelium', () => {
    const canvas = document.createElement('canvas');
    const mycelium = mocks.createMockMycelium();
    expect(() => {mycelium.openEnds = 250}).toThrow(new TypeError('Invalid openEnds'));
    expect(() => {mycelium.openEnds = [250, 150, 3]}).toThrow(new Error('Invalid openEnds'));
    expect(() => {mycelium.openEnds = [[250, 150, 3]]}).toThrow(new Error('Invalid openEnds'));
    expect(() => {new Mycelium(
        "primary",
        canvas,
        mocks.createMockGrowthTypeProb(), 
        mocks.createMockGrowthDirProb(), 
       "red", 
        {xposn: 250, yposn: 150},
        250)}).toThrow(new TypeError('Invalid openEndsDirns'));
    expect(() => {new Mycelium(
        "primary",
        canvas,
        mocks.createMockGrowthTypeProb(), 
        mocks.createMockGrowthDirProb(), 
       "red", 
        {xposn: 250, yposn: 150},
        [2, 3])}).toThrow(new Error('Invalid openEndsDirns'));
    expect(() => {new Mycelium(
        "primary",
        canvas,
        mocks.createMockGrowthTypeProb(), 
        mocks.createMockGrowthDirProb(), 
       "red", 
        {xposn: 250, yposn: 150},
        [2, 30])}).toThrow(new Error('Invalid openEndsDirns'));
});

test('bigEnough returns true if reached edge of screen', () => {
    const mycelium = mocks.createMockMycelium();
    expect(mycelium.bigEnough()).toBe(false);
    const edges = [
        new OpenEnd(2,150,1),
        new OpenEnd(1198,150,1),
        new OpenEnd(250,2,1),
        new OpenEnd(250,698,1)]
    edges.forEach(edge => {
        mycelium.openEnds.pop();
        mycelium.openEnds.push(edge);
        expect(mycelium.bigEnough()).toBe(true);
    });
});

test('growAllOpenEnds on Mycelium populates new OpenEnds', () => {
    const gameState = mocks.createMockGameState([mocks.createMockMycelium()]);
    gameState.drawStartingMycelia();
    const screen = gameState.screen;
    const mycelium = gameState.mycelia[0];
    mycelium.growthTypeProb = {bigger: 40, split: 0, nothing: 0};
    mycelium.growthDirProb = {"0": 0, "1": 0, "2": 120, "3": 0, "4": 0};
    mycelium.growAllOpenEnds(screen);
    const expectedNewOpenEnds = [
        new OpenEnd(250,146,0),
        new OpenEnd(254,146,2),
        new OpenEnd(254,150,4),
        new OpenEnd(250,154,8)];
    for (let i=0; i < mycelium.openEnds.length; i++) {
        let openEnd = mycelium.openEnds[i];
        let keys = openEnd.getPrivatePropertyNames();
        keys.forEach(key => {
            expect(openEnd[key]).toEqual(expectedNewOpenEnds[i][key]);
        });
    }
});

test('lessBent changes growthDirProb', () => {
    const mycelium = mocks.createMockMycelium();
    mycelium.lessBent();
    expect(mycelium.growthDirProb["2"]).toBe(156);
    expect(mycelium.change.bent).toBe(-1);
    mycelium.change.bent = -5;
    mycelium.lessBent();
    expect(mycelium.growthDirProb["2"]).toBe(156);
});

test('moreBent changes growthDirProb', () => {
    const mycelium = mocks.createMockMycelium();
    mycelium.moreBent();
    expect(mycelium.growthDirProb["2"]).toBe(92);
    expect(mycelium.change.bent).toBe(1);
    mycelium.change.bent = 5;
    mycelium.moreBent();
    expect(mycelium.growthDirProb["2"]).toBe(92);
});

test('lessSplit changes growthTypeProb', () => {
    const mycelium = mocks.createMockMycelium();
    mycelium.lessSplit();
    expect(mycelium.growthTypeProb.split).toBe(15);
    expect(mycelium.change.split).toBe(-1);
    mycelium.change.split = -5
    mycelium.lessSplit();
    expect(mycelium.growthTypeProb.split).toBe(15);
});

test('moreSplit changes growthTypeProb', () => {
    const mycelium = mocks.createMockMycelium();
    mycelium.moreSplit();
    expect(mycelium.growthTypeProb.split).toBe(26);
    expect(mycelium.change.split).toBe(1);
    mycelium.change.split = 5
    mycelium.moreSplit();
    expect(mycelium.growthTypeProb.split).toBe(26);
});

test('fasterGrowth changes growthTypeProb', () => {
    const mycelium = mocks.createMockMycelium();
    mycelium.fasterGrowth();
    expect(mycelium.growthTypeProb.nothing).toBe(307);
    expect(mycelium.change.speed).toBe(1);
    mycelium.change.speed = 5
    mycelium.fasterGrowth();
    expect(mycelium.growthTypeProb.nothing).toBe(307);
});

test('slowerGrowth changes growthTypeProb', () => {
    const mycelium = mocks.createMockMycelium();
    mycelium.slowerGrowth();
    expect(mycelium.growthTypeProb.nothing).toBe(520);
    expect(mycelium.change.speed).toBe(-1);
    mycelium.change.speed = -5
    mycelium.slowerGrowth();
    expect(mycelium.growthTypeProb.nothing).toBe(520);
});

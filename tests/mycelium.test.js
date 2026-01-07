import {Mycelium} from "../mycelium.js";
import {OpenEnds} from "../openEnds.js";
import {OpenEnd} from "../openEnd.js";
import * as model from '../model4.js';
import * as mocks from './mocks.js';

test('Mycelium constructor', () => {
    const mycelium = mocks.createMockMycelium();
    expect(mycelium.name).toBe("primary");
    expect(mycelium.canvas.tagName).toBe("CANVAS");
    expect(mycelium.ctx).toBeInstanceOf(CanvasRenderingContext2D);
    expect(mycelium.growthTypeProb).toEqual(model.createGrowthTypeProb());
    expect(mycelium.growthDirProb).toEqual(model.createGrowthDirProb());
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
        expect(() => {mycelium.canvas = badCanvas}).toThrow('Invalid canvas on Mycelium');
    });
    expect(() => {new Mycelium(
        "primary",
        "string",
        model.createGrowthTypeProb(), 
        model.createGrowthDirProb(), 
        "red", 
        {xposn: 250, yposn: 150},
        [3])}).toThrow('Invalid canvas on Mycelium');
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
        expect(() => {mycelium.growthTypeProb = badGtp}).toThrow('Invalid growthTypeProb');
    });
    expect(() => {new Mycelium(
        "primary",
        canvas,
        badGtps[1], 
        model.createGrowthDirProb(), 
        "red", 
        {xposn: 250, yposn: 150},
        [3])}).toThrow('Invalid growthTypeProb');
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
        expect(() => {mycelium.growthDirProb = badGdp}).toThrow('Invalid growthDirProb');
    });
    expect(() => {new Mycelium(
        "primary",
        canvas,
        model.createGrowthTypeProb(), 
        badGdps[1], 
        "red", 
        {xposn: 250, yposn: 150},
        [3])}).toThrow('Invalid growthDirProb');
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
        expect(() => {mycelium.startPosn = badStartPosn}).toThrow('Invalid startPosn on Mycelium');
    });
    expect(() => {new Mycelium(
        "primary",
        canvas,
        model.createGrowthTypeProb(), 
        model.createGrowthDirProb(), 
        "red", 
        {xposn: "string", yposn: 150},
        [3])}).toThrow('Invalid startPosn on Mycelium');
});

test('validation of openEnds', () => {
    const canvas = document.createElement('canvas');
    const mycelium = mocks.createMockMycelium();
    expect(() => {mycelium.openEnds = 250}).toThrow('Invalid openEnds');
    expect(() => {mycelium.openEnds = [250, 150, 3]}).toThrow('Invalid openEnds');
    expect(() => {new Mycelium(
        "primary",
        canvas,
        model.createGrowthTypeProb(), 
        model.createGrowthDirProb(), 
       "red", 
        {xposn: 250, yposn: 150},
        250)}).toThrow('Invalid openEndsDirns');
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
    const screen = mocks.createMockScreen();
    const mycelium = mocks.createMockMycelium();
    mycelium.growthTypeProb = {bigger: 40, split: 0, nothing: 0};
    mycelium.growthDirProb = {"0": 0, "1": 0, "2": 120, "3": 0, "4": 0};
    mycelium.growAllOpenEnds(screen);
    const expectedNewOpenEnds = new OpenEnds(
        new OpenEnd(251,138,15),
        new OpenEnd(240,153,11),
        new OpenEnd(260,154,4),
        new OpenEnd(257,160,7));
    for (let i=0; i < mycelium.openEnds.length; i++) {
        expect(mycelium.openEnds[i]).toEqual(expectedNewOpenEnds[i]);
    }
});


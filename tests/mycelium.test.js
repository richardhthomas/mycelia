import {Mycelium} from "../mycelium.js";
import {OpenEnd} from "../openEnd.js";
import * as model from '../model4.js';
import * as mocks from './mocks.js';

test('Mycelium constructor', () => {
    const mycelium = mocks.createMockMycelium();
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
    const mycelium = mocks.createMockMycelium(); 
    badGtps.forEach(badGtp => {
        expect(() => {mycelium.growthTypeProb = badGtp}).toThrow('Invalid growthTypeProb');
    });
    expect(() => {new Mycelium(
        badGtps[1], 
        model.createGrowthDirProb(), 
        "red", 
        [mocks.createMockOpenEnd()])}).toThrow('Invalid growthTypeProb');
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
    const mycelium = mocks.createMockMycelium(); 
    badGdps.forEach(badGdp => {
        expect(() => {mycelium.growthDirProb = badGdp}).toThrow('Invalid growthDirProb');
    });
    expect(() => {new Mycelium(
        model.createGrowthTypeProb(), 
        badGdps[1], 
        "red", 
        [mocks.createMockOpenEnd()])}).toThrow('Invalid growthDirProb');
});

test('validation of openEnds', () => {
    const mycelium = mocks.createMockMycelium();
    expect(() => {mycelium.openEnds = 250}).toThrow('Invalid openEnds');
    expect(() => {mycelium.openEnds = [250, 150, 3]}).toThrow('Invalid openEnds');
    expect(() => {new Mycelium(
        model.createGrowthTypeProb(), 
        model.createGrowthDirProb(), 
       "red", 
        250)}).toThrow('Invalid openEnds');
});

test('bigEnough returns true if reached edge of screen', () => {
    const mycelium = mocks.createMockMycelium();
    expect(mycelium.bigEnough()).toBe(false);
    const edges = [
        new OpenEnd(2,150,1),
        new OpenEnd(1998,150,1),
        new OpenEnd(250,2,1),
        new OpenEnd(250,1998,1)]
    edges.forEach(edge => {
        mycelium.openEnds.pop();
        mycelium.openEnds.push(edge);
        expect(mycelium.bigEnough()).toBe(true);
    });
});

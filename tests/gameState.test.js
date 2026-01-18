import {GameState} from "../gameState.js";
import {OpenEnd} from "../openEnd.js";
import * as model from '../model4.js';
import * as mocks from './mocks.js';

test('GameState constructor', () => {
    const gameState = mocks.createMockGameState();
    mocks.populateMockScreen(gameState);
    expect(gameState.mycelia[0].name).toBe("primary");
    expect(gameState.screen[250][150].mycelium).toBe("primary");
    expect(gameState.delay).toEqual(100);
    expect(gameState.dragover).toBeUndefined();
    expect(gameState.backgroundCanvas.tagName).toBe("CANVAS");
    expect(gameState.backgroundCtx).toBeInstanceOf(CanvasRenderingContext2D);
});

test('Validation of mycelia on GameState', () => {
    const canvas = document.createElement('canvas');
    const badMycelias = [
        "string",
        1234,
        [1, 2, 3],
        {something: "anything"},
        [{something: "anything"}]];
    const gameState = mocks.createMockGameState();
    badMycelias.forEach(badMycelia => {
        expect(() => {gameState.mycelia = badMycelia}).toThrow('Invalid mycelia on GameState');
    });
    expect(() => {new GameState(
        badMycelias[4],
        100,
        undefined,
        canvas)}).toThrow('Invalid mycelia on GameState');
});

test('Validation of screen on GameState', () => {
    const canvas = document.createElement('canvas');
    let gameState = mocks.createMockGameState();
    expect(() => {gameState.screen[10][10] = {something: "anything"}}).toThrow('Invalid screen on GameState');
    expect(() => {gameState.screen[10][10] = {mycelium: 12}}).toThrow('Invalid screen on GameState');
    expect(() => {gameState.screen[10][10] = 1234}).toThrow('Invalid screen on GameState');
});

test('Validation of delay on GameState', () => {
    const canvas = document.createElement('canvas');
    const badDelays = [
        "string",
        -10,
        0,
        [1, 2, 3],
        {something: "anything"}];
    const gameState = mocks.createMockGameState();
    badDelays.forEach(badDelay => {
        expect(() => {gameState.delay = badDelay}).toThrow('Invalid delay on GameState');
    });
    expect(() => {new GameState(
        [mocks.createMockMycelium()],
        badDelays[2],
        undefined,
        canvas)}).toThrow('Invalid delay on GameState');
});

test ('Validation of dragOver on GameState', () => {
    const canvas = document.createElement('canvas');
    const badDragOvers = [
        10,
        [1, 2, 3],
        {something: "anything"}];
    const gameState = mocks.createMockGameState();
    badDragOvers.forEach(badDragOver=> {
        expect(() => {gameState.dragOver = badDragOver}).toThrow('Invalid dragOver on GameState');
    });
    expect(() => {new GameState(
        [mocks.createMockMycelium()],
        100,
        badDragOvers[0],
        canvas)}).toThrow('Invalid dragOver on GameState');
});

test ('Validation of backgroundCanvas on GameState', () => {
    const badBackgroundCanvases = [
        "string",
        10,
        [1, 2, 3],
        {something: "anything"}];
    const gameState = mocks.createMockGameState();
    badBackgroundCanvases.forEach(badBackgroundCanvas => {
        expect(() => {gameState.backgroundCanvas = badBackgroundCanvas}).toThrow('Invalid backgroundCanvas on GameState');
    });
    expect(() => {new GameState(
        [mocks.createMockMycelium()],
        100,
        undefined,
        badBackgroundCanvases[3])}).toThrow('Invalid backgroundCanvas on GameState');
});

test ('findMyceliumByName returns mycelium object with given name', () => {
    const gameState = mocks.createMockGameState();
    const mycelium2 = mocks.createMockMycelium();
    const mycelium3 = mocks.createMockMycelium();
    mycelium2.name = 'secondary';
    mycelium3.name = 'tertiary';
    gameState.mycelia.push(mycelium2, mycelium3);
    expect(gameState.findMyceliumByName('secondary')).toEqual(mycelium2);
    expect(gameState.findMyceliumByName('anything')).toBeUndefined();
});

test ('setupStartingMycelia populates screen array', () => {
    const gameState = mocks.createMockGameState();
    gameState.setupStartingMycelia();
    let x = gameState.mycelia[0].startPosn.xposn;
    let y = gameState.mycelia[0].startPosn.yposn;
    expect(gameState.screen[x][y].mycelium).toBe("primary");
    gameState.mycelia[0].openEnds.forEach(openEnd => { 
        x = openEnd.xposn;
        y = openEnd.yposn;
        expect(gameState.screen[x][y].mycelium).toBe("primary");
    });
});
    
test('run on gameState creates new OpenEnds if not paused', () => {
    global.pause = true;
    const gameState = mocks.createMockGameState();
    gameState.setupStartingMycelia();
    const screen = gameState.screen;
    const mycelium = gameState.mycelia[0];
    mycelium.growthTypeProb = {bigger: 40, split: 0, nothing: 0};
    mycelium.growthDirProb = {"0": 0, "1": 0, "2": 120, "3": 0, "4": 0};
    gameState.run();
    let expectedFirstOpenEnd = new OpenEnd(250,148,0);
    expect(mycelium.openEnds[0].yposn).toEqual(expectedFirstOpenEnd.yposn);
    global.pause = false;
    setTimeout(() => {expect(mycelium.openEnds[0].yposn).toBeGreaterThan(expectedFirstOpenEnd.yposn);}, (gameState.delay * 2));
});

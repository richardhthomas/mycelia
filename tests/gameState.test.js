import {GameState} from "../gameState.js";
import * as model from '../model4.js';
import * as mocks from './mocks.js';

test('GameState constructor', () => {
    const gameState = mocks.createMockGameState();
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
        mocks.createMockScreen(),
        100,
        undefined,
        canvas)}).toThrow('Invalid mycelia on GameState');
});

test('Validation of screen on GameState', () => {
    const canvas = document.createElement('canvas');
    const screen = model.createScreen();
    screen[100][100] = {something: "anything"};
    const badScreens = [
        "string",
        1234,
        [1, 2, 3],
        {something: "anything"},
        screen];
    const gameState = mocks.createMockGameState();
    badScreens.forEach(badScreen=> {
        expect(() => {gameState.screen = badScreen}).toThrow('Invalid screen on GameState');
    });
    expect(() => {new GameState(
        [mocks.createMockMycelium()],
        badScreens[4],
        100,
        undefined,
        canvas)}).toThrow('Invalid screen on GameState');
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
        mocks.createMockScreen(),
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
        mocks.createMockScreen(),
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
        mocks.createMockScreen(),
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
    gameState.screen = model.createScreen(); 
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
    


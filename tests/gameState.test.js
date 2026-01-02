import {GameState} from "../gameState.js";
import * as model from '../model4.js';
import * as mocks from './mocks.js';

test('GameState constructor', () => {
    const gameState = mocks.createMockGameState();
    expect(gameState.mycelia[0].name).toBe("primary");
    expect(gameState.screen[250][150].mycelium).toBe("primary");
    expect(gameState.delay).toEqual(100);
    expect(gameState.dragover).toBeUndefined();
    expect(gameState.background.canvas.tagName).toBe("CANVAS");
    expect(gameState.background.ctx).toBeInstanceOf(CanvasRenderingContext2D);
});

test('Validation of mycelia on GameState', () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
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
        {canvas: canvas, ctx: ctx})}).toThrow('Invalid mycelia on GameState');
});

test('Validation of screen on GameState', () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
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
        {canvas: canvas, ctx: ctx})}).toThrow('Invalid screen on GameState');
});

test('Validation of delay on GameState', () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
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
        {canvas: canvas, ctx: ctx})}).toThrow('Invalid delay on GameState');
});

test ('Validation of dragOver on GameState', () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
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
        {canvas: canvas, ctx: ctx})}).toThrow('Invalid dragOver on GameState');
});

test ('Validation of background on GameState', () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const badBackgrounds = [
        "string",
        10,
        [1, 2, 3],
        {something: "anything"},
        {canvas: "string", ctx: 6}];
    const gameState = mocks.createMockGameState();
    badBackgrounds.forEach(badBackground=> {
        expect(() => {gameState.background = badBackground}).toThrow('Invalid background on GameState');
    });
    expect(() => {new GameState(
        [mocks.createMockMycelium()],
        mocks.createMockScreen(),
        100,
        undefined,
        badBackgrounds[4])}).toThrow('Invalid background on GameState');
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


import {Mycelium} from "./mycelium.js";
import {OpenEnds} from "./openEnds.js";
import {OpenEnd} from "./openEnd.js";
import {probResult} from "./utils.js";
import {pointerScroll, createButtons, buttons} from "./ui.js";


// screen array contains the state of mycelia (0 or 1) at each x,y position.
function createScreen() {
    const result = [];
    for (let i = 0; i < 2000; i++) {
        result[i] = [];
    };
    return result;
}

function setupScreen(screen, mycelia) {
    screen[1000][1000] = {mycelium: "primary"};
    screen[300][300] = {mycelium: "secondary"};
    //***line above needs to be generalised
    mycelia.forEach(mycelium => {
        mycelium.openEnds.forEach(openEnd => {
            screen[openEnd.xposn][openEnd.yposn] = {mycelium: mycelium.name};
        });
    });
}

function createOpenEnds1() {
    let data = [[1000, 998, 0],
        [1002, 998, 2],
        [1002, 1000, 4],
        [1002, 1002, 6],
        [1000, 1002, 8],
        [998, 1002, 10],
        [998, 1000, 12],
        [998, 998, 14]];
    let openEnds = new OpenEnds();
    data.forEach(openEnd => {
        openEnds.push(new OpenEnd(openEnd[0], openEnd[1], openEnd[2]));
    });
    return openEnds;
}

function createOpenEnds2() {
    let data = [
        [302, 302, 6],
        [300, 302, 8]];
    let openEnds = new OpenEnds();
    data.forEach(openEnd => {
        openEnds.push(new OpenEnd(openEnd[0], openEnd[1], openEnd[2]));
    });
    return openEnds;
}

// defines probabilities of growing bigger or splitting (vs doing nothing)
function createGrowthTypeProb() {
    return {bigger: 40, split: 20, nothing: 50};
}

// defines probabilities of growing 2 deviations or 1 deviation from straight ahead
function createGrowthDirProb() {
    return {"0": 5, "1": 12, "2": 120, "3": 12, "4": 5};
}

function createGame() {
    let mycelium1 = new Mycelium(
        "primary",
        createGrowthTypeProb(),
        createGrowthDirProb(),
        "red",
        createOpenEnds1());
    let mycelium2 = new Mycelium(
        "secondary",
        createGrowthTypeProb(),
        createGrowthDirProb(),
        "blue",
        createOpenEnds2());
	let mycelia = [ mycelium1, mycelium2 ];
    const screen = createScreen(); 
    setupScreen(screen, mycelia);
    const delay = 100;
    const canvas = document.getElementById("play-area-canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 4000;
    canvas.height = 4000;


    // Create gradient
    ctx.globalCompositeOperation = "multiply";
    const grad=ctx.createRadialGradient(500,500,40,500,500,3500);
    grad.addColorStop(0,"red");
    grad.addColorStop(0.03,"#ff9999");
    grad.addColorStop(1,"white");
    ctx.fillStyle = grad;
    ctx.fillRect(0,0,4000,4000);
    
    const grad2=ctx.createRadialGradient(2000,1000,40,2000,1000,3500);
    grad2.addColorStop(0,"#0000ff");
    grad2.addColorStop(0.03,"#9999ff");
    grad2.addColorStop(1,"white");
    ctx.fillStyle = grad2;
    ctx.fillRect(0,0,4000,4000);


    // draw starting mycelia
    ctx.globalCompositeOperation = "source-over";
    //mycelia1
    ctx.fillStyle = "red";
    ctx.fillRect(2000, 2000, 4, 4);
    mycelium1.openEnds.forEach(openEnd => {
        openEnd.drawMyc(mycelium1, ctx);
    });
    //mycelia2
    ctx.fillStyle = "blue";
    ctx.fillRect(600, 600, 4, 4);
    mycelium2.openEnds.forEach(openEnd => {
        openEnd.drawMyc(mycelium2, ctx);
    });

    return {
        "canvas": canvas,
        "ctx": ctx,
        "mycelia": mycelia,
        "screen": screen,
        "delay": delay}
}

function runMyc(gameState) {
    if (!pause) {
        gameState.mycelia.forEach(mycelium => {
            if (!mycelium.bigEnough()) {
                growAll(mycelium, gameState.screen, gameState.ctx, gameState.delay);
            }
        }); 
    }
    setTimeout(() => {runMyc(gameState);}, gameState.delay);
}

function growAll(mycelium, screen, ctx, delay) {
    let newOpenEnds = new OpenEnds();
    mycelium.openEnds.forEach(openEnd => {
        if (openEnd.isOpenEnd(screen)) {
            let action = probResult(mycelium.growthTypeProb);
            if (action == "nothing") {
                newOpenEnds.push(openEnd);
            } else {
                let directions = openEnd.growthDirections(mycelium.growthDirProb);
                if (action == "bigger") {directions.pop();}
                openEnd.grow(mycelium, screen, newOpenEnds, directions, ctx);
            }
        }
    });
    mycelium.openEnds = newOpenEnds;
}

function buttonAClick() {
    if (pause) {
        buttons.pause.drawPause();
        pause = false;
    } else {
        buttons.pause.drawPlay();
        pause = true;
    }
}

function dragstartHandler(ev) {
    ev.dataTransfer.setData("startOffsetX", ev.offsetX.toString());
    ev.dataTransfer.setData("startOffsetY", ev.offsetY.toString());
    ev.dataTransfer.setData("buttonId", ev.target.id);
}

function dragoverHandler(ev) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = "copy";
}

function dropHandler(ev, gameState) {
    ev.preventDefault();
    let offsetX = ev.offsetX - ev.dataTransfer.getData("startOffsetX");
    let offsetY = ev.offsetY - ev.dataTransfer.getData("startOffsetY");
    let buttonDropped = ev.dataTransfer.getData("buttonId");
    if (buttonDropped == "buttonB-canvas") {
        buttons.straight.draw(gameState.ctx, offsetX, offsetY);
        gameState.mycelium.growthDirProb = {"0": 1, "1": 1, "2": 200, "3": 1, "4": 1};
        gameState.mycelium.growthTypeProb = {bigger: 40, split: 1, nothing: 50};
    } else if (buttonDropped == "buttonC-canvas") {
        buttons.bent.draw(gameState.ctx, offsetX, offsetY);
        gameState.mycelium.growthDirProb = {"0": 10, "1": 20, "2": 50, "3": 20, "4": 10};
        gameState.mycelium.growthTypeProb = {bigger: 40, split: 20, nothing: 50};
    }
}


let pause = false;

window.onload = function() {
    var gameState = createGame(); 
    createButtons();
    buttons.pause.canvas.addEventListener("pointerdown", buttonAClick);
    buttons.straight.canvas.addEventListener("dragstart", dragstartHandler);
    buttons.bent.canvas.addEventListener("dragstart", dragstartHandler);
    let playArea = document.getElementById("play-area");
    playArea.addEventListener("dragover", dragoverHandler);
    playArea.addEventListener("drop", (ev) => { dropHandler(ev, gameState) });
    pointerScroll(document.getElementById('play-area'));
    runMyc(gameState);
};

export { createScreen, createOpenEnds1, setupScreen, createGrowthTypeProb, createGrowthDirProb };

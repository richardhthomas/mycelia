import {Mycelium} from "./mycelium.js";
import {OpenEnd} from "./openEnd.js";
import {GameState} from "./gameState.js";
import {probResult, hoveroverDetection} from "./utils.js";
import {pointerScroll, createButtons, buttons} from "./ui.js";

function drawPlayAreaBackground(canvas, ctx) {
    canvas.width = 2400;
    canvas.height = 1400;
    // Create gradient
    ctx.globalCompositeOperation = "multiply";
    const grad = ctx.createRadialGradient(250,250,20,250,250,1000);
    grad.addColorStop(0,"red");
    grad.addColorStop(0.03,"#ff9999");
    grad.addColorStop(1,"white");
    ctx.fillStyle = grad;
    ctx.fillRect(0,0,2400,1400);
    
    const grad2 = ctx.createRadialGradient(1200,500,20,1200,500,1000);
    grad2.addColorStop(0,"#0000ff");
    grad2.addColorStop(0.03,"#9999ff");
    grad2.addColorStop(1,"white");
    ctx.fillStyle = grad2;
    ctx.fillRect(0,0,2400,1400);
}

function buttonAClick(ev, gameState) {
    if (gameState.pause) {
        buttons.pause.drawPause();
        gameState.pause = false;
    } else {
        buttons.pause.drawPlay();
        gameState.pause = true;
    }
}

function dragstartHandler(ev) {
    ev.dataTransfer.setData("buttonId", ev.target.id);
}

function dragoverHandler(ev, gameState) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = "copy";
    let xposn = Math.floor(ev.offsetX/2);
    let yposn = Math.floor(ev.offsetY/2);
    let content = hoveroverDetection(xposn, yposn, gameState.screen);
    if (content) {
        gameState.dragOver = content.mycelium;
        let canvas = gameState.findMyceliumByName(content.mycelium).canvas;
        canvas.style.opacity="0.5";
    } else {
        resetMyceliaOpacity(gameState);
        gameState.dragOver = undefined;
    }
}

function resetMyceliaOpacity(gameState) {
    for (let i=0; i<gameState.mycelia.length; i++) {
        let canvas = gameState.mycelia[i].canvas;
        canvas.style.opacity="1";
    }
}

function dragleaveHandler(ev, gameState) {
    ev.preventDefault();
    resetMyceliaOpacity(gameState);
    gameState.dragOver = undefined;
}

function dropHandler(ev, gameState) {
    ev.preventDefault();
    let buttonDropped = ev.dataTransfer.getData("buttonId");
    let mycelium = gameState.findMyceliumByName(gameState.dragOver);
    if (mycelium) {
        mycelium.canvas.style.opacity = "1";
        if (buttonDropped == "buttonB-canvas") {
            mycelium.lessBent(); 
        } else if (buttonDropped == "buttonC-canvas") {
            mycelium.moreBent();
        } else if (buttonDropped == "buttonD-canvas") {
            mycelium.lessSplit();
        } else if (buttonDropped == "buttonE-canvas") {
            mycelium.moreSplit();
        } else if (buttonDropped == "buttonF-canvas") {
            mycelium.fasterGrowth();
        } else if (buttonDropped == "buttonG-canvas") {
            mycelium.slowerGrowth();
        }
    }
}


window.onload = function() {
    let mycelium1 = new Mycelium(
        "primary",
        document.getElementById("play-areaB-canvas"),
        {bigger: 40, split: 20, nothing: 400},
        {"0": 5, "1": 12, "2": 120, "3": 12, "4": 5},
        "red",
        {xposn:600, yposn:350},
        [0,2,4,6,8,10,12,14]);
    let mycelium2 = new Mycelium(
        "secondary",
        document.getElementById("play-areaC-canvas"),
        {bigger: 40, split: 20, nothing: 400},
        {"0": 5, "1": 12, "2": 120, "3": 12, "4": 5},
        "blue",
        {xposn:300, yposn:174},
        [6,8]);
    var gameState = new GameState(
        [mycelium1, mycelium2],
        100,
        document.getElementById("play-areaA-canvas"));
    drawPlayAreaBackground(gameState.backgroundCanvas, gameState.backgroundCtx);
    gameState.setupStartingMycelia();

    createButtons();
    buttons.pause.canvas.addEventListener("pointerdown",(ev) => { buttonAClick(ev, gameState) });
    buttons.lessBent.canvas.addEventListener("dragstart", dragstartHandler);
    buttons.moreBent.canvas.addEventListener("dragstart", dragstartHandler);
    buttons.lessSplit.canvas.addEventListener("dragstart", dragstartHandler);
    buttons.moreSplit.canvas.addEventListener("dragstart", dragstartHandler);
    buttons.faster.canvas.addEventListener("dragstart", dragstartHandler);
    buttons.slower.canvas.addEventListener("dragstart", dragstartHandler);
    let playArea = document.getElementById("play-area");
    playArea.addEventListener("dragover",(ev) => { dragoverHandler(ev, gameState) });
    playArea.addEventListener("dragleave",(ev) => { dragleaveHandler(ev, gameState) });
    playArea.addEventListener("drop", (ev) => { dropHandler(ev, gameState) });
    pointerScroll(document.getElementById('play-area'));
    gameState.run();
};


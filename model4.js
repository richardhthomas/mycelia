import {Mycelium} from "./mycelium.js";
import {OpenEnds} from "./openEnds.js";
import {OpenEnd} from "./openEnd.js";
import {probResult} from "./utils.js";
//import * as canvasControl from "./canvas-control.js";

    const canvas = document.getElementById("play-area-canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 4000;
    canvas.height = 4000;

let cameraOffset = { x: window.innerWidth/2, y: window.innerHeight/2 };
let cameraZoom = 1;
let MAX_ZOOM = 5;
let MIN_ZOOM = 0.1;
let SCROLL_SENSITIVITY = 0.0005;

//function draw() {
//    // Translate to the canvas centre before zooming - so you'll always zoom on what you're looking directly at
//    ctx.translate( window.innerWidth / 2, window.innerHeight / 2 );
//    ctx.scale(cameraZoom, cameraZoom);
//    ctx.translate( -window.innerWidth / 2 + cameraOffset.x, -window.innerHeight / 2 + cameraOffset.y );
//    ctx.clearRect(0,0, window.innerWidth, window.innerHeight);
//    requestAnimationFrame( draw );
//}

// Gets the relevant location from a mouse or single touch event
function getEventLocation(e) {
    if (e.touches && e.touches.length == 1) {
        return { x:e.touches[0].clientX, y: e.touches[0].clientY };
    }
    else if (e.clientX && e.clientY) {
        return { x: e.clientX, y: e.clientY };
    }
}

let isDragging = false;
let dragStart = { x: 0, y: 0 };

function onPointerDown(e) {
    isDragging = true;
    dragStart.x = getEventLocation(e).x/cameraZoom - cameraOffset.x;
    dragStart.y = getEventLocation(e).y/cameraZoom - cameraOffset.y;
}

function onPointerUp(e) {
    isDragging = false;
    initialPinchDistance = null;
    lastZoom = cameraZoom;
}

function onPointerMove(e) {
    if (isDragging) {
        cameraOffset.x = getEventLocation(e).x/cameraZoom - dragStart.x;
        cameraOffset.y = getEventLocation(e).y/cameraZoom - dragStart.y;
    }
}

function handleTouch(e, singleTouchHandler) {
    if ( e.touches.length == 1 ) {
        singleTouchHandler(e);
    }
    else if (e.type == "touchmove" && e.touches.length == 2) {
        isDragging = false;
        handlePinch(e);
    }
}

let initialPinchDistance = null;
let lastZoom = cameraZoom;

function handlePinch(e) {
    e.preventDefault();
    
    let touch1 = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    let touch2 = { x: e.touches[1].clientX, y: e.touches[1].clientY };
    
    // This is distance squared, but no need for an expensive sqrt as it's only used in ratio
    let currentDistance = (touch1.x - touch2.x)**2 + (touch1.y - touch2.y)**2;
    
    if (initialPinchDistance == null) {
        initialPinchDistance = currentDistance;
    }
    else {
        adjustZoom( null, currentDistance/initialPinchDistance );
    }
}

function adjustZoom(zoomAmount, zoomFactor) {
    if (!isDragging) {
        if (zoomAmount) {
            cameraZoom += zoomAmount;
        }
        else if (zoomFactor) {
            console.log(zoomFactor);
            cameraZoom = zoomFactor*lastZoom;
        }
        
        cameraZoom = Math.min( cameraZoom, MAX_ZOOM );
        cameraZoom = Math.max( cameraZoom, MIN_ZOOM );
        
        console.log(zoomAmount);
    }
}

canvas.addEventListener('mousedown', onPointerDown);
canvas.addEventListener('touchstart', (e) => handleTouch(e, onPointerDown));
canvas.addEventListener('mouseup', onPointerUp);
canvas.addEventListener('touchend',  (e) => handleTouch(e, onPointerUp));
canvas.addEventListener('mousemove', onPointerMove);
canvas.addEventListener('touchmove', (e) => handleTouch(e, onPointerMove));
canvas.addEventListener( 'wheel', (e) => adjustZoom(e.deltaY*SCROLL_SENSITIVITY));


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
    //***line above needs to be generalised
    for (let [name, mycelium] of Object.entries(mycelia)) {
        mycelium.openEnds.forEach(openEnd => {
            screen[openEnd.xposn][openEnd.yposn] = {mycelium: name};
        });
    };
}

function createOpenEnds() {
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


// defines probabilities of growing bigger or splitting (vs doing nothing)
function createGrowthTypeProb() {
    return {bigger: 40, split: 20, nothing: 50};
}

// defines probabilities of growing 2 deviations or 1 deviation from straight ahead
function createGrowthDirProb() {
    return {"0": 5, "1": 12, "2": 120, "3": 12, "4": 5};
}

function runMyc() {
    let mycelium = new Mycelium(
        createGrowthTypeProb(),
        createGrowthDirProb(),
        "red",
        createOpenEnds());
	let mycelia = { primary: mycelium };
    const screen = createScreen(); 
    setupScreen(screen, mycelium);
    const delay = 100;


    // Create gradient
    ctx.globalCompositeOperation = "multiply";
    const grad=ctx.createRadialGradient(500,500,40,500,500,3500);
    grad.addColorStop(0,"red");
    grad.addColorStop(0.03,"#ff9999");
    grad.addColorStop(1,"white");
    ctx.fillStyle = grad;
    ctx.fillRect(10,10,3980,3980);
    
    const grad2=ctx.createRadialGradient(2000,1000,40,2000,1000,3500);
    grad2.addColorStop(0,"#0000ff");
    grad2.addColorStop(0.03,"#9999ff");
    grad2.addColorStop(1,"white");
    ctx.fillStyle = grad2;
    ctx.fillRect(10,10,3980,3980);

    // draw starting mycelia
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "red";
    ctx.fillRect(2000, 2000, 4, 4);
    mycelium.openEnds.forEach(openEnd => {
        openEnd.drawMyc(ctx);
    });

    //*** line below needs generalising to multiple mycelia
    growAll(mycelium, screen, ctx, delay);
}

function growAll(mycelium, screen, ctx, delay) {
    // Translate to the canvas centre before zooming - so you'll always zoom on what you're looking directly at
    //ctx.translate( window.innerWidth / 2, window.innerHeight / 2 );
    //ctx.scale(cameraZoom, cameraZoom);
    //ctx.translate( -window.innerWidth / 2 + cameraOffset.x, -window.innerHeight / 2 + cameraOffset.y );
    //ctx.clearRect(0,0, window.innerWidth, window.innerHeight);
    //requestAnimationFrame( draw );
    let newOpenEnds = new OpenEnds();
    mycelium.openEnds.forEach(openEnd => {
        if (openEnd.isOpenEnd(screen)) {
            let action = probResult(mycelium.growthTypeProb);
            if (action == "nothing") {
                newOpenEnds.push(openEnd);
            } else {
                let directions = openEnd.growthDirections(mycelium.growthDirProb);
                if (action == "bigger") {directions.pop();}
                openEnd.grow(screen, newOpenEnds, directions, ctx);
            }
        }
    });
    mycelium.openEnds = newOpenEnds;
    if (!mycelium.bigEnough()) {
        setTimeout(() => {growAll(mycelium, screen, ctx, delay);}, delay);
        //requestAnimationFrame( growAll);
    }
}

window.onload = function() {
    runMyc();
};

export { createScreen, createOpenEnds, setupScreen, createGrowthTypeProb, createGrowthDirProb };

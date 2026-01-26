function screenSizeAdjustment() {
    const availHeight = window.screen.availHeight;
    const availWidth = window.screen.availWidth;
    if (availHeight > 890 && availWidth > 900) {
        //return dimensions for #play-area, #controls etc
        //these are currently hard-coded in css for roughly 1080p screens
        //this availHeight is about right for detecting a screen of that size
        //allowing for some toolbars etc
        //further if statements can return dimensions for smaller screens
        //I think these should to be set prior to window.onload
        //see https://gomakethings.com/two-ways-to-set-an-elements-css-with-vanilla-javascript/
        //for injecting CSS - using the global style option would be best
    }
}

function pointerScroll(elem) {
    function dragStart(ev) {
        elem.setPointerCapture(ev.pointerId);
    }
  
    function dragEnd(ev) {
        elem.releasePointerCapture(ev.pointerId);
    }

    function drag(ev) {
        if (elem.hasPointerCapture(ev.pointerId) && ev.isPrimary) {
            elem.scrollLeft -= ev.movementX;
            elem.scrollTop -= ev.movementY;
        }
    }

    elem.addEventListener("pointerdown", dragStart);
    elem.addEventListener("pointerup", dragEnd);
    elem.addEventListener("pointermove", drag);
}

const buttons = {
    pause: {
        canvas: document.getElementById("buttonA-canvas"),
        get ctx() {return this.canvas.getContext("2d");},
        drawPause: drawPauseButton,
        drawPlay: drawPlayButton
    },
    straight: {
        div: document.getElementById("buttonB"),
        canvas: document.getElementById("buttonB-canvas"),
        get ctx() {return this.canvas.getContext("2d");},
        draw: drawStraightButton
    },
    bent: {
        div: document.getElementById("buttonC"),
        canvas: document.getElementById("buttonC-canvas"),
        get ctx() {return this.canvas.getContext("2d");},
        draw: drawBentButton
    },
    splitMore: {
        div: document.getElementById("buttonD"),
        canvas: document.getElementById("buttonD-canvas"),
        get ctx() {return this.canvas.getContext("2d");},
        draw: drawSplitMoreButton
    },
    splitLess: {
        div: document.getElementById("buttonE"),
        canvas: document.getElementById("buttonE-canvas"),
        get ctx() {return this.canvas.getContext("2d");},
        draw: drawSplitLessButton
    },
    faster: {
        div: document.getElementById("buttonF"),
        canvas: document.getElementById("buttonF-canvas"),
        get ctx() {return this.canvas.getContext("2d");},
        draw: drawFasterButton
    },
    slower: {
        div: document.getElementById("buttonG"),
        canvas: document.getElementById("buttonG-canvas"),
        get ctx() {return this.canvas.getContext("2d");},
        draw: drawSlowerButton
    }
};

function createButtons() {
    buttons.pause.canvas.width = 70;
    buttons.pause.canvas.height = 70;
    buttons.pause.ctx.globalCompositeOperation = "source-over";
    buttons.pause.drawPause(); 
    buttons.straight.canvas.width = 70;
    buttons.straight.canvas.height = 70;
    buttons.straight.draw(buttons.straight.ctx, 0, 0);
    buttons.bent.canvas.width = 70;
    buttons.bent.canvas.height = 70;
    buttons.bent.draw(buttons.bent.ctx, 0, 0);
    buttons.splitMore.canvas.width = 70;
    buttons.splitMore.canvas.height = 70;
    buttons.splitMore.draw(buttons.splitMore.ctx, 0, 0);
    buttons.splitLess.canvas.width = 70;
    buttons.splitLess.canvas.height = 70;
    buttons.splitLess.draw(buttons.splitLess.ctx, 0, 0);
    buttons.faster.canvas.width = 70;
    buttons.faster.canvas.height = 70;
    buttons.faster.draw(buttons.faster.ctx, 0, 0);
    buttons.slower.canvas.width = 70;
    buttons.slower.canvas.height = 70;
    buttons.slower.draw(buttons.slower.ctx, 0, 0);
}

function drawPauseButton() {
    buttons.pause.ctx.clearRect(0, 0, 70, 70);
    buttons.pause.ctx.fillStyle = "black";
    buttons.pause.ctx.fillRect(20, 20, 10, 30);
    buttons.pause.ctx.fillRect(40, 20, 10, 30);
}

function drawPlayButton() {
    buttons.pause.ctx.clearRect(0, 0, 70, 70);
    buttons.pause.ctx.fillStyle = "black";
    buttons.pause.ctx.beginPath();
    buttons.pause.ctx.moveTo(20, 20);
    buttons.pause.ctx.lineTo(20, 50);
    buttons.pause.ctx.lineTo(50, 35);
    buttons.pause.ctx.lineTo(20, 20);
    buttons.pause.ctx.fill();
}

function drawStraightButton(ctx, xposn, yposn) {
//    ctx.clearRect(xposn, yposn, 70, 70);
    ctx.fillStyle = "black";
    ctx.fillRect(xposn+28, yposn+17, 4, 4);
    ctx.fillRect(xposn+26, yposn+21, 4, 4);
    ctx.fillRect(xposn+22, yposn+25, 4, 4);
    ctx.fillRect(xposn+20, yposn+29, 4, 4);
    ctx.fillRect(xposn+22, yposn+33, 4, 4);
    ctx.fillRect(xposn+26, yposn+37, 4, 4);
    ctx.fillRect(xposn+28, yposn+41, 4, 4);
    ctx.fillRect(xposn+26, yposn+45, 4, 4);
    ctx.fillRect(xposn+24, yposn+49, 4, 4);
    ctx.fillRect(xposn+40, yposn+17, 4, 24);
    ctx.beginPath();
    ctx.moveTo(xposn+34, yposn+41);
    ctx.lineTo(xposn+50, yposn+41);
    ctx.lineTo(xposn+42, yposn+53);
    ctx.lineTo(xposn+34, yposn+41);
    ctx.fill();
}

function drawBentButton(ctx, xposn, yposn) {
//    ctx.clearRect(xposn, yposn, 70, 70);
    ctx.fillStyle = "black";
    ctx.fillRect(xposn+28, yposn+17, 4, 4);
    ctx.fillRect(xposn+26, yposn+21, 4, 4);
    ctx.fillRect(xposn+22, yposn+25, 4, 4);
    ctx.fillRect(xposn+20, yposn+29, 4, 4);
    ctx.fillRect(xposn+22, yposn+33, 4, 4);
    ctx.fillRect(xposn+26, yposn+37, 4, 4);
    ctx.fillRect(xposn+28, yposn+41, 4, 4);
    ctx.fillRect(xposn+26, yposn+45, 4, 4);
    ctx.fillRect(xposn+24, yposn+49, 4, 4);
    ctx.fillRect(xposn+40, yposn+29, 4, 24);
    ctx.beginPath();
    ctx.moveTo(xposn+34, yposn+29);
    ctx.lineTo(xposn+50, yposn+29);
    ctx.lineTo(xposn+42, yposn+17);
    ctx.lineTo(xposn+34, yposn+29);
    ctx.fill();
}

function drawSplitMoreButton(ctx, xposn, yposn) {
//    ctx.clearRect(xposn, yposn, 70, 70);
    ctx.fillStyle = "black";
    ctx.fillRect(xposn+18, yposn+17, 4, 4);
    ctx.fillRect(xposn+20, yposn+21, 4, 4);
    ctx.fillRect(xposn+22, yposn+25, 4, 4);
    ctx.fillRect(xposn+30, yposn+17, 4, 4);
    ctx.fillRect(xposn+26, yposn+21, 4, 4);
    ctx.fillRect(xposn+24, yposn+29, 4, 24);
    ctx.fillRect(xposn+40, yposn+29, 4, 24);
    ctx.beginPath();
    ctx.moveTo(xposn+34, yposn+29);
    ctx.lineTo(xposn+50, yposn+29);
    ctx.lineTo(xposn+42, yposn+17);
    ctx.lineTo(xposn+34, yposn+29);
    ctx.fill();
}

function drawSplitLessButton(ctx, xposn, yposn) {
//    ctx.clearRect(xposn, yposn, 70, 70);
    ctx.fillStyle = "black";
    ctx.fillRect(xposn+18, yposn+17, 4, 4);
    ctx.fillRect(xposn+20, yposn+21, 4, 4);
    ctx.fillRect(xposn+22, yposn+25, 4, 4);
    ctx.fillRect(xposn+30, yposn+17, 4, 4);
    ctx.fillRect(xposn+26, yposn+21, 4, 4);
    ctx.fillRect(xposn+24, yposn+29, 4, 24);
    ctx.fillRect(xposn+40, yposn+17, 4, 24);
    ctx.beginPath();
    ctx.moveTo(xposn+34, yposn+41);
    ctx.lineTo(xposn+50, yposn+41);
    ctx.lineTo(xposn+42, yposn+53);
    ctx.lineTo(xposn+34, yposn+41);
    ctx.fill();
}

function drawFasterButton(ctx, xposn, yposn) {
//    ctx.clearRect(xposn, yposn, 70, 70);
    ctx.fillStyle = "black";
    ctx.fillRect(xposn+34, yposn+17, 4, 4);
    ctx.fillRect(xposn+26, yposn+19, 4, 4);
    ctx.fillRect(xposn+36, yposn+21, 4, 4);
    ctx.fillRect(xposn+30, yposn+23, 4, 4);
    ctx.fillRect(xposn+34, yposn+25, 6, 4);
    ctx.fillRect(xposn+22, yposn+27, 4, 2);
    ctx.fillRect(xposn+40, yposn+27, 4, 2);
    ctx.fillRect(xposn+18, yposn+29, 14, 4);
    ctx.fillRect(xposn+36, yposn+29, 10, 4);
    ctx.fillRect(xposn+32, yposn+31, 4, 2);
    ctx.fillRect(xposn+46, yposn+31, 2, 2);
    ctx.fillRect(xposn+16, yposn+33, 14, 4);
    ctx.fillRect(xposn+32, yposn+33, 4, 2);
    ctx.fillRect(xposn+36, yposn+33, 12, 4);
    ctx.fillRect(xposn+30, yposn+35, 2, 2);
    ctx.fillRect(xposn+18, yposn+37, 16, 4);
    ctx.fillRect(xposn+36, yposn+37, 4, 4);
    ctx.fillRect(xposn+40, yposn+37, 2, 2);
    ctx.fillRect(xposn+22, yposn+41, 12, 4);
    ctx.fillRect(xposn+36, yposn+41, 4, 2);
    ctx.fillRect(xposn+34, yposn+43, 2, 2);
    ctx.fillRect(xposn+32, yposn+45, 4, 2);
    ctx.fillRect(xposn+26, yposn+47, 4, 4);
    ctx.fillRect(xposn+32, yposn+47, 14, 4);
    ctx.fillRect(xposn+22, yposn+49, 4, 4);
}

function drawSlowerButton(ctx, xposn, yposn) {
//    ctx.clearRect(xposn, yposn, 70, 70);
    ctx.fillStyle = "black";
    ctx.fillRect(xposn+26, yposn+27, 12, 14);
    ctx.fillRect(xposn+24, yposn+29, 2, 10);
    ctx.fillRect(xposn+22, yposn+31, 2, 10);
    ctx.fillRect(xposn+20, yposn+33, 2, 8);
    ctx.fillRect(xposn+18, yposn+35, 2, 2);
    ctx.fillRect(xposn+18, yposn+39, 2, 4);
    ctx.fillRect(xposn+38, yposn+29, 4, 10);
    ctx.fillRect(xposn+40, yposn+39, 2, 4);
    ctx.fillRect(xposn+42, yposn+31, 2, 8);
    ctx.fillRect(xposn+42, yposn+41, 2, 2);
    ctx.fillRect(xposn+44, yposn+33, 2, 8);
    ctx.fillRect(xposn+46, yposn+33, 4, 4);
    ctx.fillRect(xposn+46, yposn+39, 2, 2);
}

function flashCanvas(canvas) {
    canvas.style.opacity = "1";
    setTimeout(() => {canvas.style.opacity = "0.3";}, 100);
    setTimeout(() => {canvas.style.opacity = "1";}, 200);
    setTimeout(() => {canvas.style.opacity = "0.3";}, 300);
    setTimeout(() => {canvas.style.opacity = "1";}, 400);
    setTimeout(() => {canvas.style.opacity = "0.3";}, 500);
    setTimeout(() => {canvas.style.opacity = "1";}, 600);
}

export { pointerScroll, createButtons, buttons, flashCanvas};

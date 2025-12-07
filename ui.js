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


export { pointerScroll, createButtons, buttons};

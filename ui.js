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
    }
};

function createButtons() {
    buttons.pause.canvas.width = 70;
    buttons.pause.canvas.height = 70;
    buttons.pause.ctx.globalCompositeOperation = "source-over";
    buttons.pause.drawPause(); 
    buttons.straight.canvas.width = 70;
    buttons.straight.canvas.height = 70;
    buttons.straight.draw(buttons.straight.ctx);
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

function drawStraightButton(ctx) {
    ctx.clearRect(0, 0, 70, 70);
    ctx.fillStyle = "black";
    ctx.fillRect(28, 17, 4, 4);
    ctx.fillRect(26, 21, 4, 4);
    ctx.fillRect(22, 25, 4, 4);
    ctx.fillRect(20, 29, 4, 4);
    ctx.fillRect(22, 33, 4, 4);
    ctx.fillRect(26, 37, 4, 4);
    ctx.fillRect(28, 41, 4, 4);
    ctx.fillRect(26, 45, 4, 4);
    ctx.fillRect(24, 49, 4, 4);
    ctx.fillRect(40, 17, 4, 24);
    ctx.beginPath();
    ctx.moveTo(34, 41);
    ctx.lineTo(50, 41);
    ctx.lineTo(42, 53);
    ctx.lineTo(34, 41);
    ctx.fill();
}

export { pointerScroll, createButtons, buttons};

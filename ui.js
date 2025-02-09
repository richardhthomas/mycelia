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
    a: {
        canvas: document.getElementById("buttonA-canvas"),
        get ctx() {return this.canvas.getContext("2d");},
        get drawPause() {return pauseButton();},
        get drawPlay() {return playButton();}
    },
    b: {
        canvas: document.getElementById("buttonB-canvas"),
        get ctx() {return this.canvas.getContext("2d");}
    }
};

function createButtons() {
    buttons.a.canvas.width = 70;
    buttons.a.canvas.height = 70;
    buttons.a.ctx.globalCompositeOperation = "source-over";
    pauseButton();
    straightButton();
}

function pauseButton() {
    buttons.a.ctx.clearRect(0, 0, 70, 70);
    buttons.a.ctx.reset();
    buttons.a.ctx.fillStyle = "black";
    buttons.a.ctx.fillRect(20, 20, 10, 30);
    buttons.a.ctx.fillRect(40, 20, 10, 30);
}

function playButton() {
    buttons.a.ctx.clearRect(0, 0, 70, 70);
    buttons.a.ctx.fillStyle = "black";
    buttons.a.ctx.beginPath();
    buttons.a.ctx.moveTo(20, 20);
    buttons.a.ctx.lineTo(20, 50);
    buttons.a.ctx.lineTo(50, 35);
    buttons.a.ctx.lineTo(20, 20);
    buttons.a.ctx.clip();
    buttons.a.ctx.fillRect(20, 20, 30, 30);
}

function straightButton() {
    buttons.b.ctx.clearRect(0, 0, 70, 70);
    buttons.b.ctx.fillStyle = "black";
    buttons.b.ctx.fillRect(28, 17, 4, 4);
    buttons.b.ctx.fillRect(26, 21, 4, 4);
    buttons.b.ctx.fillRect(22, 25, 4, 4);
    buttons.b.ctx.fillRect(20, 29, 4, 4);
    buttons.b.ctx.fillRect(22, 33, 4, 4);
    buttons.b.ctx.fillRect(26, 37, 4, 4);
    buttons.b.ctx.fillRect(28, 41, 4, 4);
    buttons.b.ctx.fillRect(26, 45, 4, 4);
    buttons.b.ctx.fillRect(24, 49, 4, 4);
    buttons.b.ctx.fillRect(40, 17, 4, 24);
    buttons.b.ctx.beginPath();
    buttons.b.ctx.moveTo(34, 41);
    buttons.b.ctx.lineTo(50, 41);
    buttons.b.ctx.lineTo(42, 53);
    buttons.b.ctx.lineTo(34, 41);
    buttons.b.ctx.clip();
    buttons.b.ctx.fillRect(34, 41, 16, 12);
}

export { pointerScroll, createButtons, buttons};

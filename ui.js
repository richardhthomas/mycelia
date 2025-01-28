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

function createButtons() {
    const button1Canvas = document.getElementById("button1-canvas");
    const button1Ctx = button1Canvas.getContext("2d");
    button1Canvas.width = 70;
    button1Canvas.height = 70;
    button1Ctx.globalCompositeOperation = "source-over";
    drawPauseButton();


    function drawPauseButton() {
        button1Ctx.clearRect(0, 0, 70, 70);
        button1Ctx.reset();
        button1Ctx.fillStyle = "black";
        button1Ctx.fillRect(20, 20, 10, 30);
        button1Ctx.fillRect(40, 20, 10, 30);
    }

    function drawPlayButton() {
        button1Ctx.clearRect(0, 0, 70, 70);
        button1Ctx.fillStyle = "black";
        button1Ctx.beginPath();
        button1Ctx.moveTo(20, 20);
        button1Ctx.lineTo(20, 50);
        button1Ctx.lineTo(50, 35);
        button1Ctx.lineTo(20, 20);
        button1Ctx.clip();
        button1Ctx.fillRect(20, 20, 30, 30);
    }

    function button1Click() {
        if (pause) {
            drawPauseButton();
            pause = false;
        } else {
            drawPlayButton();
            pause = true;
        }
    }
    
    button1Canvas.addEventListener("pointerdown", function() {
        button1Click();
    });
}
export { pointerScroll, createButtons };

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

export { pointerScroll };

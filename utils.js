function probResult(probability) {
    let total = 0;
    for (let p in probability) {
        total += probability[p];
    }
    let x = Math.floor((Math.random() * total) + 1);
    for (let [result, prob] of Object.entries(probability)) {
        if (x <= prob) {
            return result;
        } else {
            x -= prob;
        }
    }
}

function hoveroverDetection(xposn, yposn, screen) {
    const range = [
        [0,0],
        [-1,-1],
        [0,-1],
        [1,-1],
        [-1,0],
        [1,0],
        [-1,1],
        [0,1],
        [1,1],
        [-2,-2],
        [-1,-2],
        [0,-2],
        [1,-2],
        [2,-2],
        [-2,-1],
        [2,-1],
        [-2,0],
        [2,0],
        [-2,1],
        [2,1],
        [-2,2],
        [-1,2],
        [0,2],
        [1,2],
        [2,2]];
    let content = null;
    for (let i=0; i<range.length; i++) {
        content = screen[xposn + range[i][0]][yposn + range[i][1]];
        if (content) {break;}
    }
    return content;
    // note that content does not return null, as even if screen is empty,
    // content is set as undefined.
}

export {probResult, hoveroverDetection};

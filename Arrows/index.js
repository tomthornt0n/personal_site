
let ongoingTouches = [];

const colorFromTouch = (touch) => {
    let r = touch.identifier % 16;
    let g = Math.floor(touch.identifier / 3) % 16;
    let b = Math.floor(touch.identifier / 7) % 16;
    r = r.toString(16); // make it a hex digit
    g = g.toString(16); // make it a hex digit
    b = b.toString(16); // make it a hex digit
    const color = `#${r}${g}${b}`;
    return color;
};

const copyTouch = ({ identifier, pageX, pageY }) => {
    return { identifier, pageX, pageY };
};

const ongoingTouchIndexFromId = (id) => {
    for (let i = 0; i < ongoingTouches.length; i++) {
        const id = ongoingTouches[i].identifier;
        if (id === id) {
            return i;
        }
    }
    return -1;    // not found
};

const draw = (ctx) => {
    for (let i = 0; i < ongoingTouches.length; i++) {
        const color = colorFromTouch(ongoingTouches[i]);
        ctx.beginPath();
        ctx.arc(ongoingTouches[i].pageX, ongoingTouches[i].pageY, 4, 0, 2 * Math.PI, false);  // a circle at the start
        ctx.fillStyle = color;
        ctx.fill();
    }
};

const updateCanvasSize = (canvas) => {
    canvas.width = Math.floor(canvas.clientWidth * window.devicePixelRatio);
    canvas.height = Math.floor(canvas.clientHeight * window.devicePixelRatio);
};

const handleStart = (event) => {
    event.preventDefault();
    
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const touches = event.changedTouches;
    
    for (let i = 0; i < touches.length; i++) {
        ongoingTouches.push(copyTouch(touches[i]));
    }
    
    draw(ctx);
};

const handleEnd = (event) => {
    event.preventDefault();
    
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const touches = event.changedTouches;
    
    for (let i = 0; i < touches.length; i++) {
        let idx = ongoingTouchIndexFromId(touches[i].identifier);
        if (idx >= 0) {
            ongoingTouches.splice(idx, 1);
        }
    }
    
    draw();
};

const handleCancel = (event) => {
    event.preventDefault();
    
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const touches = event.changedTouches;
    
    for (let i = 0; i < touches.length; i++) {
        let idx = ongoingTouchIndexFromId(touches[i].identifier);
        if (idx >= 0) {
            ongoingTouches.splice(idx, 1);
        }
    }
    
    draw();
};

const handleMove = (event) => {
    
};

const startup = () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    
    addEventListener("resize", (event) => { updateCanvasSize(canvas); draw(ctx); });
    
    canvas.addEventListener('pointerdown', handleStart);
    canvas.addEventListener('touchstart', handleStart);
    canvas.addEventListener('pointerup', handleEnd);
    canvas.addEventListener('touchend', handleEnd);
    canvas.addEventListener('touchcancel', handleCancel);
    canvas.addEventListener('touchmove', handleMove);
    
    updateCanvasSize(canvas);
    draw(ctx);
};

document.addEventListener("DOMContentLoaded", startup);

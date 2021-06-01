const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const dpr = window.devicePixelRatio || 1;

let canvasWidth
let canvasHeight

if (dpr > 1) {
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;

    canvas.width = canvasWidth * dpr;
    canvas.height = canvasHeight * dpr;
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;

    ctx.scale(dpr, dpr);
}


const mouse = {
    x: null,
    y: null

}

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX 
    mouse.y = e.clientY 
})

function animate(){
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    ctx.beginPath()
    ctx.arc(mouse.x, mouse.y,10, 0, Math.PI * 2, false);
    ctx.fill()
    ctx.closePath()
    requestAnimationFrame(animate)


}

animate()
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const dpr = window.devicePixelRatio || 1;

let canvasWidth = canvas.width
let canvasHeight = canvas.height


if (dpr > 1) {
    
    canvas.width = canvasWidth * dpr;
    canvas.height = canvasHeight * dpr;
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;

    ctx.scale(dpr, dpr);
}

const kick = new Audio('./samples/kick.wav');
const clap = new Audio('./samples/clap.wav');
const hat = new Audio('./samples/hat.wav');

function playSound(sample){
    console.log(sample)
    sample.paused = true
    sample.currentTime = 0.0
    sample.play();
}

// window.addEventListener('click', playSound);

const mouse = {
    x: null,
    y: null
}

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX 
    mouse.y = e.clientY 
})



let samples = [hat, clap, kick];

class PianoRoll{
    constructor(rows, columns){
        this.rows = rows;
        this.columns = columns;
        this.grid = [];
        this.timeline = 0;
        this.setup();
        canvas.addEventListener('click', this.toggleCell.bind(this));
        // this.play();
       
    }

    setup() {
        // add grid
        for (let r = 0; r < this.rows; r++) {
          let row = [];
          for (let c = 0; c < this.columns; c++) {
            // Create a new instance of the Cell class for each element in the 2D array and push to the maze grid array
            let cell = new Cell(r, c, false, this.rows, this.columns, samples[r]);
            row.push(cell);
          }
          this.grid.push(row);
        }
      }

      toggleCell(e){
        console.log(e.offsetX * dpr, e.offsetY )
        for(let r = 0; r < this.grid.length; r++){
            for(let c = 0; c < this.grid[r].length; c++){
                let cell = this.grid[r][c];
                let cellWidth = canvasWidth / this.columns;
                let cellheight = canvasHeight / this.rows;
                if(e.offsetX > cell.coords.x && e.offsetX < cell.coords.x + cellWidth
                    && e.offsetY > cell.coords.y && e.offsetY < cell.coords.y + cellheight ){
                    cell.active = !cell.active;
                    cell.draw();
                }
            }
        }
      }

      play(){
        // draw grid
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        for(let r = 0; r < this.grid.length; r++){
            for(let c = 0; c < this.grid[r].length; c++){
                this.grid[r][c].draw();
                if(this.grid[r][c].coords.x == this.timeline && this.grid[r][c].active == true ){
                    // console.log('hit')
                    console.log(this.grid[r][c].sample)
                    playSound(this.grid[r][c].sample)    
                }
            }
        }

          // move timeline
          ctx.strokeStyle = 'white'
          this.timeline += 2;
          if(this.timeline >= canvasWidth) this.timeline = 0
          ctx.beginPath();
          ctx.moveTo(this.timeline, 0);
          ctx.lineTo(this.timeline, canvasHeight);
          ctx.stroke();  
          ctx.closePath();

        // requestAnimationFrame(this.play.bind(this))
               
      }
      
}


class Cell{
    constructor(row, column, active, rowAmount, colAmount, sample){
        this.row = row;
        this.column = column;
        this.active = active;
        this.rowAmount = rowAmount;
        this.colAmount = colAmount;
        this.coords = {};
        this.sample = sample;
        this.sample.loop = false;
        this.draw();
        window.addEventListener('resize',  this.draw.bind(this));
    }

    draw(){
        this.coords.x = this.column * (canvasWidth / this.colAmount);
        this.coords.y = this.row * (canvasHeight / this.rowAmount);
        ctx.lineWidth = 2
        ctx.strokeStyle = 'rgb(0, 0, 0)'
        if(this.active){
            ctx.fillStyle = 'rgba(255, 255, 255, 0.399)'
        }else{
            ctx.fillStyle = '#1a1a1e'
        }
        ctx.beginPath();
        ctx.rect(this.coords.x, this.coords.y, Math.ceil(canvasWidth / this.colAmount), Math.ceil(canvasHeight / this.rowAmount));
        ctx.stroke();
        ctx.fill()
        ctx.closePath();
        // console.log(canvasWidth / this.colAmount)
    }
}

let tempo = 11;


let piano = new PianoRoll(3, 32);
window.setInterval(() => {
    piano.play();
}, tempo) 
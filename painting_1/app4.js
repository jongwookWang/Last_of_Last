const canvas = document.getElementById("jsCanvas");
const ctx = canvas.getContext("2d");
const colors = document.getElementsByClassName("jsColor");
const range = document.getElementById("jsRange");

const INITIAL_COLOR = "2c2c2c";
const CANVAS_SIZE1 = 600;
const CANVAS_SIZE2 = 400;

canvas.width = CANVAS_SIZE1;
canvas.height =CANVAS_SIZE2;
ctx.fillStyle = "white";

var img = new Image()
img.crossOrigin="anonymous";
img.src = "4.jpg";
img.onload = function(){
    ctx.drawImage(img,0,0,canvas.width,canvas.height);
}

ctx.strokeStyle = INITIAL_COLOR;
let lineWidth = "70";
let weight = "0.25";
let circle_color = "#2c2c2c";
let drawing = false;


function stopPainting(){
drawing = false;
}

function startPainting(){
drawing = true;
}


const mouse = {
    x : null,   
    y : null
}

window.addEventListener('mousemove', function(event){
    mouse.x = event.x- canvas.offsetLeft;
    mouse.y = event.y- canvas.offsetTop;
})

class Root {
    constructor(x,y,color,centerX, centerY){
        this.x = x;
        this.y = y;
        this.color = color;
        this.speedX = 0;
        this.speedY = 0;
        this.centerX = centerX;
        this.centerY = centerY;
    }
    draw(){
        this.speedX += (Math.random()-weight) /2// -0.25 ~0.25
        this.speedY += (Math.random()-weight) /2; // -0.25 ~0.25
        this.x += this.speedX;
        this.y += this.speedY;

        const distanceX = this.x - this.centerX;
        const distanceY = this.y - this.centerY;
        const distance = Math.sqrt(distanceX * distanceX + 
            distanceY * distanceY);
        const radius = (-distance / lineWidth + 1) * lineWidth/ 10 ;

        if (radius > 0) {
            requestAnimationFrame(this.draw.bind(this));
            ctx.beginPath();
            ctx.arc(this.x,this.y,radius,0,2*Math.PI);
            ctx.globalAlpha = 0.05;
            ctx.fillStyle = circle_color;
            ctx.fill();            
        }
    }
}

function branchOut(){
    if(drawing === true){
        const centerX = mouse.x;
        const centerY = mouse.y;
        for(let i=0; i<3; i++){
            const root = new Root(mouse.x, mouse.y, circle_color, centerX,
            centerY);
            root.draw();
        }
    }
}

//칼라선택
function change_color(element){
    circle_color = element.style.background;
    console.log(circle_color);
}

function change1(element){
    weight = 1;
}
function change2(element){
    weight = 0.5;
}
function change3(element){
    weight = 0;
}


if(canvas){
canvas.addEventListener("mousedown" , startPainting);
canvas.addEventListener("mouseup" , stopPainting);
canvas.addEventListener("mouseleave" , stopPainting);
}

window.addEventListener('mousemove',function(){
    //ctx.fillStyle = 'rgba(255,255,255,0.03)';
    //ctx.fillRect(0,0,canvas.width,canvas.height);
    branchOut();
});

//저장하기
function save(){
    canvas.toBlob((blob)=>{

        const a = document.createElement('a');
        document.body.append(a);
        a.download ='export{timestamp}.png';
        a.href= URL.createObjectURL(blob);
        a.click();
        a.remove();
    });
}
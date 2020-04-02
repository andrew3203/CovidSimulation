let canvas = document.getElementById('liner');
let ctx = canvas.getContext('2d');

let pi = Math.PI;
let WIDTH = 800;
let HEIGHT = 50;
let R = 10;
let V = 1;
let X0 = 100;


function drawDot(x){
    ctx.clearRect(0,0, WIDTH, HEIGHT);
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#40D624";
    ctx.fillStyle="#40D624";
    ctx.arc(x, 25, 10, 0, 2*pi);
    ctx.stroke();
    ctx.fill();
    timer = setTimeout(function(){drawDot(x); }, 8);
    x += V;
    if((x === WIDTH - R) || (x === R)){
        V *= -1;
    }
}
drawDot(X0+100);


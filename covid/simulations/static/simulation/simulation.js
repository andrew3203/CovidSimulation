var canvas = document.getElementById('liner');
var ctx = canvas.getContext('2d');
var pi = Math.PI;

var x = 100;
var v = -1;
function drawDot(){
    ctx.clearRect(0,0, 800, 50);
    ctx.beginPath();
    ctx.fillStyle="pink";
    ctx.arc(x, 25, 10, 0, 2*pi);
    ctx.stroke();
    ctx.fill();
    timer = setTimeout(drawDot, 15);
    x+=v;
    if((x === 800 - 10) || (x === 10)){
        v *= -1;
    }
}
drawDot();

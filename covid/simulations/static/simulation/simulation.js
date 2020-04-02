let canvas = document.getElementById('liner');
let ctx = canvas.getContext('2d');

let pi = Math.PI;
let WIDTH = 800;
let HEIGHT = 50;
let R = 10;
let V = 1;
let X0 = 100;

function moveCircle(x){
    ctx.clearRect(0,0, WIDTH, HEIGHT);
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#40D624";
    ctx.fillStyle="#40D624";
    ctx.arc(x, 25, 10, 0, 2*pi);
    ctx.stroke();
    ctx.fill();
    let timer = setTimeout(function(){moveCircle(x); }, 8);
    x += V;
    if((x === WIDTH - R) || (x === R)){
        V *= -1;
    }
}

'use strict';

class Circle {
  constructor(R, velocity, pos, color) {
    this.R = R;
    this.velocity = velocity;
    this.pos = pos;
    this.color = color;
  }

  set set_values(newValue) {
    [this.R, this.velocity, this.pos, this.color] = newValue.split(' ');
  }

  static createCircle() {
    return new Circle(10, {x: 1, y: 0}, {x: 100, y: 25}, "#40D624");
  }
  liner_move(){
      if(this.pos.x === (WIDTH -  this.R) || this.pos.x === this.R){
          this.velocity.x *= -1;
      }
      this.pos.x += this.velocity.x;
  }
  move(){
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = this.color;
    ctx.fillStyle = this.color;
    ctx.arc(this.pos.x, this.pos.y, this.R, 0, 2*pi);
    ctx.stroke();
    ctx.fill();
    this.liner_move();

    }
}

function run(circle){
    ctx.clearRect(0,0, WIDTH, HEIGHT);
    circle.move();
    let timer = setTimeout(function(){run(circle); }, 8);
}

let circle = Circle.createCircle();
run(circle);



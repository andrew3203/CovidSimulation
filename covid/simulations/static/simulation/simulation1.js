'use strict';

const frame1 = {
    'width': 800,
    'height': 50,
};
const frame2 = {
    'width': 800,
    'height': 400,
};

const colors = {
    'sick': ['sick', '#B72E3E'],
    'health': ['health', '#259238'],
    'recover': ['recover', '#B939D3'],
};


function setPauseOn(interval) {
    let start = new Date();

    while (true){
        let current = new Date();
        if(current - interval - start >= 0){
            console.log('yes');
            return 0;
        }
    }

}

function randomFloatFromRange(min, max) {
  return Math.random() * (max - min + 1) + min;
}

function randomIntFromRange(min, max) {
  return Math.floor(randomFloatFromRange(min, max));
}

function distance(x1, y1, x2, y2) {
  const xDist = x2 - x1;
  const yDist = y2 - y1;

  return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))
}

function rotate(velocity, angle) {
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };

    return rotatedVelocities;
}

function resolveCollision(particle, otherParticle) {
    const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
    const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

    const xDist = otherParticle.x - particle.x;
    const yDist = otherParticle.y - particle.y;

    // Prevent accidental overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

        // Grab angle between the two colliding particles
        const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

        // Store mass in var for better readability in collision equation
        const m1 = particle.mass;
        const m2 = otherParticle.mass;

        // Velocity before equation
        const u1 = rotate(particle.velocity, angle);
        const u2 = rotate(otherParticle.velocity, angle);

        // Velocity after 1d collision equation
        const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
        const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

        // Final velocity after rotating axis back to original location
        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        // Swap particle velocities for realistic bounce effect
        particle.velocity.x = vFinal1.x;
        particle.velocity.y = vFinal1.y;

        otherParticle.velocity.x = vFinal2.x;
        otherParticle.velocity.y = vFinal2.y;
    }
}


// Objects
class Particle {

    constructor(x, y, velocity_x, velocity_y, radius, color, c , frame){
        this.x = x;
        this.y = y;
        this.velocity = {
            x: velocity_x,
            y: velocity_y
        };
        this.radius = radius;
        this.color = color;

        this.mass = 1;

        this.c = c;
        this.frame = frame;

    }

    draw(){
        this.c.beginPath();
        this.c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.c.fillStyle = this.color[1];
        this.c.fill();
        this.c.closePath();
    }

    _checkSick(particle){
        if(particle.color[0] === 'sick' && this.color[0] === 'health'){
                this.color = colors.sick;
            }
        if(this.color[0] === 'sick' && particle.color[0] === 'health'){
            particle.color = colors.sick;
        }
    }

    move(){
        if(this.x - this.radius <= 0 || this.x + this.radius >= this.frame.width){
            this.velocity.x = -this.velocity.x;
        }
        if(this.y - this.radius <= 0 || this.y + this.radius >= this.frame.height){
            this.velocity.y = -this.velocity.y;
        }

        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }

    update(particles){
      for(let i = 0; i < particles.length; i++){
        if(this === particles[i]) continue;
        if(distance(this.x, this.y, particles[i].x, particles[i].y) - this.radius * 2 < 0){
            resolveCollision(this, particles[i]);
            this._checkSick(particles[i]);
        }
        this.draw();
      }
      this.move();
    }

}

class RecoveredParticle extends Particle{

    constructor(x, y, velocity_x, velocity_y, radius, color, c, frame) {
        super(x, y, velocity_x, velocity_y, radius, color, c, frame);
        this.live_time = randomIntFromRange(2000, 3200);
        this.time = undefined;
        if(this.color[0] === 'sick'){
            this.time = new Date();
        }
    }

    _checkRecovered(){
        let current = new Date();

        if(this.color[0] === 'sick' && (current - this.time - this.live_time) >= 0){
            this.color = colors.recover;
        }
    }

    _checkSick(particle) {
        if(particle.color[0] === 'sick' && this.color[0] === 'health'){
                this.color = colors.sick;
                this.time = new Date();
                console.log('yes1');
            }
        if(this.color[0] === 'sick' && particle.color[0] === 'health'){
            particle.color = colors.sick;
            particle.time = new Date();
            console.log('yes2');
        }

    }

    move() {
        super.move();
        this._checkRecovered()
    }

}


// Implementation
class Simulations{
    constructor(element_id, Object, frame) {
        this.canvas = document.getElementById(element_id);
        this.c = this.canvas.getContext('2d');
        this.frame = frame;
        this.canvas.width = this.frame.width;
        this.canvas.height = this.frame.height;

        this.Object = Object;
        this.objects = [];

    }

    resolveCollisionInit(x, y, radius) {
        for (let j = 0; j < this.objects.length; j++) {
            if (distance(x, y, this.objects[j].x, this.objects[j].y) - radius * 2 < 0) {
                x = randomIntFromRange(radius, this.frame.width - radius);
                y = randomIntFromRange(radius, this.frame.height - radius);
                j = -1;
            }
        }
    }

    linerInit() {
        this.objects = [];
        let radius = 10,
            velocity_x, velocity_y = 0,
            x, y = 25,
            color;

        for (let i = 0; i < 6; i++) {
            if (i === 0) {
                velocity_x = 2.5;
                x = 50;
                color = colors['sick'];
            } else {
                radius = 10;
                velocity_x = -0.08;
                x = 50 + i * 120;
                color = colors['health'];

                this.resolveCollisionInit(x, y, radius);
            }
            this.objects.push(new this.Object(x, y, velocity_x, velocity_y, radius, color, this.c, this.frame));
        }
    }

    squareInit() {
        this.objects = [];
        let radius = 10,
            velocity_x, velocity_y,
            x, y,
            color;

        let _sicked_amount = randomIntFromRange(0, 4);

        for (let i = 0; i < 6; i++) {
            velocity_x = randomFloatFromRange(2, 3);
            velocity_y = randomFloatFromRange(2, 3);
            x = randomIntFromRange(radius, this.frame.width - radius);
            y = randomIntFromRange(radius, this.frame.height - radius);

            if (i <= _sicked_amount) {
                color = colors['sick'];
            } else {
                color = colors['health'];
            }
            this.resolveCollisionInit(x, y, radius);

            this.objects.push(new this.Object(x, y, velocity_x, velocity_y, radius, color, this.c, this.frame));
        }
    }
}
let liner_simulate = new Simulations('simulation1', RecoveredParticle, frame1);
liner_simulate.linerInit();

let c = liner_simulate.c;
// Animation Loop
function animate(particles, frame) {
  requestAnimationFrame(function () {
        return animate(particles, frame);
  });
  c.clearRect(0, 0, frame.width, frame.height);

  particles.forEach(particle => {
    particle.update(particles)
  });
}


animate(liner_simulate.objects, liner_simulate.frame);



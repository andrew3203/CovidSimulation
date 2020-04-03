//import randomColor from "./utils";

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 50;

const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2
};

const colors = {
    'sick': ['sick', '#B72E3E'],
    'health': ['health', '#259238'],
    'recover': ['recover', '#B939D3'],
};

function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
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
function Particle(x, y, velocity_x, velocity_y, radius, color) {
    this.x = x;
    this.y = y;
    this.velocity = {
      x: velocity_x,
      y: velocity_y
    };
    this.radius = radius;
    this.color = color;
    this.mass = 1;


  this.draw = () => {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color[1];
    c.fill();
    c.closePath();
  };

  this.update = (partiales) => {

    for(let i = 0; i < partiales.length; i++){
      if(this === particles[i]) continue;
      if(distance(this.x, this.y, particles[i].x, particles[i].y) - this.radius * 2 < 0){
          resolveCollision(this, partiales[i]);
          if((partiales[i].color[0] === 'sick' && this.color[0] === 'health') || (partiales[i].color[0] === 'health' && this.color[0] === 'sick')){
              partiales[i].color = colors['sick'];
              this.color = colors['sick'];
          }
      }
      this.draw();
    }
    if(this.x - this.radius <= 0 || this.x + this.radius >= canvas.width){
      this.velocity.x = -this.velocity.x;
    }
    if(this.y - this.radius <= 0 || this.y + this.radius >= canvas.height){
      this.velocity.y = -this.velocity.y;
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }

}


// Implementation
let particles;
const AMOUNT = 6;
function initLinerSimulation1() {
  particles = [];
  let radius, velocity_x, velocity_y, x, y, color;

  for (let i = 0; i < AMOUNT; i++) {
      if(i === 0){
          radius = 10;
          velocity_x = 1.5;
          velocity_y = 0;
          x = 50;
          y = 25;
          color = colors['sick'];
      }
      else {
          radius = 10;
          velocity_x = -0.08;
          velocity_y = 0;
          x = 50 + i*canvas.width/AMOUNT;
          y = 25;
          color = colors['health'];
          for(let j = 0; j < particles.length; j++){
              if(distance(x, y, particles[j].x, particles[j].y) - radius * 2 < 0){
                  x = randomIntFromRange(radius, canvas.width - radius);
                  y = randomIntFromRange(radius, canvas.height - radius);
                  j = -1;
              }
          }
      }
      particles.push(new Particle(x, y, velocity_x, velocity_y, radius, color));
  }
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(particle => {
    particle.update(particles)
  });

}

initLinerSimulation1();
animate();
'use strict';

const frame1 = {
    'width': 800,
    'height': 50,
};
const frame2 = {
    'width': 800,
    'height': 400,
};
const frame3 = {
    'width': 800,
    'height': 600,
};

const RARIUS = 10;
const colors = {
    'sick': ['sick', '#B72E3E'],
    'health': ['health', '#259238'],
    'recover': ['recover', '#B939D3'],
    'dead': ['dead', '#07070E'],
    'qur': ['qur', '#fff722']
};

function setPauseOn(interval) {
    let start = new Date();

    while (true){
        let current = new Date();
        if(current - interval - start >= 0){
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
    return {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };
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
        this.time_to_recover = randomIntFromRange(2100, 2500);
        this.sicked_time = undefined;
        if(this.color[0] === 'sick'){
            this.sicked_time = new Date();
        }
    }

    _checkRecovered(){
        let current = new Date();

        if(this.color[0] === 'sick' && (current - this.sicked_time - this.time_to_recover) >= 0){
            this.color = colors.recover;
        }
    }

    _checkSick(particle) {
        if(particle.color[0] === 'sick' && (this.color[0] === 'health' || this.color[0] ===  'qur')){
                this.color = colors.sick;
                this.sicked_time = new Date();
            }
        if(this.color[0] === 'sick' && (particle.color[0] === 'health' || particle.color[0] ===  'qur')){
            particle.color = colors.sick;
            particle.sicked_time = new Date();
        }

    }

    move() {
        super.move();
        this._checkRecovered()
    }
}

class LifeParticle extends RecoveredParticle{

    constructor(x, y, velocity_x, velocity_y, radius, color, c, frame) {
        super(x, y, velocity_x, velocity_y, radius, color, c, frame);
        this.time_to_recover = randomIntFromRange(2000, 3500);
        this.time_to_death = randomIntFromRange(2900, 3500);
    }

    _checkRecovered() {
        super._checkRecovered();
        let current = new Date();
        if(this.color[0] === 'sick' && (current - this.sicked_time - this.time_to_death) >= 0){
            this.color = colors.dead;
            this.velocity.x = 0;
            this.velocity.y = 0;
            this.radius = Math.floor(this.radius / 2);
            this.mass /= 10;
        }
    }
}

class QuarantineParticle extends LifeParticle{

    constructor(x, y, velocity_x, velocity_y, radius, color, c, frame, quarantine=false) {
        super(x, y, velocity_x, velocity_y, radius, color, c, frame);
        this.quarantine = quarantine;
    }

    move() {
        if(this.quarantine){
            this.velocity.x /= 1.1;
            this.velocity.y /=1.1;

            this.velocity.x = Math.abs(this.velocity.x) < 0.001 ? 0: this.velocity.x;
            this.velocity.y = Math.abs(this.velocity.y) < 0.001 ? 0: this.velocity.y;
        }
        super.move();
    }
}
class Simulations{

    constructor(canvas_id, Object, frame, amount, custom=false) {
        this.canvas = document.getElementById(canvas_id);
        this.c = this.canvas.getContext('2d');
        this.frame = frame;
        this.canvas.width = this.frame.width;
        this.canvas.height = this.frame.height;

        this.Object = Object;
        this.objects = [];

        this.amount = amount;
        //this.sicked = 0;
        //this.recovered = 0;
        //this.died = 0;

        this.timer = {
            'run': false,
            'time': undefined,
            'life': undefined,
        };

        this.elements = {
            'canvas_id': undefined,
            'box_id': undefined,
        };
        this.elements.canvas_id = '#' + canvas_id;
        this.elements.box_id = this.elements.canvas_id + '-box';

        if(!custom){
            this.init();
        }
    }

    draw(){
        this.objects.forEach(object => {
            object.draw();
        });
    }

    linerInit() {
        this.objects = [];
        let velocity_x, velocity_y = 0,
            x, y = 25,
            color;

        for (let i = 0; i < this.amount; i++) {
            if (i === 0) {
                velocity_x = 2.5;
                x = 50;
                color = colors['sick'];
            } else {
                velocity_x = -Math.random()/10;
                x = 50 + i * (this.frame.width - 50)/this.amount;
                color = colors['health'];
            }

            this.objects.push(new this.Object(x, y, velocity_x, velocity_y, RARIUS, color, this.c, this.frame));
        }

        this.draw();
        this.timer.life = 7000;
    }

    squareDefaultInit() {
        let _sicked_amount = randomIntFromRange(1, 3);
        let quarantines = this.Object === QuarantineParticle ? randomIntFromRange(8, 12): 0;
        this.objectsInit(5, 5, -2, 2, this.amount, 16000, _sicked_amount, quarantines);
    }

    objectsInit(r1, r2, v1, v2, amount, animating_time, sicked=2, quarantines=0){
        let quarantines_left = quarantines,
            sicked_left = sicked;
        this.objects = [];
        let velocity_x, velocity_y,
            color;

        this.amount = amount;

        for (let i = 0; i < this.amount; i++) {

            if(quarantines_left > 0) {
                color = colors['qur'];
                let nums = this._get_nums(r1, r2, 0, 0, 4 * r2);
                velocity_x = 0;
                velocity_y = 0;
                this.objects.push(new this.Object(nums.x,
                    nums.y, velocity_x, velocity_y, nums.radius, color, this.c, this.frame, true));

                for (let q = 0; q < 4; q++) {
                    let xx = randomIntFromRange(nums.x - 4 * nums.radius, nums.x + 4 * nums.radius),
                        yy = randomIntFromRange(nums.y - 4 * nums.radius, nums.y + 4 * nums.radius);

                    let xy = this._check_x_y(xx, yy, nums.radius);

                    this.objects.push(new this.Object(xy['x'],
                        xy['y'], 0, 0, nums.radius, color, this.c, this.frame, true));
                }
                quarantines_left -= 1;
                i += 4;
            }
            else {
                if(sicked_left > 0){
                    color = colors['sick'];
                    sicked_left -=1;
                }
                else{
                    color = colors['health'];
                }
                 let nums = this._get_nums(r1, r2, v1, v2);
                 this.objects.push(new this.Object(nums.x,
                        nums.y,
                        nums.velocity_x, nums.velocity_y, nums.radius, color, this.c, this.frame));
            }
        }

        this.draw();
        this.timer.life = animating_time;
    }

    _get_nums(r1, r2, v1, v2, p=0){
        let radius = randomIntFromRange(r1, r2);
        let x = randomIntFromRange(radius+p, this.frame.width - radius-p),
            y = randomIntFromRange(radius+p, this.frame.height - radius-p);
        let xy = this._check_x_y(x, y, radius);

        return {
            'radius': radius,
            'velocity_x': randomFloatFromRange(v1, v2),
            'velocity_y': randomFloatFromRange(v1, v2),
            'x': xy['x'],
            'y': xy['y'],
        };
    }

    _check_x_y(x, y, radius){
        // в случае карантина все равно проверяеться вся область
         for (let j = 0; j < this.objects.length; j++) {
             if (distance(x, y, this.objects[j].x, this.objects[j].y) - radius * 2 < 0) {
                 x = randomIntFromRange(radius, this.frame.width - radius);
                 y = randomIntFromRange(radius, this.frame.height - radius);
                 j = -1;
             }
         }
        return {'x': x, 'y': y}
    }

    init(){
        if(this.frame.height <= 70){
            this.linerInit();
        }
        else {
            this.squareDefaultInit();
        }
    }

    update(){
        if(!this.timer.run){
            this.timer.run = true;
            this.timer.time = new Date();
        }

        this.c.clearRect(0, 0, this.frame.width, this.frame.height);
        this.objects.forEach(object => {
            object.update(this.objects)
        });
    }

    checkTime(){
        let current = new Date();
        return (current - this.timer.time - this.timer.life >= 0)
    }
}

let animating = [];
let liner_ = new Simulations('liner-simulation', Particle, frame1, 8);
let liner_covered = new Simulations('liner-covered-simulation', RecoveredParticle, frame1, 8);
let square_covered= new Simulations('square-covered-simulation', RecoveredParticle, frame2, 120);
let lifeless = new Simulations('lifeless-simulation', LifeParticle, frame2, 120);
let quarantine_sim = new Simulations('quarantine-simulation', QuarantineParticle, frame2, 120);
let custom = new Simulations('custom-simulation', QuarantineParticle, frame3, 120, true);

let simulations = [
    {
        'element': 'liner-simulation',
        'obj': liner_
    },
    {
        'element': 'liner-covered-simulation',
         'obj': liner_covered
    },
    {
        'element': 'square-covered-simulation',
        'obj': square_covered,
    },
    {
        'element': 'lifeless-simulation',
        'obj': lifeless,
    },
    {
        'element': 'quarantine-simulation',
         'obj': quarantine_sim,
    },
    {
        'element': 'custom-simulation',
        'obj': custom,
    },
];



function Controller(){

    this.amount = 100;
    this.sicked_amount = 2;
    this.animating_time = 15000;

    this.quarantine_lvl = 8;

    this.velocity_start = -2.5;
    this.velocity_end = 2.5;
    this.radius = 8;
    this.radius_random = false;

    this.run = function () {
        let r1;
        if(this.radius_random){
            r1 = 4;
        }
        else {
            r1 = this.radius;
        }

        custom.objectsInit(
            r1,
            this.radius,
            this.velocity_start,
            this.velocity_end,
            this.amount,
            this.animating_time,
            this.sicked_amount,
            this.quarantine_lvl);
        animating.push(custom);
        $(custom.elements.canvas_id).removeClass('fadeout');
    };
    this.stop = function () {
        if(animating.length){
            animating[0].timer.run = false;
            $(animating[0].elements.canvas_id).addClass('fadeout');

            animating.pop();
        }
    }
}

let gui = new dat.GUI({
    autoPlace: false,
    load: JSON,
});

let customContainer = document.getElementById('controller');
customContainer.appendChild(gui.domElement);

let controller = new Controller();

let f1 = gui.addFolder('Controllers');
f1.add(controller, 'amount', 2, 200);
f1.add(controller, 'sicked_amount', 0, 100);
f1.add(controller, 'animating_time', 5000, 100000);
f1.open();

let f2 = gui.addFolder('Parameters');
f2.add(controller, 'velocity_start', -10, 10);
f2.add(controller, 'velocity_end', -10, 10);
f2.add(controller, 'radius', 4, 50);
f2.add(controller, 'radius_random');
f2.add(controller, 'quarantine_lvl', 0, 15);
f2.open();

let f3 = gui.addFolder('Active');
f3.add(controller, 'run');
f3.add(controller, 'stop');
f3.open();


$('.box-replay').click(function(){
    if(animating.length){
        animating[0].timer.run = false;
        $(animating[0].elements.box_id).show();
        $(animating[0].elements.canvas_id).addClass('fadeout');

        animating.pop();
    }

    let canvas_id = $(this).siblings('canvas').attr('id');
    simulations.forEach(simulate => {
        if(simulate.element === canvas_id){
            simulate.obj.init();
            $(simulate.obj.elements.box_id).hide();
            $(simulate.obj.elements.canvas_id).removeClass('fadeout');
            animating.push(simulate.obj);
        }
    });


 });

// Animation Loop
function animate() {
  requestAnimationFrame(animate);

  animating.forEach(obj => {
    obj.update();

    if(obj.checkTime()){
        obj.timer.run = false;

        $(document).ready(function(){
            $(obj.elements.box_id).show();
            $(obj.elements.canvas_id).addClass('fadeout');
        });

        animating.pop();
    }

  });
}

animate();





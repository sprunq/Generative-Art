let density = 0.02; // zoom
let doubleAmplitude = 10000; // effects heights in land
let amlitudeReductionRatio = 0.4; // effects water amount 
let lightSource: p5.Vector;
let maxDist: number;
let planet: Planet;
let charges: Charge[] = [];
let particles: Particle[] = [];

function setup() {
  createCanvas(1200, 1200);
  background(0);
  lightSource = createVector(width, height);
  maxDist = createVector(0, 0).dist(createVector(width, height));

  let planetCharge = new Charge(0, height, 13250000);
  let repelChargeMain = new Charge(width + 4000, 0 - 4000, 1000000000);
  let repelLeft = new Charge(0, 0, 2000000);
  let repelChargeRight = new Charge(width, height, 2000000);

  charges.push(planetCharge);
  charges.push(repelChargeMain);
  charges.push(repelLeft);
  charges.push(repelChargeRight);

  for (var i = 0; i < 5000; i++) {
    let pos = random_point_in_circle(50, width * 2, 0);
    let particle = new Particle(pos, createVector(0, 0));
    particles.push(particle);
  }

  planet = new Planet();
  planet.drawPlanet();
}

function draw() {
  particles.forEach(particle => {
    let old_pos = particle.pos.copy();
    let force_sum = createVector(0, 0);
    charges.forEach(charge => {
      let force = charge.fieldForce(particle.pos);
      force_sum.add(force);
    })
    particle.move_particle(force_sum.heading());
    let new_pos = particle.pos.copy();

    strokeWeight(1);
    stroke(color(255, 1));
    line(old_pos.x, old_pos.y, new_pos.x, new_pos.y);
  });
}

function random_point_in_circle(max_r: number, w: number, h: number): p5.Vector {
  let a = random() * 2.0 * PI;
  let r = sqrt((random() * max_r));
  r = constrain(r, 0, max_r) * 20;
  let x = w / 2.0 + r * cos(a);
  let y = h / 2.0 + r * sin(a);
  let vec = createVector(x, y);
  return vec;
}


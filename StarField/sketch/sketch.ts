let circleSize = 200;
let lightSource: p5.Vector;
let maxDist: number;
let charges: Charge[] = [];
let particles: Particle[] = [];

function preload() {
}

function setup() {
  createCanvas(1000, 1000);
  background(0);
  blendMode(ADD);
  colorMode(HSB, 360, 100, 100, 100);
  lightSource = createVector(0, height - 300);
  maxDist = createVector(0, 0).dist(createVector(width, height));


  let mainRepel = new Charge(417, 655, 20000);
  let mainAttract = new Charge(602, 348, -20000);
  charges.push(mainRepel);
  charges.push(mainAttract);

  for (var i = 0; i < 5000; i++) {
    let pos = randomPointOnCircleEdge(10, mainRepel.pos.x * 2, mainRepel.pos.y * 2);
    let particle = new Particle(pos, createVector(0, 0));
    particles.push(particle);
  }

  for (var i = 0; i < 2000; i++) {
    let pos = randomPointOnCircleEdge(700, width, height);
    let particle = new Particle(pos, createVector(0, 0));
    particles.push(particle);
  }

  for (var i = 0; i < 400; i++) {
    let pos = randomPointInCircle(400, width + 700, -100);
    let particle = new Particle(pos, createVector(0, 0));
    particles.push(particle);
  }


  for (var i = 0; i < 30; i++) {
    let pos = randomPointOnCircleEdge(circleSize * 0.9, width, height);
    charges.push(new Charge(pos.x, pos.y, random(0, 1100)));

    for (var j = 0; j < 200; j++) {
      let pos_c = randomPointOnCircleEdge(10, pos.x * 2, pos.y * 2);
      let particle = new Particle(pos_c, createVector(0, 0));
      particles.push(particle);
    }
  }

  for (var i = 0; i < 15; i++) {
    let pos = randomPointOnCircleEdge(circleSize * 0.7, width, height);
    charges.push(new Charge(pos.x, pos.y, random(-3000, 0)));
  }

  drawStars();


}

function draw() {
  particles.forEach((particle, index, arr) => {
    let old_pos = particle.pos.copy();
    let force_sum = createVector(0, 0);
    charges.forEach(charge => {
      let force = charge.fieldForce(particle.pos);
      force_sum.add(force);
    })
    if (particle.pos.dist(charges[1].pos) < 20) {
      arr.splice(index, 1);
    }
    particle.move_particle(force_sum.heading());
    let new_pos = particle.pos.copy();

    strokeWeight(1);
    stroke(color(218, 0, 40, 4));
    line(old_pos.x, old_pos.y, new_pos.x, new_pos.y);
  });
  console.log(particles.length, frameRate());
}

function drawSphere() {
  blendMode("source-over")
  fill(color(0, 0, 0, 255));
  circle(width / 2, height / 2, circleSize * 2);
  blendMode(ADD);
  noFill();
  for (var i = 0; i < 20000; i++) {
    var p1 = randomPointOnCircleEdge(circleSize, width, height);
    var p2 = randomPointOnCircleEdge(circleSize, width, height);
    var lenLine = p1.dist(p2);
    var aLineLen = map(lenLine, 0, circleSize * 2, 1, 0.3, true);
    var midPoint = p1.add(p2).div(2);
    var dLight = midPoint.dist(lightSource);
    var aLight = map(dLight, 0, 1100, 1, 0.25);
    var alpha_1 = aLight * aLineLen;
    let hue = 27;
    let sat = 100;
    let b = 8;
    let a = 100;
    var baseColor = color(hue, sat - alpha_1 * sat, b, alpha_1 * a);
    stroke(baseColor);
    strokeWeight(1.0);
    line(p1.x, p1.y, p2.x, p2.y);
  }
}

function drawRays() {
  for (var n = 0; n < 0; n++) {
    var lineP = randomPointInCircle(circleSize, width, height);
    var lineEndPoint = createVector(0 - random(500), height + random(500))
    var lineC = color(19, 70, 3, 10);
    for (var i = 0; i < 1000; i++) {
      stroke(lineC);
      line(
        lineP.x,
        lineP.y,
        lineEndPoint.x + random(400),
        lineEndPoint.y + random(400));
    }
  }
}

function drawStars() {
  for (var i = 0; i < 1000; i++) {
    fill(color(255));
    let w = random() * 1;
    ellipse(random(width), random(height), w, w)
  }
}

function randomPointOnCircleEdge(max_r: number, w: number, h: number): p5.Vector {
  let theta = random() * 2.0 * PI;
  let r = max_r;
  let x = w / 2.0 + r * cos(theta);
  let y = h / 2.0 + r * sin(theta);
  let vec = createVector(x, y);
  return vec;
}

function randomPointInCircle(max_r: number, w: number, h: number): p5.Vector {
  let theta = random() * 2.0 * PI;
  let r = sqrt(random()) * max_r;
  let x = w / 2.0 + r * cos(theta);
  let y = h / 2.0 + r * sin(theta);
  let vec = createVector(x, y);
  return vec;
}

function mouseClicked() {
  console.log(mouseX, mouseY);
  drawSphere();
  noLoop();
  return false;
}
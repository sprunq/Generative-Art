let lightSource: p5.Vector;
let maxDist: number;
let vectorField: VectorField;
let particles: Particle[] = [];
let spheres: CosmicSphere[] = [];
let g: p5.Graphics;
let particleBaseSpeed: number;
let particleOffScreenSpeed: number;
let gui: dat.GUI;
let controls: Controls;

function setup() {
  let renderW = 6000;
  let renderH = 4000;
  let displayW = 1000;
  particleBaseSpeed = 30;
  particleOffScreenSpeed = 200;
  vectorField = new VectorField(5, 0.3);

  createCanvas(displayW, displayW / (renderW / renderH));
  colorMode(HSB, 360, 100, 100, 100);
  frameRate(300);
  g = createGraphics(renderW, renderH);
  g.pixelDensity(1);
  g.background(0);
  g.blendMode(ADD);

  lightSource = createVector(g.width, g.height * 0.25);
  maxDist = createVector(0, 0).dist(createVector(g.width, g.height));

  gui = new dat.GUI({ name: "Controls" });
  gui.close();
  controls = new Controls();
  setupGui();
  setupScene();
}

function draw() {
  particles.forEach((particle, index, arr) => {
    let old_pos = particle.pos.copy();
    let force = vectorField.getVectorForce(particle.pos.x, particle.pos.y);
    if (particle.pos.dist(vectorField.charges[0].pos) < 20) {
      arr.splice(index, 1);
    }
    particle.move_particle(force.heading());
    let new_pos = particle.pos.copy();

    g.strokeWeight(1);
    g.stroke(color(218, 0, 40, 4));

    if (onScreen(old_pos) && onScreen(new_pos)) {
      if (particle.speed == particleOffScreenSpeed) particle.speed = random(particleBaseSpeed);
      g.line(old_pos.x, old_pos.y, new_pos.x, new_pos.y);
    }
    else {
      particle.speed = particleOffScreenSpeed;
    }
  });
  if (frameCount % 1 == 0) updateGui();
  image(g, 0, 0, width, height);
}

function setupScene() {
  // Sphere
  let col = new Vec4(27, 0, 5, 100);
  let sp = new CosmicSphere(500, createVector(g.width / 2, g.height / 2), col, 20_000);
  spheres.push(sp);
  sp.drawSphere();

  // Poles
  let axisOffset = 20;
  let p1 = pointOnCircleEdge(sp.size * 0.95, sp.pos.x * 2, sp.pos.y * 2, radians(90 - axisOffset));
  let p2 = pointOnCircleEdge(sp.size * 0.95, sp.pos.x * 2, sp.pos.y * 2, radians(270 - axisOffset));
  let c1 = new Charge(p1.x, p1.y, -0_500_000);
  let c2 = new Charge(p2.x, p2.y, 0_500_000);
  vectorField.charges.push(c1);
  vectorField.charges.push(c2);

  // Repellor particles
  for (var i = 0; i < 20_000; i++) {
    let p = pointOnCircleEdge(30, c2.pos.x * 2, c2.pos.y * 2, radians(random(270 - axisOffset - 110, 270 - axisOffset + 110)));
    particles.push(new Particle(p, random(particleBaseSpeed)));
  }

  // Particles coming from the top
  for (var i = 0; i < 1_500; i++) {
    let p = pointOnCircleEdge(2500, g.width, g.height, radians(random(90 - axisOffset - 20, 90 - axisOffset + 20)));
    particles.push(new Particle(p, random(particleBaseSpeed)));
  }
  vectorField.calculateVectorField();

  // Rays
  g.stroke(color(23, 0, 10, 40));
  g.strokeWeight(1);
  let angle = 4;
  for (var i = 0; i < 0; i++) {
    let p1 = pointOnCircleEdge(1800, c1.pos.x * 2, c1.pos.y * 2, radians(random(90 - axisOffset - angle, 90 - axisOffset + angle)));
    g.line(c1.pos.x, c1.pos.y, p1.x, p1.y);
    let p2 = pointOnCircleEdge(1800, c2.pos.x * 2, c2.pos.y * 2, radians(random(270 - axisOffset - angle, 270 - axisOffset + angle)));
    g.line(c2.pos.x, c2.pos.y, p2.x, p2.y);
  }
}
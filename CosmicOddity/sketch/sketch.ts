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
  vectorField = new VectorField(10, 0.3);

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
  removeStuckParticles();

  g.strokeWeight(1);
  g.stroke(color(218, 0, 2, 100));
  particles.forEach((particle) => {
    let old_pos = particle.pos.copy();
    let force = vectorField.getVectorForce(particle.pos.x, particle.pos.y);
    particle.move_particle(force.heading());
    let new_pos = particle.pos.copy();

    if (onScreen(old_pos) && onScreen(new_pos)) {
      if (particle.speed == particleOffScreenSpeed) particle.speed = random(particleBaseSpeed);
      g.line(old_pos.x, old_pos.y, new_pos.x, new_pos.y);
    }
    else {
      particle.speed = particleOffScreenSpeed;
    }
  });

  updateGui();
  image(g, 0, 0, width, height);
}

function removeStuckParticles() {
  particles.forEach((particle, index, arr) => {
    vectorField.charges.forEach(c => {
      if (c.charge < 0) {
        if (particle.pos.dist(c.pos) < particleBaseSpeed) {
          arr.splice(index, 1);
        }
      }
    });
  });
}

function setupScene() {
  let maxSize = 500;
  for (var s = 0; s < 3; s++) {
    // Sphere
    let pos: p5.Vector;
    let minDist = 100000;
    let calcTry = 0;
    while (true) {
      calcTry += 1;
      if (calcTry > 200) break;
      pos = createVector(
        random(g.width * 0.1, g.width * 0.9),
        random(g.height * 0.2, g.height * 0.8));
      if (spheres.length == 0) break;
      spheres.forEach(sphere => {
        let dist = sphere.pos.dist(pos);
        if (dist < minDist) minDist = dist;
      });
      if (minDist > maxSize + 100) break;
    }
    let col = new Vec4(27, 0, 5, 100);
    let spSize = random(50, maxSize);
    let spIter = 50 * spSize;
    let sp = new CosmicSphere(spSize, pos, col, spIter);
    spheres.push(sp);
    sp.drawSphere();

    // Poles
    let axisOffset = random(-90, 90);
    let p1 = pointOnCircleEdge(sp.size * 0.9, sp.pos.x * 2, sp.pos.y * 2, radians(90 - axisOffset));
    let p2 = pointOnCircleEdge(sp.size * 0.9, sp.pos.x * 2, sp.pos.y * 2, radians(270 - axisOffset));
    let c1 = new Charge(p1.x, p1.y, -0_10_000 * sp.size);
    let c2 = new Charge(p2.x, p2.y, 0_10_000 * sp.size);
    vectorField.charges.push(c1);
    vectorField.charges.push(c2);

    // Repellor particles
    for (var i = 0; i < 14_000; i++) {
      let p = pointOnCircleEdge(30, c2.pos.x * 2, c2.pos.y * 2, radians(random(270 - axisOffset - 110, 270 - axisOffset + 110)));
      particles.push(new Particle(p, random(particleBaseSpeed)));
    }

    // Particles coming from the top
    for (var i = 0; i < 1500; i++) {
      let p = pointOnCircleEdge(6000, g.width, g.height, radians(random(90 - axisOffset - 20, 90 - axisOffset + 20)));
      particles.push(new Particle(p, random(particleBaseSpeed)));
    }
  }
  vectorField.calculateVectorField();
}
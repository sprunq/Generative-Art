let lightSource: p5.Vector;
let maxDist: number;
let vectorField: VectorField;
let particles: Particle[] = [];
let spheres: CosmicSphere[] = [];

function setup() {
  createCanvas(2000, 2000);
  pixelDensity(1);
  background(0);
  blendMode(ADD);
  colorMode(HSB, 360, 100, 100, 100);
  frameRate(300);
  lightSource = createVector(width, height * 0.25);
  maxDist = createVector(0, 0).dist(createVector(width, height));
  vectorField = new VectorField(5, 0.3);

  // Sphere
  let col = new Vec4(27, 0, 5, 100);
  let sp = new CosmicSphere(350, createVector(width / 2, height / 2), col, 20_000);
  spheres.push(sp);
  sp.drawSphere();

  // Poles
  let p1 = pointOnCircleEdge(sp.size * 0.95, sp.pos.x * 2, sp.pos.y * 2, radians(80));
  let p2 = pointOnCircleEdge(sp.size * 0.95, sp.pos.x * 2, sp.pos.y * 2, radians(260));
  let c1 = new Charge(p1.x, p1.y, -200_000);
  let c2 = new Charge(p2.x, p2.y, 200_000);
  vectorField.charges.push(c1);
  vectorField.charges.push(c2);

  // Repellor particles
  for (var i = 0; i < 10_000; i++) {
    let p = pointOnCircleEdge(18, c2.pos.x * 2, c2.pos.y * 2, radians(random(260 - 110, 260 + 110)));
    particles.push(new Particle(p));
  }

  // Particles coming from the top
  for (var i = 0; i < 1_000; i++) {
    let p = pointOnCircleEdge(1800, width, height, radians(random(80 - 20, 80 + 20)));
    particles.push(new Particle(p));
  }
  vectorField.calculateVectorField();

  // Rays
  stroke(color(23, 0, 10, 40));
  strokeWeight(1);
  let angle = 4;
  for (var i = 0; i < 0; i++) {
    let p1 = pointOnCircleEdge(1800, c1.pos.x * 2, c1.pos.y * 2, radians(random(80 - angle, 80 + angle)));
    line(c1.pos.x, c1.pos.y, p1.x, p1.y);
    let p2 = pointOnCircleEdge(1800, c2.pos.x * 2, c2.pos.y * 2, radians(random(260 - angle, 260 + angle)));
    line(c2.pos.x, c2.pos.y, p2.x, p2.y);
  }
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

    strokeWeight(1);
    stroke(color(218, 0, 40, 4));

    if (onScreen(old_pos) && onScreen(new_pos))
      line(old_pos.x, old_pos.y, new_pos.x, new_pos.y);
  });
  console.log(particles.length, frameRate());
}

function mouseClicked() {
  console.log(mouseX, mouseY);
  return false;
}

function keyPressed() {
  if (key == 's') {
    save("canvas.png");
  }
  else if (key == "p") noLoop();
  else if (key == "o") loop();
  else if (key == "i") {
    spheres.forEach(sphere => {
      sphere.drawSphere();
    });
  };
}
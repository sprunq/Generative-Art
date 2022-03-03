class FlowField {
  constructor(x1, y1, x2, y2, particleCount) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.particles = [];
    this.noiseScale = random(400, 1400);
    this.noiseStrength = random(3, 10);
    this.color = color(random() * 255, random() * 255, random() * 255);
    this.createParticles(particleCount);
  }

  createParticles(particleCount) {
    this.particles = [particleCount];
    for (let i = 0; i < particleCount; i++) {
      var loc = createVector(
        random(this.x1, this.x2),
        random(this.y1, this.y2)
      );
      var dir = createVector(0, 0);
      this.particles[i] = new Particle(loc, dir, this);
    }
  }

  run() {
    this.particles.forEach((element) => {
      element.run();
    });
  }
}

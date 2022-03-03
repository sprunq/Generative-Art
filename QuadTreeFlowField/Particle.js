class Particle {
  constructor(_loc, _dir, _flowField) {
    this.loc = _loc;
    this.dir = _dir;
    this.vel = _dir;
    this.flowField = _flowField;
  }

  run() {
    this.move();
    this.checkEdges();
    this.show();
  }

  move() {
    let angle =
      noise(
        this.loc.x / this.flowField.noiseScale,
        this.loc.y / this.flowField.noiseScale
      ) *
      TWO_PI *
      this.flowField.noiseStrength;
    this.dir.x = cos(angle);
    this.dir.y = sin(angle);
    this.vel = this.dir.copy();
    this.vel.mult(controls.particleSpeed);
    this.loc.add(this.vel);
  }

  checkEdges() {
    if (
      this.loc.x < this.flowField.x1 ||
      this.loc.x > this.flowField.x2 ||
      this.loc.y < this.flowField.y1 ||
      this.loc.y > this.flowField.y2
    ) {
      this.loc.x = random(this.flowField.x1, this.flowField.x2);
      this.loc.y = random(this.flowField.y1, this.flowField.y2);
      this.vel.x = 0;
      this.vel.y = 0;
    }
  }

  show() {
    stroke(this.flowField.color);
    strokeWeight(
      controls.particleWeight *
        (((this.flowField.x2 - this.flowField.x1) / controls.canvasSize) * 2)
    );
    line(
      this.loc.x - this.vel.x,
      this.loc.y - this.vel.y,
      this.loc.x,
      this.loc.y
    );
  }
}

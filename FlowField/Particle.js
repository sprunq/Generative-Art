class Particle {
  constructor(_loc, _dir, _speed, _color, _weight) {
    this.loc = _loc;
    this.dir = _dir;
    this.speed = _speed;
    this.color = _color;
    this.weight = _weight;
    this.vel = _dir;
  }

  run() {
    this.move();
    this.checkEdges();
  }

  getDirection() {
    this.move();
    return this.dir;
  }

  move() {
    let angle =
      noise(
        this.loc.x / controls.noiseScale,
        this.loc.y / controls.noiseScale,
        (frameCount * controls.noiseChangeSpeed) / controls.noiseScale
      ) *
      TWO_PI *
      controls.noiseStrength;
    this.dir.x = cos(angle);
    this.dir.y = sin(angle);
    //this.dir.x = cos(angle) * tan(angle) * 0.1; // For melting effect 600 scale 3 strength
    //this.dir.y = this.dir.x * angle * this.vel.x;
    this.vel = this.dir.copy();
    this.vel.mult(controls.speed);
    this.loc.add(this.vel);
  }

  checkEdges() {
    if (
      this.loc.x < 0 ||
      this.loc.x > controls.w ||
      this.loc.y < 0 ||
      this.loc.y > controls.h
    ) {
      this.loc.x = random(-100, controls.w) * 1.2;
      this.loc.y = random(-100, controls.h) * 1.2;
      this.vel.x = 0;
      this.vel.y = 0;
    }
  }

  show() {
    stroke(this.color);
    strokeWeight(this.weight);
    line(
      this.loc.x - this.vel.x,
      this.loc.y - this.vel.y,
      this.loc.x,
      this.loc.y
    );
  }
}

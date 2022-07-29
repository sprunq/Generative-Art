class Particle {
    pos: p5.Vector;
    dir: p5.Vector;
    speed: number;

    constructor(pos: p5.Vector) {
        this.pos = pos;
        this.dir = createVector(0, 0);
        this.speed = random(20);
    }


    move_particle(angle: number) {
        this.dir.x = cos(angle);
        this.dir.y = sin(angle);
        var vel = this.dir.copy();
        vel.mult(this.speed);
        this.pos.add(vel);
    }
}
class Charge {
    pos: p5.Vector;
    vel: p5.Vector;
    acc: p5.Vector;
    charge: number;
    constructor(x: number, y: number, charge: number) {
        this.pos = createVector(x, y);
        this.vel = createVector();
        this.acc = createVector();
        this.charge = charge;
    }

    addForce(force: any) {
        this.acc.add(force);
    }

    fieldForce(pos: p5.Vector) {
        const disp = p5.Vector.sub(pos, this.pos);
        const distSq = disp.magSq();
        disp.setMag(this.charge / distSq);
        return disp;
    }

    update() {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);
    }
}
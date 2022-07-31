class Curve {
    start: p5.Vector;
    position: p5.Vector;
    vertices: p5.Vector[];
    c: p5.Color;

    constructor(start: p5.Vector, c: p5.Color) {
        this.start = start;
        this.c = c;
        this.vertices = [];
    }

    draw() {
        this.position = this.start.copy();
        g.beginShape();
        g.noFill();
        g.strokeWeight(curveStrokeWeight);
        g.stroke(this.c);
        g.vertex(this.position.x, this.position.y);
        this.vertices.push(this.position.copy());

        for (var i = 0; i < numSegmentsPerCurve; i++) {
            let angle =
                noise(
                    this.position.x / noiseScale,
                    this.position.y / noiseScale
                ) *
                TWO_PI *
                noiseStrenght;
            var force = p5.Vector.fromAngle(angle);
            force.setMag(segmentLength);
            this.position.add(force);

            if (this.isTooClose(this.position)) {
                break;
            }

            g.vertex(this.position.x, this.position.y);
            this.vertices.push(this.position.copy());
        }
        g.vertex(this.position.x, this.position.y);
        g.endShape();
    }

    isTooClose(position: p5.Vector): boolean {
        for (const curv of curves) {
            if (curv === this) {
                continue;
            }
            for (const vert of curv.vertices) {
                var distance = position.dist(vert);
                if (distance < minDistance) {
                    return true;
                }
            }
        }

        if (position.x + minDistance > g.width) {
            return true;
        }
        if (position.x - minDistance < 0) {
            return true;
        }
        if (position.y + minDistance > g.height) {
            return true;
        }
        if (position.y - minDistance < 0) {
            return true;
        }

        return false;
    }
}
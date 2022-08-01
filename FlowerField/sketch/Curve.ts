class Curve {
    start: p5.Vector;
    position: p5.Vector;
    vertices: p5.Vector[];
    col: p5.Color;
    weight: number;

    constructor(start: p5.Vector, c: p5.Color, weight: number) {
        this.start = start;
        this.col = c;
        this.vertices = [];
        this.weight = weight;
    }

    computeVertecies() {
        this.position = this.start.copy();
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
            this.vertices.push(this.position.copy());
        }
    }

    draw() {
        if (this.canDrawCurve())
            this.drawCurve();
    }

    protected drawCurve() {
        g.beginShape();
        g.noFill();
        g.strokeWeight(this.weight);
        g.stroke(this.col);
        for (const vert of this.vertices) {
            g.vertex(vert.x, vert.y);
        }
        g.endShape();
    }

    protected canDrawCurve(): boolean {
        return this.vertices.length > minimumSegments;
    }

    private isTooClose(position: p5.Vector): boolean {
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

        if (position.x + minDistance > g.width + sideBuffer) {
            return true;
        }
        if (position.x - minDistance < 0 - sideBuffer) {
            return true;
        }
        if (position.y + minDistance > g.height + sideBuffer) {
            return true;
        }
        if (position.y - minDistance < 0 - sideBuffer) {
            return true;
        }

        return false;
    }
}
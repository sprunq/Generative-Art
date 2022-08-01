class Curve {
    start: p5.Vector;
    position: p5.Vector;
    vertices: p5.Vector[];
    limiter: Limiter;


    constructor(start: p5.Vector, limiter: Limiter) {
        this.start = start;
        this.vertices = [];
        this.limiter = limiter;
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
        return this.limiter.isInLimit(position) ? true : false;
    }
}
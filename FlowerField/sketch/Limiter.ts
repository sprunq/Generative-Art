abstract class Limiter {
    dist: number;
    constructor(dist: number) {
        this.dist = dist;
    }

    public abstract isInLimit(pos: p5.Vector): boolean;
}

class CircleLimiter extends Limiter {
    public isInLimit(pos: p5.Vector): boolean {
        return this.checkCircularBoundingBox(pos, this.dist);
    }

    private checkCircularBoundingBox(position: p5.Vector, radius: number): boolean {
        let dist = createVector(g.width / 2, g.height / 2).dist(position);
        return dist > radius ? true : false;
    }
}

class RectLimiter extends Limiter {
    public isInLimit(pos: p5.Vector): boolean {
        return this.checkBoundingBox(pos, this.dist * -1);
    }

    private checkBoundingBox(position: p5.Vector, sideBuffer: number): boolean {
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
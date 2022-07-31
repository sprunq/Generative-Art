class StartingPointPicker {
    getStartingPoint(): p5.Vector {
        var p: p5.Vector;
        var maxAttempts = 1000;
        var attempts = 0;

        do {
            p = createVector(random(g.width), random(g.height));
            attempts += 1;
        } while (this.isTooClose(p) && attempts < maxAttempts);

        if (this.isTooClose(p)) {
            return null;
        }

        return p;
    }

    isTooClose(position: p5.Vector): boolean {
        for (const curv of curves) {
            for (const vert of curv.vertices) {
                var distance = position.dist(vert);
                if (distance < minDistance) {
                    return true;
                }
            }
        }
        return false;
    }
}
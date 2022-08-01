class StartingPointPicker {
    getStartingPoint(): p5.Vector {
        var p: p5.Vector;
        var maxAttempts = 1000;
        var attempts = 0;
        do {
            p = createVector(random(-1 * sideBuffer, g.width + sideBuffer), random(-1 * sideBuffer, g.height + sideBuffer));
            attempts += 1;
        } while (this.isTooClose(p) && attempts < maxAttempts);

        if (this.isTooClose(p))
            return null;
        else
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
class Planet {
    drawPlanet() {
        let c1 = color(204, 83, 8);
        let c2 = color(224, 213, 2)
        for (var x = 0; x < 60000; x++) {
            let p: p5.Vector;
            do {
                p = random_point_in_circle(1400, 0, height * 2);
            } while (p.x < 0 || p.x > width || p.y < 0 || p.y > height);
            var pxHeight = this.calculateHeight(p.x, p.y);
            let newHeight = this.normalize(pxHeight, p.x, p.y);
            let alpha = map(newHeight, -1000, 2000, 0, 1);
            let d = p.dist(lightSource);
            let d_n = map(d, 0, maxDist, 1, 0);
            stroke(color(204, 83, 8, alpha * d_n));
            let c_mid = lerpColor(c1, c2, alpha);
            let c_res = lerpColor(c_mid, color(0), d_n);
            stroke(c_res);
            strokeWeight(2);
            point(p.x, p.y);
        }
    }

    calculateHeight(xoff: number, yoff: number) {
        return (noise(xoff * density, yoff * density) * doubleAmplitude) - (doubleAmplitude * amlitudeReductionRatio);
    }

    normalize(baseHeight: number, x: number, y: number) {
        var distanceFromMiddle = Math.sqrt(Math.pow(x - (width / 2), 2) + Math.pow(y - (height / 2), 2));
        var newHeight = baseHeight;
        if (distanceFromMiddle + 1 >= width / 2) {
            newHeight = 0;
        } else {
            newHeight = this.normalizeByLog(newHeight, distanceFromMiddle);
        }
        return newHeight;
    }

    normalizeByLog(pxHeight: number, distanceFromMiddle: number) {
        return pxHeight * Math.log(width / 2 - distanceFromMiddle) / Math.log(width / 2);
    }
}
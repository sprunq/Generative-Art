class Curve {
    constructor(start, c, weight) {
        this.start = start;
        this.col = c;
        this.vertices = [];
        this.weight = weight;
    }
    computeVertecies() {
        this.position = this.start.copy();
        this.vertices.push(this.position.copy());
        for (var i = 0; i < numSegmentsPerCurve; i++) {
            let angle = noise(this.position.x / noiseScale, this.position.y / noiseScale) *
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
    drawCurve() {
        g.beginShape();
        g.noFill();
        g.strokeWeight(this.weight);
        g.stroke(this.col);
        for (const vert of this.vertices) {
            g.vertex(vert.x, vert.y);
        }
        g.endShape();
    }
    canDrawCurve() {
        return this.vertices.length > minimumSegments;
    }
    isTooClose(position) {
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
class CurveBasicFlower extends Curve {
    constructor(start, c, weight, leafWeight) {
        super(start, c, weight);
        this.leafWeight = leafWeight;
    }
    draw() {
        if (this.canDrawCurve()) {
            this.drawLeaves();
            this.drawCurve();
            this.drawFlowerHead(this.position.x, this.position.y, 30);
        }
    }
    drawLeaves() {
        for (var i = 0; i < this.vertices.length; i++) {
            if (i % 8 == 0) {
                let angle = random() > 0.5 ? 20 : -20;
                this.drawLeaf(i, 8, angle);
            }
        }
    }
    drawLeaf(index, lookahead, angle) {
        if (this.vertices.length <= index + lookahead)
            return;
        g.strokeWeight(this.leafWeight);
        g.stroke(color(49, 176, 58));
        let v0 = this.vertices[index];
        let v1 = this.vertices[index + lookahead];
        let vr = v0.copy().add(v1).div(2);
        let p2 = rotateVectorAround(v0.x, v0.y, angle, vr);
        g.line(v0.x, v0.y, p2.x, p2.y);
    }
    drawFlowerHead(x, y, size) {
        g.noStroke();
        g.fill(random(255), random(30), random(255));
        g.ellipse(x + 10, y, size, size);
        g.ellipse(x - 5, y + 5, size, size);
        g.ellipse(x - 15, y - 5, size, size);
        g.ellipse(x - 7, y - 20, size, size);
        g.ellipse(x + 10, y - 15, size, size);
        g.fill(225, random(225), random(225));
        g.ellipse(x - 2, y - 7, 22, 22);
    }
}
class CurveSandbox extends Curve {
    constructor(start, c, weight, leafWeight) {
        super(start, c, weight);
        this.leafWeight = leafWeight;
    }
    draw() {
        if (this.canDrawCurve()) {
            this.drawLeaves();
            this.drawCurve();
            this.drawFlowerHead(this.position.x, this.position.y, 2);
        }
    }
    drawLeaves() {
        let sideChange = true;
        for (var i = 0; i < this.vertices.length; i++) {
            if (i % 8 == 0) {
                let side = sideChange ? true : false;
                sideChange = !sideChange;
                this.drawLeaf(i, 8, side, 0.8);
            }
        }
    }
    drawLeaf(index, lookahead, leafSide, scale) {
        if (this.vertices.length <= index + lookahead)
            return;
        let c = color(random(83, 130), random(20, 100), random(50, 100), 100);
        let v0 = this.vertices[index];
        let v1 = this.vertices[index + lookahead];
        let vr = v0.copy().add(v1).div(2);
        let points = [];
        let sideFact = leafSide ? 1 : -1;
        points.push(v0);
        points.push(scaleVectorRelativeTo(v0.x, v0.y, 0.01 * scale, rotateVectorAround(v0.x, v0.y, 60 * sideFact, vr)));
        points.push(scaleVectorRelativeTo(v0.x, v0.y, 0.1 * scale, rotateVectorAround(v0.x, v0.y, 60 * sideFact, vr)));
        points.push(scaleVectorRelativeTo(v0.x, v0.y, 0.4 * scale, rotateVectorAround(v0.x, v0.y, 60 * sideFact, vr)));
        points.push(scaleVectorRelativeTo(v0.x, v0.y, 0.6 * scale, rotateVectorAround(v0.x, v0.y, 50 * sideFact, vr)));
        points.push(scaleVectorRelativeTo(v0.x, v0.y, 1.0 * scale, rotateVectorAround(v0.x, v0.y, 40 * sideFact, vr)));
        points.push(scaleVectorRelativeTo(v0.x, v0.y, 1.85 * scale, rotateVectorAround(v0.x, v0.y, 23 * sideFact, vr)));
        points.push(scaleVectorRelativeTo(v0.x, v0.y, 2.0 * scale, rotateVectorAround(v0.x, v0.y, 20 * sideFact, vr)));
        points.push(scaleVectorRelativeTo(v0.x, v0.y, 1.5 * scale, rotateVectorAround(v0.x, v0.y, 22 * sideFact, vr)));
        points.push(scaleVectorRelativeTo(v0.x, v0.y, 1.0 * scale, rotateVectorAround(v0.x, v0.y, 17 * sideFact, vr)));
        points.push(scaleVectorRelativeTo(v0.x, v0.y, 0.5 * scale, rotateVectorAround(v0.x, v0.y, 10 * sideFact, vr)));
        points.push(scaleVectorRelativeTo(v0.x, v0.y, 0.3 * scale, rotateVectorAround(v0.x, v0.y, 5 * sideFact, vr)));
        points.push(scaleVectorRelativeTo(v0.x, v0.y, 0.2 * scale, rotateVectorAround(v0.x, v0.y, 1 * sideFact, vr)));
        points.push(scaleVectorRelativeTo(v0.x, v0.y, 0.1 * scale, rotateVectorAround(v0.x, v0.y, 0 * sideFact, vr)));
        g.strokeWeight(this.leafWeight);
        g.stroke(c);
        g.fill(c);
        g.beginShape();
        for (const vert of points) {
            g.vertex(vert.x, vert.y);
        }
        g.endShape();
    }
    drawFlowerHead(x, y, scale) {
        let col_hue = random() < 0.5 ? random(275, 359) : random(0, 49);
        let col_sat = random(20, 100);
        let col_bri = 100;
        let c = color(col_hue, col_sat, col_bri * 0.9, 100);
        let mC = color(col_hue, col_sat, col_bri * 1.0, 100);
        scale *= -1;
        let vertLen = this.vertices.length;
        if (vertLen < 3)
            return;
        let v0 = this.vertices[vertLen - 1];
        let v1 = this.vertices[vertLen - 2];
        let vr = v0.copy().add(v1).div(2);
        let points = [];
        for (var mirror = -1; mirror < 2; mirror += 2) {
            points.push(v0);
            points.push(scaleVectorRelativeTo(v0.x, v0.y, 0.5 * scale, rotateVectorAround(v0.x, v0.y, 80 * mirror, vr)));
            points.push(scaleVectorRelativeTo(v0.x, v0.y, 1.5 * scale, rotateVectorAround(v0.x, v0.y, 80 * mirror, vr)));
            points.push(scaleVectorRelativeTo(v0.x, v0.y, 2.5 * scale, rotateVectorAround(v0.x, v0.y, 60 * mirror, vr)));
            points.push(scaleVectorRelativeTo(v0.x, v0.y, 3.0 * scale, rotateVectorAround(v0.x, v0.y, 50 * mirror, vr)));
            points.push(scaleVectorRelativeTo(v0.x, v0.y, 3.3 * scale, rotateVectorAround(v0.x, v0.y, 40 * mirror, vr)));
            points.push(scaleVectorRelativeTo(v0.x, v0.y, 4.0 * scale, rotateVectorAround(v0.x, v0.y, 30 * mirror, vr)));
            points.push(scaleVectorRelativeTo(v0.x, v0.y, 5.0 * scale, rotateVectorAround(v0.x, v0.y, 30 * mirror, vr)));
            points.push(scaleVectorRelativeTo(v0.x, v0.y, 4.5 * scale, rotateVectorAround(v0.x, v0.y, 20 * mirror, vr)));
            points.push(scaleVectorRelativeTo(v0.x, v0.y, 4.5 * scale, rotateVectorAround(v0.x, v0.y, 0 * mirror, vr)));
            points.push(scaleVectorRelativeTo(v0.x, v0.y, 4.2 * scale, rotateVectorAround(v0.x, v0.y, 0 * mirror, vr)));
            points.push(scaleVectorRelativeTo(v0.x, v0.y, 3 * scale, rotateVectorAround(v0.x, v0.y, 0 * mirror, vr)));
            points.push(scaleVectorRelativeTo(v0.x, v0.y, 2 * scale, rotateVectorAround(v0.x, v0.y, 0 * mirror, vr)));
            points.push(scaleVectorRelativeTo(v0.x, v0.y, 0.5 * scale, rotateVectorAround(v0.x, v0.y, 0 * mirror, vr)));
            points.push(scaleVectorRelativeTo(v0.x, v0.y, 0 * scale, rotateVectorAround(v0.x, v0.y, 0 * mirror, vr)));
            points.push(v0);
        }
        g.strokeWeight(5);
        g.stroke(c);
        g.fill(c);
        g.beginShape();
        for (const vert of points) {
            g.curveVertex(vert.x, vert.y);
        }
        g.endShape();
        let pointsLeaf = [];
        for (var mirror = -1; mirror < 2; mirror += 2) {
            pointsLeaf.push(v0);
            pointsLeaf.push(scaleVectorRelativeTo(v0.x, v0.y, 0.5 * scale, rotateVectorAround(v0.x, v0.y, 80 * mirror, vr)));
            pointsLeaf.push(scaleVectorRelativeTo(v0.x, v0.y, 1.3 * scale, rotateVectorAround(v0.x, v0.y, 50 * mirror, vr)));
            pointsLeaf.push(scaleVectorRelativeTo(v0.x, v0.y, 2.0 * scale, rotateVectorAround(v0.x, v0.y, 40 * mirror, vr)));
            pointsLeaf.push(scaleVectorRelativeTo(v0.x, v0.y, 3.0 * scale, rotateVectorAround(v0.x, v0.y, 25 * mirror, vr)));
            pointsLeaf.push(scaleVectorRelativeTo(v0.x, v0.y, 4.0 * scale, rotateVectorAround(v0.x, v0.y, 15 * mirror, vr)));
            pointsLeaf.push(scaleVectorRelativeTo(v0.x, v0.y, 5.0 * scale, rotateVectorAround(v0.x, v0.y, 8 * mirror, vr)));
            pointsLeaf.push(scaleVectorRelativeTo(v0.x, v0.y, 5.5 * scale, rotateVectorAround(v0.x, v0.y, 0 * mirror, vr)));
            pointsLeaf.push(scaleVectorRelativeTo(v0.x, v0.y, 5.3 * scale, rotateVectorAround(v0.x, v0.y, 0 * mirror, vr)));
            pointsLeaf.push(scaleVectorRelativeTo(v0.x, v0.y, 4.5 * scale, rotateVectorAround(v0.x, v0.y, 0 * mirror, vr)));
            pointsLeaf.push(scaleVectorRelativeTo(v0.x, v0.y, 3.5 * scale, rotateVectorAround(v0.x, v0.y, 0 * mirror, vr)));
            pointsLeaf.push(scaleVectorRelativeTo(v0.x, v0.y, 2.0 * scale, rotateVectorAround(v0.x, v0.y, 0 * mirror, vr)));
            pointsLeaf.push(scaleVectorRelativeTo(v0.x, v0.y, 0.5 * scale, rotateVectorAround(v0.x, v0.y, 0 * mirror, vr)));
            pointsLeaf.push(scaleVectorRelativeTo(v0.x, v0.y, 0.0 * scale, rotateVectorAround(v0.x, v0.y, 0 * mirror, vr)));
            pointsLeaf.push(v0);
        }
        g.strokeWeight(5);
        g.stroke(mC);
        g.fill(mC);
        g.beginShape();
        for (const vert of pointsLeaf) {
            g.curveVertex(vert.x, vert.y);
        }
        g.endShape();
    }
}
class CurveTulip extends Curve {
    constructor(start, c, weight, leafWeight) {
        super(start, c, weight);
        this.leafWeight = leafWeight;
        this.leafColor = color(random(83, 130), random(50, 100), random(50, 100), 100);
    }
    draw() {
        if (this.canDrawCurve()) {
            this.drawLeaves();
            this.drawCurve();
            this.drawFlowerHead(this.position.x, this.position.y, random(1.9, 2.3));
        }
    }
    drawLeaves() {
        let sideChange = true;
        for (var i = 0; i < this.vertices.length; i++) {
            if (i % 8 == 0) {
                let side = sideChange ? true : false;
                sideChange = !sideChange;
                this.drawLeaf(i, 8, side, random(0.8, 1.0));
            }
        }
    }
    drawLeaf(index, lookahead, leafSide, scale) {
        if (this.vertices.length <= index + lookahead)
            return;
        let c = this.leafColor;
        let v0 = this.vertices[index];
        let v1 = this.vertices[index + lookahead];
        let vr = v0.copy().add(v1).div(2);
        let points = [];
        let sideFact = leafSide ? 1 : -1;
        points.push(v0);
        points.push(scaleVectorRelativeTo(v0.x, v0.y, 0.01 * scale, rotateVectorAround(v0.x, v0.y, 60 * sideFact, vr)));
        points.push(scaleVectorRelativeTo(v0.x, v0.y, 0.1 * scale, rotateVectorAround(v0.x, v0.y, 60 * sideFact, vr)));
        points.push(scaleVectorRelativeTo(v0.x, v0.y, 0.4 * scale, rotateVectorAround(v0.x, v0.y, 60 * sideFact, vr)));
        points.push(scaleVectorRelativeTo(v0.x, v0.y, 0.6 * scale, rotateVectorAround(v0.x, v0.y, 50 * sideFact, vr)));
        points.push(scaleVectorRelativeTo(v0.x, v0.y, 1.0 * scale, rotateVectorAround(v0.x, v0.y, 40 * sideFact, vr)));
        points.push(scaleVectorRelativeTo(v0.x, v0.y, 1.85 * scale, rotateVectorAround(v0.x, v0.y, 23 * sideFact, vr)));
        points.push(scaleVectorRelativeTo(v0.x, v0.y, 2.0 * scale, rotateVectorAround(v0.x, v0.y, 20 * sideFact, vr)));
        points.push(scaleVectorRelativeTo(v0.x, v0.y, 1.5 * scale, rotateVectorAround(v0.x, v0.y, 22 * sideFact, vr)));
        points.push(scaleVectorRelativeTo(v0.x, v0.y, 1.0 * scale, rotateVectorAround(v0.x, v0.y, 17 * sideFact, vr)));
        points.push(scaleVectorRelativeTo(v0.x, v0.y, 0.5 * scale, rotateVectorAround(v0.x, v0.y, 10 * sideFact, vr)));
        points.push(scaleVectorRelativeTo(v0.x, v0.y, 0.3 * scale, rotateVectorAround(v0.x, v0.y, 5 * sideFact, vr)));
        points.push(scaleVectorRelativeTo(v0.x, v0.y, 0.2 * scale, rotateVectorAround(v0.x, v0.y, 1 * sideFact, vr)));
        points.push(scaleVectorRelativeTo(v0.x, v0.y, 0.1 * scale, rotateVectorAround(v0.x, v0.y, 0 * sideFact, vr)));
        g.strokeWeight(this.leafWeight);
        g.stroke(c);
        g.fill(c);
        g.beginShape();
        for (const vert of points) {
            g.curveVertex(vert.x, vert.y);
        }
        g.endShape();
    }
    drawFlowerHead(x, y, scale) {
        let col_hue = random() < 0.5 ? random(275, 359) : random(0, 49);
        let col_sat = random(20, 100);
        let col_bri = 100;
        let c = color(col_hue, col_sat, col_bri * 0.9, 100);
        let mC = color(col_hue, col_sat, col_bri * 1.0, 100);
        scale *= -1;
        let vertLen = this.vertices.length;
        if (vertLen < 3)
            return;
        let v0 = this.vertices[vertLen - 1];
        let v1 = this.vertices[vertLen - 2];
        let vr = v0.copy().add(v1).div(2);
        let points = [];
        for (var mirror = -1; mirror < 2; mirror += 2) {
            points.push(v0);
            points.push(scaleVectorRelativeTo(v0.x, v0.y, 0.5 * scale, rotateVectorAround(v0.x, v0.y, 80 * mirror, vr)));
            points.push(scaleVectorRelativeTo(v0.x, v0.y, 1.5 * scale, rotateVectorAround(v0.x, v0.y, 80 * mirror, vr)));
            points.push(scaleVectorRelativeTo(v0.x, v0.y, 2.5 * scale, rotateVectorAround(v0.x, v0.y, 60 * mirror, vr)));
            points.push(scaleVectorRelativeTo(v0.x, v0.y, 3.0 * scale, rotateVectorAround(v0.x, v0.y, 50 * mirror, vr)));
            points.push(scaleVectorRelativeTo(v0.x, v0.y, 3.3 * scale, rotateVectorAround(v0.x, v0.y, 40 * mirror, vr)));
            points.push(scaleVectorRelativeTo(v0.x, v0.y, 4.0 * scale, rotateVectorAround(v0.x, v0.y, 30 * mirror, vr)));
            points.push(scaleVectorRelativeTo(v0.x, v0.y, 5.0 * scale, rotateVectorAround(v0.x, v0.y, 30 * mirror, vr)));
            points.push(scaleVectorRelativeTo(v0.x, v0.y, 4.5 * scale, rotateVectorAround(v0.x, v0.y, 20 * mirror, vr)));
            points.push(scaleVectorRelativeTo(v0.x, v0.y, 4.5 * scale, rotateVectorAround(v0.x, v0.y, 0 * mirror, vr)));
            points.push(scaleVectorRelativeTo(v0.x, v0.y, 4.2 * scale, rotateVectorAround(v0.x, v0.y, 0 * mirror, vr)));
            points.push(scaleVectorRelativeTo(v0.x, v0.y, 3 * scale, rotateVectorAround(v0.x, v0.y, 0 * mirror, vr)));
            points.push(scaleVectorRelativeTo(v0.x, v0.y, 2 * scale, rotateVectorAround(v0.x, v0.y, 0 * mirror, vr)));
            points.push(scaleVectorRelativeTo(v0.x, v0.y, 0.5 * scale, rotateVectorAround(v0.x, v0.y, 0 * mirror, vr)));
            points.push(scaleVectorRelativeTo(v0.x, v0.y, 0 * scale, rotateVectorAround(v0.x, v0.y, 0 * mirror, vr)));
            points.push(v0);
        }
        g.strokeWeight(5);
        g.stroke(c);
        g.fill(c);
        g.beginShape();
        for (const vert of points) {
            g.curveVertex(vert.x, vert.y);
        }
        g.endShape();
        let pointsLeaf = [];
        for (var mirror = -1; mirror < 2; mirror += 2) {
            pointsLeaf.push(v0);
            pointsLeaf.push(scaleVectorRelativeTo(v0.x, v0.y, 0.5 * scale, rotateVectorAround(v0.x, v0.y, 80 * mirror, vr)));
            pointsLeaf.push(scaleVectorRelativeTo(v0.x, v0.y, 1.3 * scale, rotateVectorAround(v0.x, v0.y, 50 * mirror, vr)));
            pointsLeaf.push(scaleVectorRelativeTo(v0.x, v0.y, 2.0 * scale, rotateVectorAround(v0.x, v0.y, 40 * mirror, vr)));
            pointsLeaf.push(scaleVectorRelativeTo(v0.x, v0.y, 3.0 * scale, rotateVectorAround(v0.x, v0.y, 25 * mirror, vr)));
            pointsLeaf.push(scaleVectorRelativeTo(v0.x, v0.y, 4.0 * scale, rotateVectorAround(v0.x, v0.y, 15 * mirror, vr)));
            pointsLeaf.push(scaleVectorRelativeTo(v0.x, v0.y, 5.0 * scale, rotateVectorAround(v0.x, v0.y, 8 * mirror, vr)));
            pointsLeaf.push(scaleVectorRelativeTo(v0.x, v0.y, 5.5 * scale, rotateVectorAround(v0.x, v0.y, 0 * mirror, vr)));
            pointsLeaf.push(scaleVectorRelativeTo(v0.x, v0.y, 5.3 * scale, rotateVectorAround(v0.x, v0.y, 0 * mirror, vr)));
            pointsLeaf.push(scaleVectorRelativeTo(v0.x, v0.y, 4.5 * scale, rotateVectorAround(v0.x, v0.y, 0 * mirror, vr)));
            pointsLeaf.push(scaleVectorRelativeTo(v0.x, v0.y, 3.5 * scale, rotateVectorAround(v0.x, v0.y, 0 * mirror, vr)));
            pointsLeaf.push(scaleVectorRelativeTo(v0.x, v0.y, 2.0 * scale, rotateVectorAround(v0.x, v0.y, 0 * mirror, vr)));
            pointsLeaf.push(scaleVectorRelativeTo(v0.x, v0.y, 0.5 * scale, rotateVectorAround(v0.x, v0.y, 0 * mirror, vr)));
            pointsLeaf.push(scaleVectorRelativeTo(v0.x, v0.y, 0.0 * scale, rotateVectorAround(v0.x, v0.y, 0 * mirror, vr)));
            pointsLeaf.push(v0);
        }
        g.strokeWeight(5);
        g.stroke(mC);
        g.fill(mC);
        g.beginShape();
        for (const vert of pointsLeaf) {
            g.curveVertex(vert.x, vert.y);
        }
        g.endShape();
    }
}
class StartingPointPicker {
    getStartingPoint() {
        var p;
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
    isTooClose(position) {
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
function randomPointOnCircleEdge(max_r, w, h) {
    let theta = random() * 2.0 * PI;
    let r = max_r;
    let x = w / 2.0 + r * cos(theta);
    let y = h / 2.0 + r * sin(theta);
    let vec = createVector(x, y);
    return vec;
}
function randomPointInCircle(max_r, w, h) {
    let theta = random() * 2.0 * PI;
    let r = sqrt(random()) * max_r;
    let x = w / 2.0 + r * cos(theta);
    let y = h / 2.0 + r * sin(theta);
    let vec = createVector(x, y);
    return vec;
}
function pointOnCircleEdge(max_r, w, h, angle) {
    let r = max_r;
    let x = w / 2.0 + r * cos(angle);
    let y = h / 2.0 - r * sin(angle);
    let vec = createVector(x, y);
    return vec;
}
function rotateVectorAround(cx, cy, angle, p) {
    var s = sin(angle);
    var c = cos(angle);
    let newP = p.copy();
    newP.x -= cx;
    newP.y -= cy;
    var xnew = newP.x * c - newP.y * s;
    var ynew = newP.x * s + newP.y * c;
    newP.x = xnew + cx;
    newP.y = ynew + cy;
    return newP;
}
function scaleVectorRelativeTo(x, y, scaleFactor, vecToScale) {
    let p0 = createVector(x, y);
    let vts = vecToScale.copy();
    let rel_vec = vts.copy().sub(p0);
    let p2 = p0.copy().add(rel_vec.mult(scaleFactor));
    return p2;
}
var noiseScale = 800;
var noiseStrenght = 1;
;
var maxCurves = 200;
var numSegmentsPerCurve = 40;
var segmentLength = 10;
var minDistance = 70;
var minimumSegments = 3;
let sideBuffer = -200;
let g;
let curves = [];
var spp;
function setup() {
    let renderW = 2000;
    let renderH = 2000;
    let displayW = 1000;
    createCanvas(displayW, displayW / (renderW / renderH));
    g = createGraphics(renderW, renderH);
    g.background(242, 255, 191);
    frameRate(300);
    angleMode(DEGREES);
    colorMode(HSB, 360, 100, 100, 100);
    spp = new StartingPointPicker();
}
function draw() {
    if (curves.length < maxCurves) {
        var start = spp.getStartingPoint();
        if (start != null) {
            let col = color(random(83, 130), random(50, 100), random(50, 80), 100);
            var c = new CurveTulip(start, col, 10, 8);
            curves.push(c);
            c.computeVertecies();
            c.draw();
        }
    }
    image(g, 0, 0, width, height);
}
function keyPressed() {
    if (key == 's') {
        saveCanvas(g, "canvas.png");
    }
}
//# sourceMappingURL=build.js.map
class Curve {
    constructor(start, limiter) {
        this.start = start;
        this.vertices = [];
        this.limiter = limiter;
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
        return this.limiter.isInLimit(position) ? true : false;
    }
}
class Limiter {
    constructor(dist) {
        this.dist = dist;
    }
}
class CircleLimiter extends Limiter {
    isInLimit(pos) {
        return this.checkCircularBoundingBox(pos, this.dist);
    }
    checkCircularBoundingBox(position, radius) {
        let dist = createVector(g.width / 2, g.height / 2).dist(position);
        return dist > radius ? true : false;
    }
}
class RectLimiter extends Limiter {
    isInLimit(pos) {
        return this.checkBoundingBox(pos, this.dist);
    }
    checkBoundingBox(position, sideBuffer) {
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
class StartingPointPicker {
    getStartingPoint() {
        var p;
        var maxAttempts = 1000;
        var attempts = 0;
        do {
            p = createVector(random(-200, g.width + 200), random(-200, g.height + 200));
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
var maxCurves = 300;
var numSegmentsPerCurve = 30;
var segmentLength = 10;
var minDistance = 70;
var minimumSegments = 3;
let sideBuffer = 800;
let g;
let curves = [];
var spp;
var limiter;
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
    limiter = new CircleLimiter(sideBuffer);
}
function draw() {
    if (curves.length >= maxCurves) {
        noLoop();
        return;
    }
    var start = spp.getStartingPoint();
    if (start != null) {
        var c = new Curve(start, limiter);
        curves.push(c);
        c.computeVertecies();
        var renderer;
        var type = floor(random(0, 2));
        switch (type) {
            case 0:
                renderer = createTulipRenderer(c);
                break;
            case 1:
                renderer = createRoseRenderer(c);
                break;
            default: break;
        }
        renderer.draw();
    }
    image(g, 0, 0, width, height);
}
function keyPressed() {
    if (key == 's') {
        saveCanvas(g, "canvas.png");
    }
}
function createRoseRenderer(curve) {
    let angle = noise(curve.position.x / noiseScale, curve.position.y / noiseScale) *
        TWO_PI *
        noiseStrenght;
    let nA = map(degrees(angle), 0, 360, 0, 1);
    let col_hue = nA > 0.5 ? map(nA, 0, 1, 305, 360) : map(nA, 0, 1, 0, 42);
    let col_sat = random(10, 100);
    let col_bri = 100;
    let curveLength = curve.vertices.length;
    let nLength = map(curveLength, minimumSegments, numSegmentsPerCurve, 0.8, 1.2);
    let ls = floor(random(5, 7));
    var leafSpacing = createVector(ls, ls);
    var leafOffset = createVector(floor(random(1, 5)), floor(random(1, 5)));
    var leafSize = 5.3 * nLength;
    var flowerHeadSize = 2 * nLength;
    var stemWeight = 8 * nLength;
    var leafWeight = 8 * nLength;
    var headWeight = 3 * nLength;
    var stemColor = color(random(83, 130), random(50, 100), random(40, 70), 100);
    var leafColor = color(random(83, 130), random(50, 100), random(30, 60), 100);
    var headColorMain = color(col_hue, col_sat, col_bri * 0.9, 100);
    var headColorAccent = color(col_hue, col_sat, col_bri * 1.0, 100);
    var c = new CurveRendererRose(curve, leafSpacing, leafOffset, leafSize, flowerHeadSize, stemWeight, leafWeight, headWeight, stemColor, leafColor, headColorMain, headColorAccent);
    return c;
}
function createTulipRenderer(curve) {
    let angle = noise(curve.position.x / noiseScale, curve.position.y / noiseScale) *
        TWO_PI *
        noiseStrenght;
    let nA = map(degrees(angle), 0, 360, 0, 1);
    let col_hue = nA > 0.5 ? map(nA, 0, 1, 275, 360) : map(nA, 0, 1, 0, 49);
    let col_sat = random(20, 100);
    let col_bri = 100;
    let curveLength = curve.vertices.length;
    let nLength = map(curveLength, minimumSegments, numSegmentsPerCurve, 0.8, 1.2);
    var leafSpacing = createVector(14, 14);
    var leafOffset = createVector(3, 10);
    var leafSize = 1.5 * nLength;
    var flowerHeadSize = 1.9 * nLength;
    var stemWeight = 8 * nLength;
    var leafWeight = 8 * nLength;
    var headWeight = 3 * nLength;
    var stemColor = color(random(83, 130), random(50, 100), random(50, 80), 100);
    var leafColor = color(random(83, 130), random(50, 100), random(50, 80), 100);
    var headColorMain = color(col_hue, col_sat, col_bri * 0.9, 100);
    var headColorAccent = color(col_hue, col_sat, col_bri * 1.0, 100);
    var c = new CurveRendererTulip(curve, leafSpacing, leafOffset, leafSize, flowerHeadSize, stemWeight, leafWeight, headWeight, stemColor, leafColor, headColorMain, headColorAccent);
    return c;
}
function createBasicRenderer(curve) {
    var stemWeight = randomGaussian(10, 2);
    var leafWeight = 8;
    var stemColor = color(random(83, 130), random(50, 100), random(50, 80), 100);
    var c = new CurveRendererBasic(curve, stemColor, stemWeight, leafWeight);
    return c;
}
class CurveRenderer {
    constructor(curve, weight, c) {
        this.curve = curve;
        this.col = c;
        this.weight = weight;
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
        for (const vert of this.curve.vertices) {
            g.vertex(vert.x, vert.y);
        }
        g.endShape();
    }
    canDrawCurve() {
        return this.curve.vertices.length > minimumSegments;
    }
}
class CurveRendererBasic extends CurveRenderer {
    constructor(curve, c, weight, leafWeight) {
        super(curve, weight, c);
        this.leafWeight = leafWeight;
    }
    draw() {
        if (this.canDrawCurve()) {
            this.drawLeaves();
            this.drawCurve();
            this.drawFlowerHead(this.curve.position.x, this.curve.position.y, 30);
        }
    }
    drawLeaves() {
        for (var i = 0; i < this.curve.vertices.length; i++) {
            if (i % 8 == 0) {
                let angle = random() > 0.5 ? 20 : -20;
                this.drawLeaf(i, 8, angle);
            }
        }
    }
    drawLeaf(index, lookahead, angle) {
        if (this.curve.vertices.length <= index + lookahead)
            return;
        g.strokeWeight(this.leafWeight);
        g.stroke(color(random(83, 130), random(50, 100), random(50, 100), 100));
        let v0 = this.curve.vertices[index];
        let v1 = this.curve.vertices[index + lookahead];
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
class CurveRendererRose extends CurveRenderer {
    constructor(curve, leafSpacing, leafOffset, leafSize, flowerHeadSize, stemWeight, leafWeight, headWeight, stemColor, leafColor, headColorMain, headColorAccent) {
        super(curve, stemWeight, stemColor);
        this.leafWeight = leafWeight;
        this.headWeight = headWeight;
        this.leafColor = leafColor;
        this.leafSize = leafSize;
        this.flowerHeadSize = flowerHeadSize;
        this.leafSpacing = leafSpacing;
        this.headColorMain = headColorMain;
        this.headColorAccent = headColorAccent;
        this.leafOffset = leafOffset;
    }
    draw() {
        if (this.canDrawCurve()) {
            this.drawLeaves();
            this.drawCurve();
            this.drawFlowerHead(this.curve.position.x, this.curve.position.y, this.flowerHeadSize);
        }
    }
    drawLeaves() {
        for (var i = this.leafOffset.x; i < this.curve.vertices.length - 5; i += this.leafSpacing.x) {
            this.drawLeaf(i, 1, true, this.leafSize);
        }
        for (var i = this.leafOffset.y; i < this.curve.vertices.length - 5; i += this.leafSpacing.y) {
            this.drawLeaf(i, 1, false, this.leafSize);
        }
    }
    drawLeaf(index, lookahead, leafSide, scale) {
        if (this.curve.vertices.length <= index + lookahead)
            return;
        let c = this.leafColor;
        let v0 = this.curve.vertices[index];
        let v1 = this.curve.vertices[index + lookahead];
        if (v0 == undefined || v1 == undefined) {
            return;
        }
        let vr = v0.copy().add(v1).div(2);
        let points = [];
        let sideFact = leafSide ? 1 : -1;
        points.push(v0);
        points.push(scaleVectorRelativeTo(v0.x, v0.y, 0.01 * scale, rotateVectorAround(v0.x, v0.y, 70 * sideFact, vr)));
        points.push(scaleVectorRelativeTo(v0.x, v0.y, 0.1 * scale, rotateVectorAround(v0.x, v0.y, 70 * sideFact, vr)));
        points.push(scaleVectorRelativeTo(v0.x, v0.y, 0.4 * scale, rotateVectorAround(v0.x, v0.y, 70 * sideFact, vr)));
        points.push(scaleVectorRelativeTo(v0.x, v0.y, 0.6 * scale, rotateVectorAround(v0.x, v0.y, 65 * sideFact, vr)));
        points.push(scaleVectorRelativeTo(v0.x, v0.y, 1.0 * scale, rotateVectorAround(v0.x, v0.y, 55 * sideFact, vr)));
        points.push(scaleVectorRelativeTo(v0.x, v0.y, 1.1 * scale, rotateVectorAround(v0.x, v0.y, 50 * sideFact, vr)));
        let endPoint = scaleVectorRelativeTo(v0.x, v0.y, 1.2 * scale, rotateVectorAround(v0.x, v0.y, 47 * sideFact, vr));
        points.push(endPoint);
        points.push(scaleVectorRelativeTo(v0.x, v0.y, 0.8 * scale, rotateVectorAround(v0.x, v0.y, 35 * sideFact, vr)));
        points.push(scaleVectorRelativeTo(v0.x, v0.y, 0.5 * scale, rotateVectorAround(v0.x, v0.y, 25 * sideFact, vr)));
        points.push(scaleVectorRelativeTo(v0.x, v0.y, 0.3 * scale, rotateVectorAround(v0.x, v0.y, 15 * sideFact, vr)));
        points.push(scaleVectorRelativeTo(v0.x, v0.y, 0.2 * scale, rotateVectorAround(v0.x, v0.y, 11 * sideFact, vr)));
        points.push(scaleVectorRelativeTo(v0.x, v0.y, 0.1 * scale, rotateVectorAround(v0.x, v0.y, 0 * sideFact, vr)));
        g.stroke(this.leafColor);
        g.strokeWeight(8);
        g.fill(c);
        g.beginShape();
        for (const vert of points) {
            g.curveVertex(vert.x, vert.y);
        }
        g.endShape();
        let pE = scaleVectorRelativeTo(v0.x, v0.y, 0.9, endPoint);
        let darken = 0.9;
        colorMode(RGB);
        let veinColor = color(red(this.leafColor) * darken, green(this.leafColor) * darken, blue(this.leafColor) * darken);
        g.stroke(veinColor);
        g.strokeWeight(5);
        g.line(v0.x, v0.y, pE.x, pE.y);
        colorMode(HSB);
    }
    drawFlowerHead(x, y, scale) {
        scale *= -1;
        let vertLen = this.curve.vertices.length;
        if (vertLen < 3)
            return;
        let v0 = this.curve.vertices[vertLen - 1];
        let v1 = this.curve.vertices[vertLen - 2];
        let vr = v0.copy().add(v1).div(2);
        let endPoint;
        let points = [];
        for (var mirror = -1; mirror < 2; mirror += 2) {
            points.push(v0);
            points.push(scaleVectorRelativeTo(v0.x, v0.y, 0.5 * scale, rotateVectorAround(v0.x, v0.y, 80 * mirror, vr)));
            points.push(scaleVectorRelativeTo(v0.x, v0.y, 1.5 * scale, rotateVectorAround(v0.x, v0.y, 80 * mirror, vr)));
            points.push(scaleVectorRelativeTo(v0.x, v0.y, 2.5 * scale, rotateVectorAround(v0.x, v0.y, 60 * mirror, vr)));
            points.push(scaleVectorRelativeTo(v0.x, v0.y, 3.3 * scale, rotateVectorAround(v0.x, v0.y, 40 * mirror, vr)));
            points.push(scaleVectorRelativeTo(v0.x, v0.y, 4.5 * scale, rotateVectorAround(v0.x, v0.y, 20 * mirror, vr)));
            points.push(scaleVectorRelativeTo(v0.x, v0.y, 4.9 * scale, rotateVectorAround(v0.x, v0.y, 10 * mirror, vr)));
            endPoint = scaleVectorRelativeTo(v0.x, v0.y, 4.7 * scale, rotateVectorAround(v0.x, v0.y, 0 * mirror, vr));
            points.push(endPoint);
            points.push(scaleVectorRelativeTo(v0.x, v0.y, 4.2 * scale, rotateVectorAround(v0.x, v0.y, 0 * mirror, vr)));
            points.push(scaleVectorRelativeTo(v0.x, v0.y, 3 * scale, rotateVectorAround(v0.x, v0.y, 0 * mirror, vr)));
            points.push(scaleVectorRelativeTo(v0.x, v0.y, 2 * scale, rotateVectorAround(v0.x, v0.y, 0 * mirror, vr)));
            points.push(scaleVectorRelativeTo(v0.x, v0.y, 0.5 * scale, rotateVectorAround(v0.x, v0.y, 0 * mirror, vr)));
            points.push(scaleVectorRelativeTo(v0.x, v0.y, 0 * scale, rotateVectorAround(v0.x, v0.y, 0 * mirror, vr)));
            points.push(v0);
        }
        g.stroke(this.headColorMain);
        g.strokeWeight(this.headWeight);
        g.fill(this.headColorMain);
        g.beginShape();
        for (const vert of points) {
            g.curveVertex(vert.x, vert.y);
        }
        g.endShape();
        let darken = 0.8;
        colorMode(RGB);
        let v2 = color(red(this.headColorMain) * darken, green(this.headColorMain) * darken, blue(this.headColorMain) * darken);
        let sw = abs(scale) * 1.5;
        g.stroke(v2);
        g.strokeWeight(sw);
        g.noFill();
        colorMode(HSB);
        let pC = scaleVectorRelativeTo(v0.x, v0.y, 0.75, endPoint);
        g.ellipse(pC.x, pC.y, scale * 10, scale * 10);
        g.ellipse(pC.x, pC.y, scale * 5, scale * 5);
        let pl = [];
        for (var mirror = -1; mirror < 2; mirror += 2) {
            pl.push(v0);
            pl.push(scaleVectorRelativeTo(v0.x, v0.y, 0.5 * scale, rotateVectorAround(v0.x, v0.y, 80 * mirror, vr)));
            pl.push(scaleVectorRelativeTo(v0.x, v0.y, 1.5 * scale, rotateVectorAround(v0.x, v0.y, 80 * mirror, vr)));
            pl.push(scaleVectorRelativeTo(v0.x, v0.y, 2.5 * scale, rotateVectorAround(v0.x, v0.y, 60 * mirror, vr)));
            pl.push(scaleVectorRelativeTo(v0.x, v0.y, 3.3 * scale, rotateVectorAround(v0.x, v0.y, 40 * mirror, vr)));
            pl.push(scaleVectorRelativeTo(v0.x, v0.y, 3.7 * scale, rotateVectorAround(v0.x, v0.y, 35 * mirror, vr)));
            pl.push(scaleVectorRelativeTo(v0.x, v0.y, 4.6 * scale, rotateVectorAround(v0.x, v0.y, 25 * mirror, vr)));
            pl.push(scaleVectorRelativeTo(v0.x, v0.y, 3.0 * scale, rotateVectorAround(v0.x, v0.y, 15 * mirror, vr)));
            pl.push(scaleVectorRelativeTo(v0.x, v0.y, 1.5 * scale, rotateVectorAround(v0.x, v0.y, 5 * mirror, vr)));
            pl.push(scaleVectorRelativeTo(v0.x, v0.y, 0.5 * scale, rotateVectorAround(v0.x, v0.y, 0 * mirror, vr)));
            pl.push(scaleVectorRelativeTo(v0.x, v0.y, 0.0 * scale, rotateVectorAround(v0.x, v0.y, 0 * mirror, vr)));
            pl.push(v0);
        }
        g.strokeWeight(this.headWeight);
        g.stroke(this.headColorAccent);
        g.fill(this.headColorAccent);
        g.beginShape();
        for (const vert of pl) {
            g.curveVertex(vert.x, vert.y);
        }
        g.endShape();
    }
}
class CurveRendererTulip extends CurveRenderer {
    constructor(curve, leafSpacing, leafOffset, leafSize, flowerHeadSize, stemWeight, leafWeight, headWeight, stemColor, leafColor, headColorMain, headColorAccent) {
        super(curve, stemWeight, stemColor);
        this.leafWeight = leafWeight;
        this.headWeight = headWeight;
        this.leafColor = leafColor;
        this.leafSize = leafSize;
        this.flowerHeadSize = flowerHeadSize;
        this.leafSpacing = leafSpacing;
        this.headColorMain = headColorMain;
        this.headColorAccent = headColorAccent;
        this.leafOffset = leafOffset;
    }
    draw() {
        if (this.canDrawCurve()) {
            this.drawLeaves();
            this.drawCurve();
            this.drawFlowerHead(this.curve.position.x, this.curve.position.y, this.flowerHeadSize);
        }
    }
    drawLeaves() {
        for (var i = this.leafOffset.x; i < this.curve.vertices.length - 5; i += this.leafSpacing.x) {
            this.drawLeaf(i, 4, true, this.leafSize);
        }
        for (var i = this.leafOffset.y; i < this.curve.vertices.length - 5; i += this.leafSpacing.y) {
            this.drawLeaf(i, 4, false, this.leafSize);
        }
    }
    drawLeaf(index, lookahead, leafSide, scale) {
        if (this.curve.vertices.length <= index + lookahead)
            return;
        let c = this.leafColor;
        let v0 = this.curve.vertices[index];
        let v1 = this.curve.vertices[index + lookahead];
        if (v0 == undefined || v1 == undefined) {
            return;
        }
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
        g.stroke(this.leafColor);
        g.strokeWeight(8);
        g.fill(c);
        g.beginShape();
        for (const vert of points) {
            g.curveVertex(vert.x, vert.y);
        }
        g.endShape();
    }
    drawFlowerHead(x, y, scale) {
        scale *= -1;
        let vertLen = this.curve.vertices.length;
        if (vertLen < 3)
            return;
        let v0 = this.curve.vertices[vertLen - 1];
        let v1 = this.curve.vertices[vertLen - 2];
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
        g.stroke(this.headColorMain);
        g.strokeWeight(this.headWeight);
        g.fill(this.headColorMain);
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
        g.noStroke();
        g.fill(this.headColorAccent);
        g.beginShape();
        for (const vert of pointsLeaf) {
            g.curveVertex(vert.x, vert.y);
        }
        g.endShape();
    }
}
//# sourceMappingURL=build.js.map
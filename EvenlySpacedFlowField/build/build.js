let dimx = 1000;
let dimy = 1000;
var noiseScale = 500;
var noiseStrenght = 1;
;
var maxCurves = 600;
var numSegmentsPerCurve = 300;
var segmentLength = 10;
var minDistance = 20;
var curveStrokeWeight = 5;
let g;
let curves = [];
var spp;
function setup() {
    let renderW = 2000;
    let renderH = 2000;
    let displayW = 1000;
    createCanvas(displayW, displayW / (renderW / renderH));
    g = createGraphics(renderW, renderH);
    g.background(255);
    frameRate(300);
    spp = new StartingPointPicker();
}
function draw() {
    if (curves.length < maxCurves) {
        var start = spp.getStartingPoint();
        if (start != null) {
            var c = new Curve(start, color(0));
            c.draw();
            curves.push(c);
        }
    }
    image(g, 0, 0, width, height);
}


class Curve {
    constructor(start, c) {
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
            let angle = noise(this.position.x / noiseScale, this.position.y / noiseScale) *
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


class StartingPointPicker {
    getStartingPoint() {
        var p;
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


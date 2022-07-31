var Curve = (function () {
    function Curve(start, c) {
        this.start = start;
        this.c = c;
        this.vertices = [];
    }
    Curve.prototype.draw = function () {
        this.position = this.start.copy();
        g.beginShape();
        g.noFill();
        g.strokeWeight(curveStrokeWeight);
        g.stroke(this.c);
        g.vertex(this.position.x, this.position.y);
        this.vertices.push(this.position.copy());
        for (var i = 0; i < numSegmentsPerCurve; i++) {
            var angle = noise(this.position.x / noiseScale, this.position.y / noiseScale) *
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
    };
    Curve.prototype.isTooClose = function (position) {
        for (var _i = 0, curves_1 = curves; _i < curves_1.length; _i++) {
            var curv = curves_1[_i];
            if (curv === this) {
                continue;
            }
            for (var _a = 0, _b = curv.vertices; _a < _b.length; _a++) {
                var vert = _b[_a];
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
    };
    return Curve;
}());
var StartingPointPicker = (function () {
    function StartingPointPicker() {
    }
    StartingPointPicker.prototype.getStartingPoint = function () {
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
    };
    StartingPointPicker.prototype.isTooClose = function (position) {
        for (var _i = 0, curves_2 = curves; _i < curves_2.length; _i++) {
            var curv = curves_2[_i];
            for (var _a = 0, _b = curv.vertices; _a < _b.length; _a++) {
                var vert = _b[_a];
                var distance = position.dist(vert);
                if (distance < minDistance) {
                    return true;
                }
            }
        }
        return false;
    };
    return StartingPointPicker;
}());
var dimx = 1000;
var dimy = 1000;
var noiseScale = 500;
var noiseStrenght = 1;
;
var maxCurves = 600;
var numSegmentsPerCurve = 300;
var segmentLength = 10;
var minDistance = 20;
var curveStrokeWeight = 5;
var g;
var curves = [];
var spp;
function setup() {
    var renderW = 2000;
    var renderH = 2000;
    var displayW = 1000;
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
//# sourceMappingURL=build.js.map
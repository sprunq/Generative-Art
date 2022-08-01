var Curve = (function () {
    function Curve(start, c, weight) {
        this.start = start;
        this.col = c;
        this.vertices = [];
        this.weight = weight;
    }
    Curve.prototype.computeVertecies = function () {
        this.position = this.start.copy();
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
            this.vertices.push(this.position.copy());
        }
    };
    Curve.prototype.draw = function () {
        if (this.canDrawCurve())
            this.drawCurve();
    };
    Curve.prototype.drawCurve = function () {
        g.beginShape();
        g.noFill();
        g.strokeWeight(this.weight);
        g.stroke(this.col);
        for (var _i = 0, _a = this.vertices; _i < _a.length; _i++) {
            var vert = _a[_i];
            g.vertex(vert.x, vert.y);
        }
        g.endShape();
    };
    Curve.prototype.canDrawCurve = function () {
        return this.vertices.length > minimumSegments;
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
    };
    return Curve;
}());
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var CurveBasicFlower = (function (_super) {
    __extends(CurveBasicFlower, _super);
    function CurveBasicFlower(start, c, weight, leafWeight) {
        var _this = _super.call(this, start, c, weight) || this;
        _this.leafWeight = leafWeight;
        return _this;
    }
    CurveBasicFlower.prototype.draw = function () {
        if (this.canDrawCurve()) {
            this.drawLeaves();
            this.drawCurve();
            this.drawFlowerHead(this.position.x, this.position.y, 30);
        }
    };
    CurveBasicFlower.prototype.drawLeaves = function () {
        for (var i = 0; i < this.vertices.length; i++) {
            if (i % 8 == 0) {
                var angle = random() > 0.5 ? 20 : -20;
                this.drawLeaf(i, 8, angle);
            }
        }
    };
    CurveBasicFlower.prototype.drawLeaf = function (index, lookahead, angle) {
        if (this.vertices.length <= index + lookahead)
            return;
        g.strokeWeight(this.leafWeight);
        g.stroke(color(49, 176, 58));
        var v0 = this.vertices[index];
        var v1 = this.vertices[index + lookahead];
        var vr = v0.copy().add(v1).div(2);
        var p2 = rotateVectorAround(v0.x, v0.y, angle, vr);
        g.line(v0.x, v0.y, p2.x, p2.y);
    };
    CurveBasicFlower.prototype.drawFlowerHead = function (x, y, size) {
        g.noStroke();
        g.fill(random(255), random(30), random(255));
        g.ellipse(x + 10, y, size, size);
        g.ellipse(x - 5, y + 5, size, size);
        g.ellipse(x - 15, y - 5, size, size);
        g.ellipse(x - 7, y - 20, size, size);
        g.ellipse(x + 10, y - 15, size, size);
        g.fill(225, random(225), random(225));
        g.ellipse(x - 2, y - 7, 22, 22);
    };
    return CurveBasicFlower;
}(Curve));
var CurveSandbox = (function (_super) {
    __extends(CurveSandbox, _super);
    function CurveSandbox(start, c, weight, leafWeight) {
        var _this = _super.call(this, start, c, weight) || this;
        _this.leafWeight = leafWeight;
        return _this;
    }
    CurveSandbox.prototype.draw = function () {
        if (this.canDrawCurve()) {
            this.drawLeaves();
            this.drawCurve();
            this.drawFlowerHead(this.position.x, this.position.y, 2);
        }
    };
    CurveSandbox.prototype.drawLeaves = function () {
        var sideChange = true;
        for (var i = 0; i < this.vertices.length; i++) {
            if (i % 8 == 0) {
                var side = sideChange ? true : false;
                sideChange = !sideChange;
                this.drawLeaf(i, 8, side, 0.8);
            }
        }
    };
    CurveSandbox.prototype.drawLeaf = function (index, lookahead, leafSide, scale) {
        if (this.vertices.length <= index + lookahead)
            return;
        var c = color(random(83, 130), random(20, 100), random(50, 100), 100);
        var v0 = this.vertices[index];
        var v1 = this.vertices[index + lookahead];
        var vr = v0.copy().add(v1).div(2);
        var points = [];
        var sideFact = leafSide ? 1 : -1;
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
        for (var _i = 0, points_1 = points; _i < points_1.length; _i++) {
            var vert = points_1[_i];
            g.vertex(vert.x, vert.y);
        }
        g.endShape();
    };
    CurveSandbox.prototype.drawFlowerHead = function (x, y, scale) {
        var col_hue = random() < 0.5 ? random(275, 359) : random(0, 49);
        var col_sat = random(20, 100);
        var col_bri = 100;
        var c = color(col_hue, col_sat, col_bri * 0.9, 100);
        var mC = color(col_hue, col_sat, col_bri * 1.0, 100);
        scale *= -1;
        var vertLen = this.vertices.length;
        if (vertLen < 3)
            return;
        var v0 = this.vertices[vertLen - 1];
        var v1 = this.vertices[vertLen - 2];
        var vr = v0.copy().add(v1).div(2);
        var points = [];
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
        for (var _i = 0, points_2 = points; _i < points_2.length; _i++) {
            var vert = points_2[_i];
            g.curveVertex(vert.x, vert.y);
        }
        g.endShape();
        var pointsLeaf = [];
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
        for (var _a = 0, pointsLeaf_1 = pointsLeaf; _a < pointsLeaf_1.length; _a++) {
            var vert = pointsLeaf_1[_a];
            g.curveVertex(vert.x, vert.y);
        }
        g.endShape();
    };
    return CurveSandbox;
}(Curve));
var CurveTulip = (function (_super) {
    __extends(CurveTulip, _super);
    function CurveTulip(start, c, weight, leafWeight) {
        var _this = _super.call(this, start, c, weight) || this;
        _this.leafWeight = leafWeight;
        _this.leafColor = color(random(83, 130), random(50, 100), random(50, 100), 100);
        return _this;
    }
    CurveTulip.prototype.draw = function () {
        if (this.canDrawCurve()) {
            this.drawLeaves();
            this.drawCurve();
            this.drawFlowerHead(this.position.x, this.position.y, random(1.9, 2.3));
        }
    };
    CurveTulip.prototype.drawLeaves = function () {
        var sideChange = true;
        for (var i = 0; i < this.vertices.length; i++) {
            if (i % 8 == 0) {
                var side = sideChange ? true : false;
                sideChange = !sideChange;
                this.drawLeaf(i, 8, side, random(0.8, 1.0));
            }
        }
    };
    CurveTulip.prototype.drawLeaf = function (index, lookahead, leafSide, scale) {
        if (this.vertices.length <= index + lookahead)
            return;
        var c = this.leafColor;
        var v0 = this.vertices[index];
        var v1 = this.vertices[index + lookahead];
        var vr = v0.copy().add(v1).div(2);
        var points = [];
        var sideFact = leafSide ? 1 : -1;
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
        for (var _i = 0, points_3 = points; _i < points_3.length; _i++) {
            var vert = points_3[_i];
            g.curveVertex(vert.x, vert.y);
        }
        g.endShape();
    };
    CurveTulip.prototype.drawFlowerHead = function (x, y, scale) {
        var col_hue = random() < 0.5 ? random(275, 359) : random(0, 49);
        var col_sat = random(20, 100);
        var col_bri = 100;
        var c = color(col_hue, col_sat, col_bri * 0.9, 100);
        var mC = color(col_hue, col_sat, col_bri * 1.0, 100);
        scale *= -1;
        var vertLen = this.vertices.length;
        if (vertLen < 3)
            return;
        var v0 = this.vertices[vertLen - 1];
        var v1 = this.vertices[vertLen - 2];
        var vr = v0.copy().add(v1).div(2);
        var points = [];
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
        for (var _i = 0, points_4 = points; _i < points_4.length; _i++) {
            var vert = points_4[_i];
            g.curveVertex(vert.x, vert.y);
        }
        g.endShape();
        var pointsLeaf = [];
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
        for (var _a = 0, pointsLeaf_2 = pointsLeaf; _a < pointsLeaf_2.length; _a++) {
            var vert = pointsLeaf_2[_a];
            g.curveVertex(vert.x, vert.y);
        }
        g.endShape();
    };
    return CurveTulip;
}(Curve));
var StartingPointPicker = (function () {
    function StartingPointPicker() {
    }
    StartingPointPicker.prototype.getStartingPoint = function () {
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
function randomPointOnCircleEdge(max_r, w, h) {
    var theta = random() * 2.0 * PI;
    var r = max_r;
    var x = w / 2.0 + r * cos(theta);
    var y = h / 2.0 + r * sin(theta);
    var vec = createVector(x, y);
    return vec;
}
function randomPointInCircle(max_r, w, h) {
    var theta = random() * 2.0 * PI;
    var r = sqrt(random()) * max_r;
    var x = w / 2.0 + r * cos(theta);
    var y = h / 2.0 + r * sin(theta);
    var vec = createVector(x, y);
    return vec;
}
function pointOnCircleEdge(max_r, w, h, angle) {
    var r = max_r;
    var x = w / 2.0 + r * cos(angle);
    var y = h / 2.0 - r * sin(angle);
    var vec = createVector(x, y);
    return vec;
}
function rotateVectorAround(cx, cy, angle, p) {
    var s = sin(angle);
    var c = cos(angle);
    var newP = p.copy();
    newP.x -= cx;
    newP.y -= cy;
    var xnew = newP.x * c - newP.y * s;
    var ynew = newP.x * s + newP.y * c;
    newP.x = xnew + cx;
    newP.y = ynew + cy;
    return newP;
}
function scaleVectorRelativeTo(x, y, scaleFactor, vecToScale) {
    var p0 = createVector(x, y);
    var vts = vecToScale.copy();
    var rel_vec = vts.copy().sub(p0);
    var p2 = p0.copy().add(rel_vec.mult(scaleFactor));
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
var sideBuffer = -200;
var g;
var curves = [];
var spp;
function setup() {
    var renderW = 2000;
    var renderH = 2000;
    var displayW = 1000;
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
            var col = color(random(83, 130), random(50, 100), random(50, 80), 100);
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
class CurveRendererRose extends CurveRenderer {
    leafColor: p5.Color;
    leafSize: any;
    flowerHeadSize: any;
    leafWeight: number;
    headWeight: number;
    headColorMain: p5.Color;
    headColorAccent: p5.Color;
    leafSpacing: p5.Vector;
    leafOffset: p5.Vector;

    constructor(
        curve: Curve,
        leafSpacing: p5.Vector,
        leafOffset: p5.Vector,
        leafSize: number,
        flowerHeadSize: number,
        stemWeight: number,
        leafWeight: number,
        headWeight: number,
        stemColor: p5.Color,
        leafColor: p5.Color,
        headColorMain: p5.Color,
        headColorAccent: p5.Color,
    ) {
        super(curve, stemWeight, stemColor);
        this.leafWeight = leafWeight;
        this.headWeight = headWeight;
        this.leafColor = leafColor;
        this.leafSize = leafSize;
        this.flowerHeadSize = flowerHeadSize;
        this.leafSpacing = leafSpacing;
        this.headColorMain = headColorMain
        this.headColorAccent = headColorAccent
        this.leafOffset = leafOffset;
    }

    public draw() {
        if (this.canDrawCurve()) {
            this.drawLeaves();
            this.drawCurve();
            this.drawFlowerHead(this.curve.position.x, this.curve.position.y, this.flowerHeadSize);
        }
    }

    private drawLeaves() {
        for (var i = this.leafOffset.x; i < this.curve.vertices.length - 5; i += this.leafSpacing.x) {
            this.drawLeaf(i, 1, true, this.leafSize);
        }
        for (var i = this.leafOffset.y; i < this.curve.vertices.length - 5; i += this.leafSpacing.y) {
            this.drawLeaf(i, 1, false, this.leafSize);
        }
    }

    private drawLeaf(index: number, lookahead: number, leafSide: boolean, scale: number) {
        if (this.curve.vertices.length <= index + lookahead) return;
        let c = this.leafColor;

        let v0 = this.curve.vertices[index];
        let v1 = this.curve.vertices[index + lookahead];
        if (v0 == undefined || v1 == undefined) { return; }
        let vr = v0.copy().add(v1).div(2);

        let points: p5.Vector[] = [];
        let sideFact = leafSide ? 1 : -1;
        points.push(v0);
        points.push(scaleVectorRelativeTo(v0.x, v0.y, 0.01 * scale, rotateVectorAround(v0.x, v0.y, 70 * sideFact, vr)))
        points.push(scaleVectorRelativeTo(v0.x, v0.y, 0.1 * scale, rotateVectorAround(v0.x, v0.y, 70 * sideFact, vr)))
        points.push(scaleVectorRelativeTo(v0.x, v0.y, 0.4 * scale, rotateVectorAround(v0.x, v0.y, 70 * sideFact, vr)))
        points.push(scaleVectorRelativeTo(v0.x, v0.y, 0.6 * scale, rotateVectorAround(v0.x, v0.y, 65 * sideFact, vr)))
        points.push(scaleVectorRelativeTo(v0.x, v0.y, 1.0 * scale, rotateVectorAround(v0.x, v0.y, 55 * sideFact, vr)))
        points.push(scaleVectorRelativeTo(v0.x, v0.y, 1.1 * scale, rotateVectorAround(v0.x, v0.y, 50 * sideFact, vr)))
        let endPoint = scaleVectorRelativeTo(v0.x, v0.y, 1.2 * scale, rotateVectorAround(v0.x, v0.y, 47 * sideFact, vr));
        points.push(endPoint);
        points.push(scaleVectorRelativeTo(v0.x, v0.y, 0.8 * scale, rotateVectorAround(v0.x, v0.y, 35 * sideFact, vr)))
        points.push(scaleVectorRelativeTo(v0.x, v0.y, 0.5 * scale, rotateVectorAround(v0.x, v0.y, 25 * sideFact, vr)))
        points.push(scaleVectorRelativeTo(v0.x, v0.y, 0.3 * scale, rotateVectorAround(v0.x, v0.y, 15 * sideFact, vr)))
        points.push(scaleVectorRelativeTo(v0.x, v0.y, 0.2 * scale, rotateVectorAround(v0.x, v0.y, 11 * sideFact, vr)))
        points.push(scaleVectorRelativeTo(v0.x, v0.y, 0.1 * scale, rotateVectorAround(v0.x, v0.y, 0 * sideFact, vr)))

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

    private drawFlowerHead(x: number, y: number, scale: number) {
        scale *= -1;
        let vertLen = this.curve.vertices.length;
        if (vertLen < 3) return;
        let v0 = this.curve.vertices[vertLen - 1];
        let v1 = this.curve.vertices[vertLen - 2];
        let vr = v0.copy().add(v1).div(2);

        let endPoint;
        let points: p5.Vector[] = [];
        // Only contains the points for one half of the flower head
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

        let pl: p5.Vector[] = [];
        // Only contains the points for one half of the flower head
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
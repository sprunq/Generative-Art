class CurveTulip extends Curve {
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
        startPosition: p5.Vector,
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
        super(startPosition, stemColor, stemWeight);
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
            this.drawFlowerHead(this.position.x, this.position.y, this.flowerHeadSize);
        }
    }

    private drawLeaves() {
        for (var i = this.leafOffset.x; i < this.vertices.length; i += this.leafSpacing.x) {
            this.drawLeaf(i, 8, true, this.leafSize);
        }
        for (var i = this.leafOffset.y; i < this.vertices.length; i += this.leafSpacing.y) {
            this.drawLeaf(i, 8, false, this.leafSize);
        }
    }

    private drawLeaf(index: number, lookahead: number, leafSide: boolean, scale: number) {
        if (this.vertices.length <= index + lookahead) return;
        let c = this.leafColor;

        let v0 = this.vertices[index];
        let v1 = this.vertices[index + lookahead];
        if (v0 == undefined || v1 == undefined) { return; }
        let vr = v0.copy().add(v1).div(2);

        let points: p5.Vector[] = [];
        let sideFact = leafSide ? 1 : -1;
        points.push(v0);
        points.push(scaleVectorRelativeTo(v0.x, v0.y, 0.01 * scale, rotateVectorAround(v0.x, v0.y, 60 * sideFact, vr)))
        points.push(scaleVectorRelativeTo(v0.x, v0.y, 0.1 * scale, rotateVectorAround(v0.x, v0.y, 60 * sideFact, vr)))
        points.push(scaleVectorRelativeTo(v0.x, v0.y, 0.4 * scale, rotateVectorAround(v0.x, v0.y, 60 * sideFact, vr)))
        points.push(scaleVectorRelativeTo(v0.x, v0.y, 0.6 * scale, rotateVectorAround(v0.x, v0.y, 50 * sideFact, vr)))
        points.push(scaleVectorRelativeTo(v0.x, v0.y, 1.0 * scale, rotateVectorAround(v0.x, v0.y, 40 * sideFact, vr)))
        points.push(scaleVectorRelativeTo(v0.x, v0.y, 1.85 * scale, rotateVectorAround(v0.x, v0.y, 23 * sideFact, vr)))
        points.push(scaleVectorRelativeTo(v0.x, v0.y, 2.0 * scale, rotateVectorAround(v0.x, v0.y, 20 * sideFact, vr)))
        points.push(scaleVectorRelativeTo(v0.x, v0.y, 1.5 * scale, rotateVectorAround(v0.x, v0.y, 22 * sideFact, vr)))
        points.push(scaleVectorRelativeTo(v0.x, v0.y, 1.0 * scale, rotateVectorAround(v0.x, v0.y, 17 * sideFact, vr)))
        points.push(scaleVectorRelativeTo(v0.x, v0.y, 0.5 * scale, rotateVectorAround(v0.x, v0.y, 10 * sideFact, vr)))
        points.push(scaleVectorRelativeTo(v0.x, v0.y, 0.3 * scale, rotateVectorAround(v0.x, v0.y, 5 * sideFact, vr)))
        points.push(scaleVectorRelativeTo(v0.x, v0.y, 0.2 * scale, rotateVectorAround(v0.x, v0.y, 1 * sideFact, vr)))
        points.push(scaleVectorRelativeTo(v0.x, v0.y, 0.1 * scale, rotateVectorAround(v0.x, v0.y, 0 * sideFact, vr)))

        g.stroke(this.leafColor);
        g.strokeWeight(8);
        g.fill(c);
        g.beginShape();
        for (const vert of points) {
            g.curveVertex(vert.x, vert.y);
        }
        g.endShape();
    }

    private drawFlowerHead(x: number, y: number, scale: number) {
        scale *= -1;
        let vertLen = this.vertices.length;
        if (vertLen < 3) return;
        let v0 = this.vertices[vertLen - 1];
        let v1 = this.vertices[vertLen - 2];
        let vr = v0.copy().add(v1).div(2);

        let points: p5.Vector[] = [];
        // Only contains the points for one half of the flower head
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

        let pointsLeaf: p5.Vector[] = [];
        // Only contains the points for one half of the flower head
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
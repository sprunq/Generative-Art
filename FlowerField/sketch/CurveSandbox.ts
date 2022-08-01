class CurveSandbox extends Curve {
    leafWeight: number;

    constructor(start: p5.Vector, c: p5.Color, weight: number, leafWeight: number) {
        super(start, c, weight);
        this.leafWeight = leafWeight;
    }

    public draw() {
        if (this.canDrawCurve()) {
            this.drawLeaves();
            this.drawCurve();
            this.drawFlowerHead(this.position.x, this.position.y, 2);
        }
    }

    private drawLeaves() {
        let sideChange = true;
        for (var i = 0; i < this.vertices.length; i++) {
            if (i % 8 == 0) {
                let side = sideChange ? true : false;
                sideChange = !sideChange;
                this.drawLeaf(i, 8, side, 0.8);
            }
        }
    }

    private drawLeaf(index: number, lookahead: number, leafSide: boolean, scale: number) {
        if (this.vertices.length <= index + lookahead) return;
        let c = color(random(83, 130), random(20, 100), random(50, 100), 100);

        let v0 = this.vertices[index];
        let v1 = this.vertices[index + lookahead];
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

        g.strokeWeight(this.leafWeight);
        g.stroke(c);
        g.fill(c);
        g.beginShape();
        for (const vert of points) {
            g.vertex(vert.x, vert.y);
        }
        g.endShape();
    }

    private drawFlowerHead(x: number, y: number, scale: number) {
        let col_hue = random() < 0.5 ? random(275, 359) : random(0, 49);
        let col_sat = random(20, 100);
        let col_bri = 100;
        let c = color(col_hue, col_sat, col_bri * 0.9, 100);
        let mC = color(col_hue, col_sat, col_bri * 1.0, 100);


        scale *= -1;
        let vertLen = this.vertices.length;
        if (vertLen < 3) return;
        let v0 = this.vertices[vertLen - 1];
        let v1 = this.vertices[vertLen - 2];
        let vr = v0.copy().add(v1).div(2);

        let points: p5.Vector[] = [];
        // Only contains the points for one half of the floewr head
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

        let pointsLeaf: p5.Vector[] = [];
        // Only contains the points for one half of the floewr head
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
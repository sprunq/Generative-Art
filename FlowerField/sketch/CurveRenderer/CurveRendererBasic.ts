class CurveRendererBasic extends CurveRenderer {
    leafWeight: number;

    constructor(curve: Curve, c: p5.Color, weight: number, leafWeight: number) {
        super(curve, weight, c);
        this.leafWeight = leafWeight;
    }

    public draw() {
        if (this.canDrawCurve()) {
            this.drawLeaves();
            this.drawCurve();
            this.drawFlowerHead(this.curve.position.x, this.curve.position.y, 30);
        }
    }

    private drawLeaves() {
        for (var i = 0; i < this.curve.vertices.length; i++) {
            if (i % 8 == 0) {
                let angle = random() > 0.5 ? 20 : -20;
                this.drawLeaf(i, 8, angle);
            }
        }
    }

    private drawLeaf(index: number, lookahead: number, angle: number) {
        if (this.curve.vertices.length <= index + lookahead) return;
        g.strokeWeight(this.leafWeight);
        g.stroke(color(random(83, 130), random(50, 100), random(50, 100), 100));
        let v0 = this.curve.vertices[index];
        let v1 = this.curve.vertices[index + lookahead];
        let vr = v0.copy().add(v1).div(2);
        let p2 = rotateVectorAround(v0.x, v0.y, angle, vr);
        g.line(v0.x, v0.y, p2.x, p2.y);
    }

    private drawFlowerHead(x: number, y: number, size: number) {
        g.noStroke();
        g.fill(random(255), random(30), random(255));
        g.ellipse(x + 10, y, size, size)
        g.ellipse(x - 5, y + 5, size, size)
        g.ellipse(x - 15, y - 5, size, size)
        g.ellipse(x - 7, y - 20, size, size)
        g.ellipse(x + 10, y - 15, size, size)

        g.fill(225, random(225), random(225));
        g.ellipse(x - 2, y - 7, 22, 22)
    }
}
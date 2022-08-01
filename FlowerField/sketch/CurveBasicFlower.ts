class CurveBasicFlower extends Curve {
    leafWeight: number;

    constructor(start: p5.Vector, c: p5.Color, weight: number, leafWeight: number) {
        super(start, c, weight);
        this.leafWeight = leafWeight;
    }

    public draw() {
        if (this.canDrawCurve()) {
            this.drawLeaves();
            this.drawCurve();
            this.drawFlowerHead(this.position.x, this.position.y, 30);
        }
    }

    private drawLeaves() {
        for (var i = 0; i < this.vertices.length; i++) {
            if (i % 8 == 0) {
                let angle = random() > 0.5 ? 20 : -20;
                this.drawLeaf(i, 8, angle);
            }
        }
    }

    private drawLeaf(index: number, lookahead: number, angle: number) {
        if (this.vertices.length <= index + lookahead) return;
        g.strokeWeight(this.leafWeight);
        g.stroke(color(49, 176, 58));
        let v0 = this.vertices[index];
        let v1 = this.vertices[index + lookahead];
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
class CurveRenderer {
    curve: Curve;
    col: p5.Color;
    weight: number;
    constructor(curve: Curve, weight: number, c: p5.Color) {
        this.curve = curve;
        this.col = c;
        this.weight = weight;
    }

    draw() {
        if (this.canDrawCurve())
            this.drawCurve();
    }

    protected drawCurve() {
        g.beginShape();
        g.noFill();
        g.strokeWeight(this.weight);
        g.stroke(this.col);
        for (const vert of this.curve.vertices) {
            g.vertex(vert.x, vert.y);
        }
        g.endShape();
    }

    protected canDrawCurve(): boolean {
        return this.curve.vertices.length > minimumSegments;
    }
}
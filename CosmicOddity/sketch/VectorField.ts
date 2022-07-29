class VectorField {
    magneticField: p5.Vector[][] = [];
    charges: Charge[] = [];
    resolition: number;
    wiggle: number;
    constructor(resolution: number, wiggle: number) {
        this.resolition = resolution;
        this.wiggle = wiggle;
    }
    calculateVectorField() {
        this.magneticField = [];
        for (var x = 0; x < width; x += this.resolition) {
            let row: p5.Vector[] = [];
            for (var y = 0; y < height; y += this.resolition) {
                let force = this.calculateFieldForce(x, y);
                row.push(force);
            }
            this.magneticField.push(row);
        }
    }

    calculateFieldForce(x: number, y: number) {
        let force_sum = createVector(0, 0);
        this.charges.forEach(charge => {
            let force = charge.fieldForce(createVector(x, y));
            force_sum.add(force);
        })
        return force_sum;
    }

    getVectorForce(x: number, y: number) {
        let x_f = Math.floor(x / this.resolition);
        let y_f = Math.floor(y / this.resolition);
        if (x_f < 0 || y_f < 0 || x_f > this.magneticField.length - 1 || y_f > this.magneticField[0].length - 1) {
            return this.calculateFieldForce(x, y);
        } else {
            let force = this.magneticField[x_f][y_f];
            force.x += random() * this.wiggle - this.wiggle / 2;
            force.y += random() * this.wiggle - this.wiggle / 2;
            return force;
        }
    }
}
var Charge = (function () {
    function Charge(x, y, charge) {
        this.pos = createVector(x, y);
        this.vel = createVector();
        this.acc = createVector();
        this.charge = charge;
    }
    Charge.prototype.addForce = function (force) {
        this.acc.add(force);
    };
    Charge.prototype.fieldForce = function (pos) {
        var disp = p5.Vector.sub(pos, this.pos);
        var distSq = disp.magSq();
        disp.setMag(this.charge / distSq);
        return disp;
    };
    Charge.prototype.update = function () {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);
    };
    return Charge;
}());
var Particle = (function () {
    function Particle(pos, dir) {
        this.pos = pos;
        this.dir = dir;
        this.speed = 10;
    }
    Particle.prototype.move_particle = function (angle) {
        this.dir.x = cos(angle);
        this.dir.y = sin(angle);
        var vel = this.dir.copy();
        vel.mult(this.speed);
        this.pos.add(vel);
    };
    return Particle;
}());
var Planet = (function () {
    function Planet() {
    }
    Planet.prototype.drawPlanet = function () {
        var c1 = color(204, 83, 8);
        var c2 = color(224, 213, 2);
        for (var x = 0; x < 60000; x++) {
            var p = void 0;
            do {
                p = random_point_in_circle(1400, 0, height * 2);
            } while (p.x < 0 || p.x > width || p.y < 0 || p.y > height);
            var pxHeight = this.calculateHeight(p.x, p.y);
            var newHeight = this.normalize(pxHeight, p.x, p.y);
            var alpha_1 = map(newHeight, -1000, 2000, 0, 1);
            var d = p.dist(lightSource);
            var d_n = map(d, 0, maxDist, 1, 0);
            stroke(color(204, 83, 8, alpha_1 * d_n));
            var c_mid = lerpColor(c1, c2, alpha_1);
            var c_res = lerpColor(c_mid, color(0), d_n);
            stroke(c_res);
            strokeWeight(2);
            point(p.x, p.y);
        }
    };
    Planet.prototype.calculateHeight = function (xoff, yoff) {
        return (noise(xoff * density, yoff * density) * doubleAmplitude) - (doubleAmplitude * amlitudeReductionRatio);
    };
    Planet.prototype.normalize = function (baseHeight, x, y) {
        var distanceFromMiddle = Math.sqrt(Math.pow(x - (width / 2), 2) + Math.pow(y - (height / 2), 2));
        var newHeight = baseHeight;
        if (distanceFromMiddle + 1 >= width / 2) {
            newHeight = 0;
        }
        else {
            newHeight = this.normalizeByLog(newHeight, distanceFromMiddle);
        }
        return newHeight;
    };
    Planet.prototype.normalizeByLog = function (pxHeight, distanceFromMiddle) {
        return pxHeight * Math.log(width / 2 - distanceFromMiddle) / Math.log(width / 2);
    };
    return Planet;
}());
var density = 0.02;
var doubleAmplitude = 10000;
var amlitudeReductionRatio = 0.4;
var lightSource;
var maxDist;
var planet;
var charges = [];
var particles = [];
function setup() {
    createCanvas(1200, 1200);
    background(0);
    lightSource = createVector(width, height);
    maxDist = createVector(0, 0).dist(createVector(width, height));
    var planetCharge = new Charge(0, height, 13250000);
    var repelChargeMain = new Charge(width + 4000, 0 - 4000, 1000000000);
    var repelLeft = new Charge(0, 0, 2000000);
    var repelChargeRight = new Charge(width, height, 2000000);
    charges.push(planetCharge);
    charges.push(repelChargeMain);
    charges.push(repelLeft);
    charges.push(repelChargeRight);
    for (var i = 0; i < 5000; i++) {
        var pos = random_point_in_circle(50, width * 2, 0);
        var particle = new Particle(pos, createVector(0, 0));
        particles.push(particle);
    }
    planet = new Planet();
    planet.drawPlanet();
}
function draw() {
    particles.forEach(function (particle) {
        var old_pos = particle.pos.copy();
        var force_sum = createVector(0, 0);
        charges.forEach(function (charge) {
            var force = charge.fieldForce(particle.pos);
            force_sum.add(force);
        });
        particle.move_particle(force_sum.heading());
        var new_pos = particle.pos.copy();
        strokeWeight(1);
        stroke(color(255, 1));
        line(old_pos.x, old_pos.y, new_pos.x, new_pos.y);
    });
}
function random_point_in_circle(max_r, w, h) {
    var a = random() * 2.0 * PI;
    var r = sqrt((random() * max_r));
    r = constrain(r, 0, max_r) * 20;
    var x = w / 2.0 + r * cos(a);
    var y = h / 2.0 + r * sin(a);
    var vec = createVector(x, y);
    return vec;
}
//# sourceMappingURL=build.js.map
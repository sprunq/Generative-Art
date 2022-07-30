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
var Controls = (function () {
    function Controls() {
        this.frameRate = 0;
        this.particles = 0;
        this.renderSpheres = function () {
            spheres.forEach(function (sphere) {
                sphere.drawSphere();
            });
            image(g, 0, 0, width, height);
        };
        this.saveImg = function () {
            saveCanvas(g, "canvas.png");
        };
        this.stopLoop = function () {
            noLoop();
        };
        this.startLoop = function () {
            loop();
        };
    }
    ;
    return Controls;
}());
function updateGui() {
    controls.frameRate = frameRate();
    controls.particles = particles.length;
}
function setupGui() {
    var perfControls = gui.addFolder("Performance");
    perfControls.open();
    perfControls.add(controls, "frameRate").name("Framerate").listen();
    perfControls.add(controls, "particles").name("Particles").listen();
    var perfControls = gui.addFolder("Misc");
    perfControls.open();
    perfControls.add(controls, "renderSpheres").name("Render Spheres").listen();
    perfControls.add(controls, "saveImg").name("Save Image").listen();
    perfControls.add(controls, "startLoop").name("Start Loop").listen();
    perfControls.add(controls, "stopLoop").name("Stop Loop").listen();
}
var CosmicSphere = (function () {
    function CosmicSphere(size, pos, col, iterations) {
        this.size = size;
        this.pos = pos;
        this.col = col;
        this.iterations = iterations;
    }
    CosmicSphere.prototype.drawSphere = function () {
        g.blendMode("source-over");
        g.fill(color(0, 0, 0, 255));
        g.circle(this.pos.x, this.pos.y, this.size * 2);
        g.blendMode(ADD);
        g.noFill();
        for (var i = 0; i < this.iterations; i++) {
            var p1 = randomPointOnCircleEdge(this.size, this.pos.x * 2, this.pos.y * 2);
            var p2 = randomPointOnCircleEdge(this.size, this.pos.x * 2, this.pos.y * 2);
            var lenLine = p1.dist(p2);
            var aLineLen = map(lenLine, 0.3, this.size * 2, 1, 0.3, true);
            var midPoint = p1.add(p2).div(2);
            var dLight = midPoint.dist(lightSource);
            var aLight = map(dLight, 900, maxDist / 2, 0.3, 1.0, true);
            var alpha_1 = aLight * aLineLen;
            var baseColor = color(this.col.a, this.col.b - alpha_1 * this.col.b, this.col.c, alpha_1 * this.col.d);
            g.stroke(baseColor);
            g.strokeWeight(1.0);
            g.line(p1.x, p1.y, p2.x, p2.y);
        }
    };
    return CosmicSphere;
}());
var Particle = (function () {
    function Particle(pos, speed) {
        this.pos = pos;
        this.dir = createVector(0, 0);
        this.speed = speed;
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
var Vec4 = (function () {
    function Vec4(a, b, c, d) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
    }
    return Vec4;
}());
var VectorField = (function () {
    function VectorField(resolution, wiggle) {
        this.magneticField = [];
        this.charges = [];
        this.resolition = resolution;
        this.wiggle = wiggle;
    }
    VectorField.prototype.calculateVectorField = function () {
        this.magneticField = [];
        for (var x = 0; x < g.width; x += this.resolition) {
            var row = [];
            for (var y = 0; y < g.height; y += this.resolition) {
                var force = this.calculateFieldForce(x, y);
                row.push(force);
            }
            this.magneticField.push(row);
        }
    };
    VectorField.prototype.calculateFieldForce = function (x, y) {
        var force_sum = createVector(0, 0);
        this.charges.forEach(function (charge) {
            var force = charge.fieldForce(createVector(x, y));
            force_sum.add(force);
        });
        return force_sum;
    };
    VectorField.prototype.getVectorForce = function (x, y) {
        var x_f = Math.floor(x / this.resolition);
        var y_f = Math.floor(y / this.resolition);
        if (x_f < 0 || y_f < 0 || x_f > this.magneticField.length - 1 || y_f > this.magneticField[0].length - 1) {
            return this.calculateFieldForce(x, y);
        }
        else {
            var force = this.magneticField[x_f][y_f];
            force.x += random() * this.wiggle - this.wiggle / 2;
            force.y += random() * this.wiggle - this.wiggle / 2;
            return force;
        }
    };
    return VectorField;
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
function onScreen(pos) {
    if (pos.x < 0 - particleOffScreenSpeed * 2
        || pos.y < 0 - particleOffScreenSpeed * 2
        || pos.x > g.width + particleOffScreenSpeed * 2
        || pos.y > g.height + particleOffScreenSpeed * 2) {
        return false;
    }
    else {
        return true;
    }
}
function drawStars() {
    for (var i = 0; i < 1000; i++) {
        fill(color(255));
        var w = random() * 2;
        g.ellipse(random(width), random(height), w, w);
    }
}
var lightSource;
var maxDist;
var vectorField;
var particles = [];
var spheres = [];
var g;
var particleBaseSpeed;
var particleOffScreenSpeed;
var gui;
var controls;
function setup() {
    var renderW = 6000;
    var renderH = 4000;
    var displayW = 1000;
    particleBaseSpeed = 30;
    particleOffScreenSpeed = 200;
    vectorField = new VectorField(10, 0.3);
    createCanvas(displayW, displayW / (renderW / renderH));
    colorMode(HSB, 360, 100, 100, 100);
    frameRate(300);
    g = createGraphics(renderW, renderH);
    g.pixelDensity(1);
    g.background(0);
    g.blendMode(ADD);
    lightSource = createVector(g.width, g.height * 0.25);
    maxDist = createVector(0, 0).dist(createVector(g.width, g.height));
    gui = new dat.GUI({ name: "Controls" });
    gui.close();
    controls = new Controls();
    setupGui();
    setupScene();
}
function draw() {
    removeStuckParticles();
    g.strokeWeight(1);
    g.stroke(color(218, 0, 2, 100));
    particles.forEach(function (particle) {
        var old_pos = particle.pos.copy();
        var force = vectorField.getVectorForce(particle.pos.x, particle.pos.y);
        particle.move_particle(force.heading());
        var new_pos = particle.pos.copy();
        if (onScreen(old_pos) && onScreen(new_pos)) {
            if (particle.speed == particleOffScreenSpeed)
                particle.speed = random(particleBaseSpeed);
            g.line(old_pos.x, old_pos.y, new_pos.x, new_pos.y);
        }
        else {
            particle.speed = particleOffScreenSpeed;
        }
    });
    updateGui();
    image(g, 0, 0, width, height);
}
function removeStuckParticles() {
    particles.forEach(function (particle, index, arr) {
        vectorField.charges.forEach(function (c) {
            if (c.charge < 0) {
                if (particle.pos.dist(c.pos) < particleBaseSpeed) {
                    arr.splice(index, 1);
                }
            }
        });
    });
}
function setupScene() {
    var maxSize = 500;
    var _loop_1 = function () {
        var pos;
        var minDist = 100000;
        var calcTry = 0;
        while (true) {
            calcTry += 1;
            if (calcTry > 200)
                break;
            pos = createVector(random(g.width * 0.1, g.width * 0.9), random(g.height * 0.2, g.height * 0.8));
            if (spheres.length == 0)
                break;
            spheres.forEach(function (sphere) {
                var dist = sphere.pos.dist(pos);
                if (dist < minDist)
                    minDist = dist;
            });
            if (minDist > maxSize + 100)
                break;
        }
        var col = new Vec4(27, 0, 5, 100);
        var spSize = random(50, maxSize);
        var spIter = 50 * spSize;
        var sp = new CosmicSphere(spSize, pos, col, spIter);
        spheres.push(sp);
        sp.drawSphere();
        var axisOffset = random(-90, 90);
        var p1 = pointOnCircleEdge(sp.size * 0.9, sp.pos.x * 2, sp.pos.y * 2, radians(90 - axisOffset));
        var p2 = pointOnCircleEdge(sp.size * 0.9, sp.pos.x * 2, sp.pos.y * 2, radians(270 - axisOffset));
        var c1 = new Charge(p1.x, p1.y, -10000 * sp.size);
        var c2 = new Charge(p2.x, p2.y, 10000 * sp.size);
        vectorField.charges.push(c1);
        vectorField.charges.push(c2);
        for (var i = 0; i < 14000; i++) {
            var p = pointOnCircleEdge(30, c2.pos.x * 2, c2.pos.y * 2, radians(random(270 - axisOffset - 110, 270 - axisOffset + 110)));
            particles.push(new Particle(p, random(particleBaseSpeed)));
        }
        for (var i = 0; i < 1500; i++) {
            var p = pointOnCircleEdge(6000, g.width, g.height, radians(random(90 - axisOffset - 20, 90 - axisOffset + 20)));
            particles.push(new Particle(p, random(particleBaseSpeed)));
        }
    };
    for (var s = 0; s < 3; s++) {
        _loop_1();
    }
    vectorField.calculateVectorField();
}
//# sourceMappingURL=build.js.map
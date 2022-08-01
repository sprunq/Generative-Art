function randomPointOnCircleEdge(max_r: number, w: number, h: number): p5.Vector {
    let theta = random() * 2.0 * PI;
    let r = max_r;
    let x = w / 2.0 + r * cos(theta);
    let y = h / 2.0 + r * sin(theta);
    let vec = createVector(x, y);
    return vec;
}

function randomPointInCircle(max_r: number, w: number, h: number): p5.Vector {
    let theta = random() * 2.0 * PI;
    let r = sqrt(random()) * max_r;
    let x = w / 2.0 + r * cos(theta);
    let y = h / 2.0 + r * sin(theta);
    let vec = createVector(x, y);
    return vec;
}

function pointOnCircleEdge(max_r: number, w: number, h: number, angle: number): p5.Vector {
    let r = max_r;
    let x = w / 2.0 + r * cos(angle);
    let y = h / 2.0 - r * sin(angle);
    let vec = createVector(x, y);
    return vec;
}

function rotateVectorAround(cx: number, cy: number, angle: number, p: p5.Vector): p5.Vector {
    var s = sin(angle);
    var c = cos(angle);

    let newP = p.copy();

    // translate point back to origin:
    newP.x -= cx;
    newP.y -= cy;

    // rotate point
    var xnew = newP.x * c - newP.y * s;
    var ynew = newP.x * s + newP.y * c;

    // translate point back:
    newP.x = xnew + cx;
    newP.y = ynew + cy;
    return newP;
}

function scaleVectorRelativeTo(x: number, y: number, scaleFactor: number, vecToScale: p5.Vector): p5.Vector {
    let p0 = createVector(x, y);
    let vts = vecToScale.copy();
    let rel_vec = vts.copy().sub(p0);
    let p2 = p0.copy().add(rel_vec.mult(scaleFactor));
    return p2;
}
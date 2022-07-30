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

function onScreen(pos: p5.Vector) {
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
        let w = random() * 2;
        g.ellipse(random(width), random(height), w, w)
    }
}
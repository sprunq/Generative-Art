var noiseScale = 800;
var noiseStrenght = 1;;

var maxCurves = 200;
var numSegmentsPerCurve = 40;
var segmentLength = 10;
var minDistance = 70;
var minimumSegments = 3;
let sideBuffer = -200;

let g: p5.Graphics;
let curves: Curve[] = [];
var spp: StartingPointPicker;

function setup() {
  let renderW = 2000;
  let renderH = 2000;
  let displayW = 1000;
  createCanvas(displayW, displayW / (renderW / renderH));
  g = createGraphics(renderW, renderH);
  g.background(242, 255, 191);
  frameRate(300);
  angleMode(DEGREES)
  colorMode(HSB, 360, 100, 100, 100);

  spp = new StartingPointPicker();
}

function draw() {
  if (curves.length < maxCurves) {
    var start = spp.getStartingPoint();
    if (start != null) {
      let col = color(random(83, 130), random(50, 100), random(50, 80), 100);
      var c = new CurveTulip(start, col, 10, 8);
      curves.push(c);
      c.computeVertecies();
      c.draw();
    }
  }
  image(g, 0, 0, width, height);
}

function keyPressed() {
  if (key == 's') {
    saveCanvas(g, "canvas.png");

  }
}


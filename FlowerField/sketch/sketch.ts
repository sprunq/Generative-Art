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
  if (curves.length >= maxCurves) { noLoop(); return; }

  var start = spp.getStartingPoint();
  if (start != null) {
    var c = createTulip(start);
    curves.push(c);
    c.computeVertecies();
    c.draw();
  }
  image(g, 0, 0, width, height);
}

function createTulip(pos: p5.Vector): CurveTulip {
  let col_hue = random() < 0.5 ? random(275, 359) : random(0, 49);
  let col_sat = random(20, 100);
  let col_bri = 100;

  var leafSpacing = createVector(14, 14);
  var leafOffset = createVector(3, 10);
  var leafSize = randomGaussian(1.0, 0.2);
  var flowerHeadSize = randomGaussian(2.1, 0.2);
  var stemWeight = randomGaussian(10, 2);
  var leafWeight = 8;
  var headWeight = 3;
  var stemColor = color(random(83, 130), random(50, 100), random(50, 80), 100);
  var leafColor = color(random(83, 130), random(50, 100), random(50, 100), 100);
  var headColorMain = color(col_hue, col_sat, col_bri * 0.9, 100);
  var headColorAccent = color(col_hue, col_sat, col_bri * 1.0, 100);
  var c = new CurveTulip(pos, leafSpacing, leafOffset, leafSize, flowerHeadSize, stemWeight, leafWeight, headWeight, stemColor, leafColor, headColorMain, headColorAccent);
  return c;
}

function keyPressed() {
  if (key == 's') {
    saveCanvas(g, "canvas.png");

  }
}


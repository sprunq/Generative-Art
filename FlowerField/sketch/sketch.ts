var noiseScale = 800;
var noiseStrenght = 1;;

var maxCurves = 400;
var numSegmentsPerCurve = 20;
var segmentLength = 10;
var minDistance = 75;
var minimumSegments = 3;
let sideBuffer = 1000;

let g: p5.Graphics;
let curves: Curve[] = [];
var spp: StartingPointPicker;
var limiter: Limiter;

function setup() {
  let renderW = 2500;
  let renderH = 2500;
  let displayW = 1000;
  createCanvas(displayW, displayW / (renderW / renderH));
  g = createGraphics(renderW, renderH);
  g.background(242, 255, 191);
  frameRate(300);
  angleMode(DEGREES)
  colorMode(HSB, 360, 100, 100, 100);

  spp = new StartingPointPicker();
  limiter = new CircleLimiter(sideBuffer);
}

function draw() {
  if (curves.length >= maxCurves) { noLoop(); return; }

  var start = spp.getStartingPoint();
  if (start != null) {
    var c = new Curve(start, limiter);
    curves.push(c);
    c.computeVertecies();
    var renderer: CurveRenderer;
    var type = floor(random(0, 2));
    switch (type) {
      case 0:
        renderer = createTulipRenderer(c);
        break;
      case 1:
        renderer = createRoseRenderer(c);
        break;
      default: break;
    }
    renderer.draw();
  }
  image(g, 0, 0, width, height);
}

function keyPressed() {
  if (key == 's') {
    saveCanvas(g, "canvas.png");
  }
}

function createRoseRenderer(curve: Curve): CurveRendererRose {
  let angle =
    noise(
      curve.position.x / noiseScale,
      curve.position.y / noiseScale
    ) *
    TWO_PI *
    noiseStrenght;

  let nA = map(degrees(angle), 0, 360, 0, 1);
  let col_hue = nA > 0.5 ? map(nA, 0, 1, 305, 360) : map(nA, 0, 1, 0, 42)
  let col_sat = random(10, 100);
  let col_bri = 100;

  let curveLength = curve.vertices.length;
  let nLength = map(curveLength, minimumSegments, numSegmentsPerCurve, 0.8, 1.2)

  let ls = floor(random(5, 7));
  var leafSpacing = createVector(ls, ls);
  var leafOffset = createVector(floor(random(1, 5)), floor(random(1, 5)));
  var leafSize = 5.3 * nLength;
  var leafFlowerHeadChance = 0.2;
  var flowerHeadSize = 2 * nLength;
  var stemWeight = 8 * nLength;
  var leafWeight = 8 * nLength;
  var headWeight = 3 * nLength;
  var stemColor = color(random(83, 130), random(50, 100), random(40, 70), 100);
  var leafColor = color(random(83, 130), random(50, 100), random(30, 60), 100);
  var headColorMain = color(col_hue, col_sat, col_bri * 0.9, 100);
  var headColorAccent = color(col_hue, col_sat, col_bri * 1.0, 100);
  var c = new CurveRendererRose(curve, leafSpacing, leafOffset, leafSize, leafFlowerHeadChance, flowerHeadSize, stemWeight, leafWeight, headWeight, stemColor, leafColor, headColorMain, headColorAccent);
  return c;
}

function createTulipRenderer(curve: Curve): CurveRendererTulip {
  let angle =
    noise(
      curve.position.x / noiseScale,
      curve.position.y / noiseScale
    ) *
    TWO_PI *
    noiseStrenght;

  let nA = map(degrees(angle), 0, 360, 0, 1);
  let col_hue = nA > 0.5 ? map(nA, 0, 1, 275, 360) : map(nA, 0, 1, 0, 49)
  let col_sat = random(20, 100);
  let col_bri = 100;

  let curveLength = curve.vertices.length;
  let nLength = map(curveLength, minimumSegments, numSegmentsPerCurve, 0.8, 1.2)

  var leafSpacing = createVector(14, 14);
  var leafOffset = createVector(3, 10);
  var leafSize = 1.5 * nLength;
  var flowerHeadSize = 1.9 * nLength;
  var stemWeight = 8 * nLength;
  var leafWeight = 8 * nLength;
  var headWeight = 3 * nLength;
  var stemColor = color(random(83, 130), random(50, 100), random(50, 80), 100);
  var leafColor = color(random(83, 130), random(50, 100), random(50, 80), 100);
  var headColorMain = color(col_hue, col_sat, col_bri * 0.9, 100);
  var headColorAccent = color(col_hue, col_sat, col_bri * 1.0, 100);
  var c = new CurveRendererTulip(curve, leafSpacing, leafOffset, leafSize, flowerHeadSize, stemWeight, leafWeight, headWeight, stemColor, leafColor, headColorMain, headColorAccent);
  return c;
}

function createBasicRenderer(curve: Curve): CurveRendererBasic {
  var stemWeight = randomGaussian(10, 2);
  var leafWeight = 8;
  var stemColor = color(random(83, 130), random(50, 100), random(50, 80), 100);
  var c = new CurveRendererBasic(curve, stemColor, stemWeight, leafWeight);
  return c;
}




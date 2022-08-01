/// <reference path="Limiter.ts" />
// Flow field Settings
var noiseScale = 800;
var noiseStrenght = 1;

// Checks if curves are in limit and can still be drawn
// Available types are:
// - CircleLimiter(sideBuffer)  // sideBuffer is radius from Center   (e.g 800)
// - RectLimiter(sideBuffer)    // sideBuffer is distance from edges  (e.g -200 or 200)
var sideBuffer = -200;
var limiter: Limiter = new RectLimiter(sideBuffer);

// Curve
var maxCurves = 2000;
var numSegmentsPerCurve = 20;
var segmentLength = 10;
var minDistance = 80;
var minimumSegments = 3;

// Display
var renderW = 3000;
var renderH = 3000;
var displayW = 1000;

var g: p5.Graphics;
var curves: Curve[] = [];
var spp: StartingPointPicker;


function setup() {
  createCanvas(displayW, displayW / (renderW / renderH));
  g = createGraphics(renderW, renderH);
  g.background(242, 255, 191);
  frameRate(300);
  angleMode(DEGREES)
  colorMode(HSB, 360, 100, 100, 100);

  spp = new StartingPointPicker();
}

function draw() {
  let batchDraw = 5;
  let failedAttempts = 0;
  for (var n = 0; n < batchDraw; n++) {
    var start = spp.getStartingPoint();
    if (start == null) { failedAttempts++ }
    else {
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
  }
  image(g, 0, 0, width, height);
  if (failedAttempts >= batchDraw * 0.5 || curves.length >= maxCurves) { noLoop(); console.log("done") }
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
  let col_sat = random(10, 95);
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
  let col_hue = nA > 0.5 ? map(nA, 0, 1, 275, 360) : map(nA, 0, 1, 0, 70)
  let col_sat = random(20, 90);
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

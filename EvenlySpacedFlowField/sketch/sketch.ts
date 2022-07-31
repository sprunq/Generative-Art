let dimx = 1000;
let dimy = 1000;
var noiseScale = 500;
var noiseStrenght = 1;;

var maxCurves = 600;
var numSegmentsPerCurve = 300;
var segmentLength = 10;
var minDistance = 20;
var curveStrokeWeight = 5;

let g: p5.Graphics;
let curves: Curve[] = [];
var spp: StartingPointPicker;

function setup() {
  let renderW = 2000;
  let renderH = 2000;
  let displayW = 1000;
  createCanvas(displayW, displayW / (renderW / renderH));
  g = createGraphics(renderW, renderH);
  g.background(255);
  frameRate(300);

  spp = new StartingPointPicker();
}

function draw() {
  if (curves.length < maxCurves) {
    var start = spp.getStartingPoint();
    if (start != null) {
      var c = new Curve(start, color(0));
      c.draw();
      curves.push(c);
    }
  }
  image(g, 0, 0, width, height);
}



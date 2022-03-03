const gui = new dat.GUI({ name: "Controls" });
let controls = new Controls();
let canvas;
let frameWidth = 50;
let allBbs;
let allFlowFields = [];

function setup() {
  canvas = createCanvas(controls.canvasSize, controls.canvasSize);
  frameRate(30);
  rectMode(CENTER);
  constructQuadTree();
  controls.setupGui();
}

function draw() {
  if (controls.renderFlowFields) {
    allFlowFields.forEach((element) => {
      element.run();
    });
  }

  fill(0, controls.bgAlpha);

  noStroke();
  rect(width / 2, controls.canvasSize / 2, width, controls.canvasSize);
  if (controls.renderTree) {
    qtree.show(controls.renderPoints);
  }
  drawFrame();

  if (frameCount % 10 == 0) controls.frameRate = frameRate();
}

function constructQuadTree() {
  var col = color(0);
  fill(col);
  noStroke();
  rect(width / 2, height / 2, width, height);
  allBbs = [];
  allFlowFields = [];
  let boundary = new Rectangle(
    controls.canvasSize / 2,
    controls.canvasSize / 2,
    controls.quadTreeSize,
    controls.quadTreeSize
  );
  qtree = new QuadTree(boundary, controls.quadTreePointMax);
  for (let i = 0; i < controls.quadTreePoints; i++) {
    let x = randomGaussian(
      controls.canvasSize / 2,
      controls.quadTreePointStretchX
    );
    let y = randomGaussian(
      controls.canvasSize / 2,
      controls.quadTreePointStretchY
    );
    let p = new Point(x, y);
    qtree.insert(p);
  }
  allBbs = qtree.getAllBoundingBoxes();

  let activeParticles = 0;
  allBbs.forEach((element) => {
    // x, y, w, h
    let w = element.w;
    let h = element.h;
    let x1 = element.x - w;
    let x2 = element.x + w;
    let y1 = element.y - h;
    let y2 = element.y + h;
    let particleCount = w * controls.particleCountMult;
    activeParticles += particleCount;
    let ff = new FlowField(x1, y1, x2, y2, particleCount);
    allFlowFields.push(ff);
  });
  controls.particleCount = activeParticles;
}

function drawFrame() {
  fill(255);
  rect(
    controls.canvasSize / 2,
    controls.frameWidth / 2,
    controls.canvasSize,
    controls.frameWidth
  );
  rect(
    controls.canvasSize / 2,
    controls.canvasSize - controls.frameWidth / 2,
    controls.canvasSize,
    controls.frameWidth
  );
  rect(
    controls.frameWidth / 2,
    controls.canvasSize / 2,
    controls.frameWidth,
    controls.canvasSize
  );
  rect(
    controls.canvasSize - controls.frameWidth / 2,
    controls.canvasSize / 2,
    controls.frameWidth,
    controls.canvasSize
  );
}

function saveCanvasAsPng() {
  saveCanvas(canvas, "image", "png");
}

function canvasSizeChanged() {
  resizeCanvas(controls.canvasSize, controls.canvasSize);
  constructQuadTree();
  canvasScaleChanged();
}

function canvasScaleChanged() {
  var element = document.getElementById("defaultCanvas0");
  let newSize = controls.canvasSize * controls.canvasScale;
  element.style.width = `${newSize}px`;
  element.style.height = `${newSize}px`;
}

function particleCountChanged() {
  let activeParticles = 0;
  allFlowFields.forEach((element) => {
    let w = element.x2 - element.x1;
    let particleCount = w * controls.particleCountMult;
    element.createParticles(particleCount);
    activeParticles += particleCount;
  });
  controls.particleCount = activeParticles;
}

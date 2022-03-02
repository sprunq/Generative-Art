const gui = new dat.GUI({ name: "Controls" });
let controls = new Controls();
let canvas;
let allowResize;

function setup() {
  controls.w = windowWidth;
  controls.h = windowHeight;
  allowResize = true;
  canvas = createCanvas(controls.w, controls.h);

  if (controls.randomSeed == -1)
    controls.randomSeed = Math.floor(Math.random() * 1000000000000000);
  randomSeed(controls.randomSeed);

  if (controls.noiseSeed == -1)
    controls.noiseSeed = Math.floor(Math.random() * 1000000000000000);
  noiseSeed(controls.noiseSeed);

  createParticles();
  setupGui();
}

function setupGui() {
  var ffControls = gui.addFolder("Flow Field");
  ffControls.open();
  ffControls.add(controls, "noiseScale", 0, 20000).name("Scale");
  ffControls.add(controls, "noiseStrength", 0, 100).name("Strength");
  ffControls.add(controls, "noiseChangeSpeed", 0, 40).name("Animation Speed");

  var pControls = gui.addFolder("Particles");
  pControls.open();
  pControls
    .add(controls, "numFlowFieldPoints", 1, 100000)
    .name("Amount")
    .onChange(createParticles);
  pControls.add(controls, "speed", 0, 40).name("Speed");
  pControls
    .add(controls, "particleWeight", 0, 10)
    .name("Weight")
    .onChange(createParticles);

  var cControls = gui.addFolder("Colors");
  cControls.open();
  cControls.add(controls, "alpha", 0, 255).name("Alpha");
  cControls.addColor(controls, "colBackground").name("Background");
  cControls
    .addColor(controls, "col1")
    .name("Color 1")
    .onChange(setUserColorArray)
    .listen();
  cControls
    .addColor(controls, "col2")
    .name("Color 2")
    .onChange(setUserColorArray)
    .listen();
  cControls
    .addColor(controls, "col3")
    .name("Color 3")
    .onChange(setUserColorArray)
    .listen();
  cControls
    .addColor(controls, "col4")
    .name("Color 4")
    .onChange(setUserColorArray)
    .listen();
  cControls
    .addColor(controls, "col5")
    .name("Color 5")
    .onChange(setUserColorArray)
    .listen();
  cControls.add(controls, "img").name("Load colors from Image");

  var miscControls = gui.addFolder("Miscellaneous");
  miscControls.open();
  miscControls
    .add(controls, "renderVectors")
    .name("Render Vectors")
    .onChange(function (value) {
      controls.renderVectors = value;
    });
  miscControls.add(controls, "vectorAmount", 5, 100).name("Vector Amount");
  miscControls.add(controls, "gifQuality", 5, 30).name("Gif Quality");
  miscControls.add(controls, "gifLength", 1, 100).name("Gif Length (s)");
  miscControls.add(controls, "recordGif").name("Record Gif");
  miscControls.add(controls, "saveScreen").name("Save Canvas");

  var perfControls = gui.addFolder("Performance");
  perfControls.open();
  perfControls.add(controls, "frameRate").name("Framerate").listen();
  perfControls.add(controls, "calcTime").name("Calculation Time").listen();
  perfControls.add(controls, "drawTime").name("Draw Time").listen();
}

function draw() {
  if (controls.renderVectors) {
    var col = color(controls.colBackground);
    fill(col);
    rect(-10, -10, controls.w + 10, controls.h + 10);
    drawVectors();
  } else {
    var col = color(controls.colBackground);
    col.setAlpha(controls.alpha);
    fill(col);
    rect(-10, -10, controls.w + 10, controls.h + 10);
    var startTime = performance.now();
    controls.particles.forEach((particle) => {
      particle.run();
    });
    var endTimeCalc = performance.now() - startTime;

    startTime = performance.now();
    controls.particles.forEach((particle) => {
      particle.show();
    });
    var endTimeDraw = performance.now() - startTime;

    if (frameCount % 10 == 0) {
      controls.calcTime = endTimeCalc;
      controls.drawTime = endTimeDraw;
    }
  }

  if (frameCount % 10 == 0) controls.frameRate = frameRate();
}

function windowResized() {
  if (allowResize) {
    controls.w = windowWidth;
    controls.h = windowHeight;
    var col = color(controls.colBackground);
    col.setAlpha(controls.alpha);
    fill(col);
    rect(0, 0, controls.w, controls.h);
    resizeCanvas(controls.w, controls.h);
  }
}

function createParticles() {
  var amount = controls.numFlowFieldPoints;
  controls.particles = [amount];
  for (let i = 0; i < amount; i++) {
    var loc = createVector(random(width * 1.2), random(height), 2);
    var angle = 0;
    var dir = createVector(cos(angle), sin(angle));
    var speed = 20;
    var col = color(controls.randomColor());
    var weight = Math.random() * controls.particleWeight;
    controls.particles[i] = new Particle(loc, dir, speed, col, weight);
  }
}

function setUserColorArray() {
  controls.colors = [
    controls.col1,
    controls.col2,
    controls.col3,
    controls.col4,
    controls.col5,
  ];
  updateParticleColors();
}

function updateParticleColors() {
  controls.particles.forEach((particle) => {
    particle.color = color(controls.randomColor());
  });
}

function drawVectors() {
  var amount = controls.vectorAmount;
  for (var i = 0; i < controls.w; i += controls.w / amount) {
    for (var j = 0; j < controls.h; j += controls.h / amount) {
      var p = new Particle(
        createVector(i, j),
        createVector(0, 0),
        0,
        color(0, 0, 0),
        0
      );
      var newDir = p.getDirection();
      stroke(color(255, 0, 0));
      strokeWeight(3);
      line(i, j, i + newDir.x * amount, j + newDir.y * amount);
    }
  }
}

function saveCanvasAsPng() {
  saveCanvas(canvas, "image", "png");
}

// Loading Colors from an Image
function loadColorsFromImage() {
  image_input.click();
}

document.getElementById("output").onload = () => {
  var img = document.getElementById("output");
  var vibrant = new Vibrant(img);
  var swatches = vibrant.swatches();
  controls.colors = [];
  var sws = [];
  for (var swatch in swatches) {
    if (swatches.hasOwnProperty(swatch) && swatches[swatch]) {
      sws.push(swatches[swatch].getHex());
    }
  }
  var sl = sws.length - 1;
  if (sws.length > 0) {
    controls.col1 = sws[min(0, sl)];
    controls.col2 = sws[min(1, sl)];
    controls.col3 = sws[min(2, sl)];
    controls.col4 = sws[min(3, sl)];
    controls.col5 = sws[min(4, sl)];
    setUserColorArray();
  }
};

document.getElementById("image_input").onchange = function (evt) {
  var tgt = evt.target;
  var files = tgt.files;

  if (FileReader && files && files.length) {
    var fr = new FileReader();
    fr.onload = function () {
      document.getElementById("output").src = fr.result;
    };
    fr.readAsDataURL(files[0]);
  } else {
    // Not supported
  }
};

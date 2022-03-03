class Controls {
  constructor() {
    this.canvasSize = 800;
    this.canvasScale = 1;
    this.frameRate = 0;
    this.gifQuality = 10;
    this.recordGif = function () {
      createLoop({
        duration: controls.gifLength,
        gif: {
          render: false,
          open: true,
          download: false,
          options: {
            quality: this.gifQuality,
          },
        },
      });
    };
    this.saveScreen = function () {
      saveCanvasAsPng();
    };
    this.gifLength = 5;
    this.randomSeed = -1;
    this.noiseSeed = -1;

    // Colors
    this.frameWidth = 30;

    // QuadTree
    this.quadTreeSize = 300;
    this.quadTreePoints = 100;
    this.quadTreePointMax = 4;
    this.quadTreePointStretchX = this.canvasSize / 13;
    this.quadTreePointStretchY = this.canvasSize / 13;
    this.particleCountMult = 3;
    this.renderFlowFields = true;
    this.renderTree = true;
    this.renderPoints = false;
    this.bgAlpha = 20;
    this.regenerateTree = constructQuadTree;

    this.particleWeight = 0.7;
    this.particleSpeed = 4;
    this.particleCount = 0;
  }

  setupGui() {
    var quadControls = gui.addFolder("QuadTree");
    quadControls.open();
    quadControls
      .add(controls, "canvasSize", 100, 2500, 100)
      .name("Canvas Size")
      .onChange(canvasSizeChanged);
    quadControls
      .add(controls, "canvasScale", 0.1, 1)
      .name("Canvas Scale")
      .onChange(canvasScaleChanged);
    quadControls.add(controls, "frameWidth", 0, 400, 1).name("Frame Width");
    quadControls
      .add(controls, "quadTreeSize", 10, 1000, 1)
      .name("Size")
      .onChange(constructQuadTree);
    quadControls
      .add(controls, "quadTreePoints", 10, 800, 1)
      .name("Points")
      .onChange(constructQuadTree);
    quadControls
      .add(controls, "quadTreePointMax", 1, 20, 1)
      .name("Points per Cell")
      .onChange(constructQuadTree);
    quadControls
      .add(controls, "quadTreePointStretchX", 1, 200)
      .name("Stretch X")
      .onChange(constructQuadTree);
    quadControls
      .add(controls, "quadTreePointStretchY", 1, 200)
      .name("Stretch Y")
      .onChange(constructQuadTree);
    quadControls
      .add(controls, "particleCountMult", 0.5, 30)
      .name("Particle Count")
      .onChange(particleCountChanged);
    quadControls
      .add(controls, "particleWeight", 0.05, 1)
      .name("Particle Weight");
    quadControls.add(controls, "particleSpeed", 0, 10).name("Particle Speed");

    quadControls.add(controls, "bgAlpha", 0, 255).name("Alpha");
    quadControls.add(controls, "renderFlowFields").name("Render FF");
    quadControls.add(controls, "renderTree").name("Render Tree");
    quadControls.add(controls, "renderPoints").name("Render Points");
    quadControls.add(controls, "regenerateTree").name("Regenerate Tree");

    var miscControls = gui.addFolder("Miscellaneous");
    miscControls.open();
    miscControls.add(controls, "gifQuality", 5, 30).name("Gif Quality");
    miscControls.add(controls, "gifLength", 1, 100).name("Gif Length (s)");
    miscControls.add(controls, "recordGif").name("Record Gif");
    miscControls.add(controls, "saveScreen").name("Save Canvas");

    var perfControls = gui.addFolder("Performance");
    perfControls.open();
    perfControls.add(controls, "frameRate").name("Framerate").listen();
    perfControls.add(controls, "particleCount").name("Particle Count").listen();
  }
}

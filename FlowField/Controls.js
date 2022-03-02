class Controls {
  constructor() {
    this.w = 0;
    this.h = 0;
    this.frameRate = 0;
    this.calcTime = 0;
    this.drawTime = 0;
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

    // Flow Field
    this.noiseScale = 2000;
    this.noiseStrength = 10;
    this.noiseChangeSpeed = 1;
    this.renderVectors = false;
    this.vectorAmount = 30;

    // Particles
    this.particles;
    this.speed = 5.0;
    this.particleWeight = 1;
    this.numFlowFieldPoints = 6000;

    // Colors
    this.colBackground = [0, 0, 0];
    this.alpha = 40;
    this.col1 = "#0077B6";
    this.col2 = "#00B4D8";
    this.col3 = "#90E0EF";
    this.col4 = "#CAF0F8";
    this.col5 = "#CAF0E3";
    this.colors = [this.col1, this.col2, this.col3, this.col4, this.col4];
    this.img = function () {
      loadColorsFromImage();
    };
  }

  randomColor() {
    var index = floor(random(0, this.colors.length));
    return this.colors[index];
  }
}

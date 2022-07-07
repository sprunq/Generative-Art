var runOnce = true;
var f0, f1, f2;
var root;
function setup() {
  createCanvas(1000, 800);
  root = {
    cWhite: color(255),
    cBlack: color(0),
    cGrey: color(200),
    cPurple: color(51, 26, 102),
    cWineRed: color(77, 13, 13),
    cWhiteGrey: color(230),
    cClouds: color(230),
    cLighterWineRed: color(128, 51, 51),
    cBlue: color(0, 190, 255),
    cGreen: color(0, 100, 0),
    cBrown: color(181, 114, 42),
    cLightBlue: color(97, 255, 255),
    cTurquoise: color(0, 180, 130),
    cYellow: color(255, 252, 94),
    cPink: color(255, 94, 244),
    cSand: color(255, 244, 140),

    pattern_scale: 500,
    pattern_octaves: 7,
    pattern_lacunarity: 2,
    pattern_gain: 0.7,
  };
}

function render() {
  loadPixels();
  var startY = (frameCount - 1) * 10;
  var endY = frameCount * 10;

  for (var y = startY; y < endY; y++) {
    for (var x = 0; x < width; x++) {
      var values = pattern(
        x,
        y,
        root.pattern_scale,
        root.pattern_octaves,
        root.pattern_lacunarity,
        root.pattern_gain
      );

      var vecO = createVector(values.o[0], values.o[1]);
      var vecN = createVector(values.n[0], values.n[1]);

      var mappedV = map(values.v, 0.4, 2.1, 0, 1);
      var dotN = vecN.dot(vecN);
      var mapDotN = map(dotN, 0000, 10000, 0, 1);
      var v = values.v * 128;

      var col1 = lerpColor(
        root.cBlack,
        root.cGreen,
        map(dotN, 0000, 10000, 0, 1)
      );
      var col2 = lerpColor(col1, root.cSand, map(values.v, 3500, 5000, 0, 0.8));
      var col2_1 = lerpColor(col2, root.cGreen, map(dotN, 2000, 9000, 0, 0.7));
      var col2_2 = lerpColor(col2_1, root.cGrey, map(dotN, 8000, 1000, 0, 1));
      var col2_3 = lerpColor(col2_2, root.cBlue, map(dotN, 0, 6000, 1, 0));
      var col3 = lerpColor(
        col2_3,
        root.cClouds,
        sin(vecO.x / 40) *
          cos(vecO.y / 40) *
          noise(vecN.x / 80, vecN.y / 80) *
          0
      );
      var col4 = lerpColor(
        col3,
        root.cBlack,
        //0.1 * smoothstep(1.2, 1.3, abs(vecN.y) / 40 + abs(vecN.x) / 40)
        1 - map(values.v, 0, 0.7, 0, 1)
      );

      set(x, y, col4);
    }
  }
  updatePixels();
}

function draw() {
  render();
}

function fbm(x, y, scale, octaves, lacunarity, gain) {
  scale = scale || 1;
  octaves = octaves || 1;
  lacunarity = lacunarity || 2;
  gain = gain || 0.5;

  var total = 0;
  var amplitude = 1;
  var frequency = 1;

  for (var i = 0; i < octaves; i++) {
    var v = noise((x / scale) * frequency, (y / scale) * frequency) * amplitude;
    total = total + v;
    frequency = frequency * lacunarity;
    amplitude = amplitude * gain;
  }

  return total;
}

function pattern(x, y, scale, octaves, lacunarity, gain) {
  var q = [
    fbm(x, y, scale, octaves, lacunarity, gain) * 40,
    fbm(x + 5.2, y + 1.3, scale, octaves, lacunarity, gain) * 40,
  ];

  var r = [
    fbm(
      x + 4.0 * q[0] + 1.7,
      y + 8.0 * q[1] + 9.2,
      scale,
      octaves,
      lacunarity,
      gain
    ) * 40,
    fbm(
      x + 4.0 * q[0] + 8.3,
      y + 6.0 * q[1] + 2.8,
      scale,
      octaves,
      lacunarity,
      gain
    ) * 40,
  ];

  return {
    v: fbm(x + 4.0 * r[0], y + 5.0 * r[1], scale, octaves, lacunarity, gain),
    o: q,
    n: r,
  };
}

function smoothstep(edge0, edge1, x) {
  x = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
  return x * x * (3 - 2 * x);
}

function clamp(x, lowerlimit, upperlimit) {
  if (x < lowerlimit) x = lowerlimit;
  if (x > upperlimit) x = upperlimit;
  return x;
}

function mouseClicked() {
  var values = pattern(
    mouseX,
    mouseY,
    root.pattern_scale,
    root.pattern_octaves,
    root.pattern_lacunarity,
    root.pattern_gain
  );
  var vecO = createVector(values.o[0], values.o[1]);
  var vecN = createVector(values.n[0], values.n[1]);
  var dotN = vecN.dot(vecN);
  values["dotN"] = dotN;
  console.log(values);
}

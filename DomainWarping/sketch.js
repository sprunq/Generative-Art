var runOnce = true;
var f0, f1, f2;
var root;
function setup() {
  createCanvas(3840, 2160);
  root = {
    cWhite: color(255),
    cBlack: color(0),
    cGrey: color(50),
    cPurple: color(51, 26, 102),
    cWineRed: color(77, 13, 13),
    cWhiteGrey: color(230),
    cClouds: color(230),
    cLighterWineRed: color(128, 51, 51),
    cBlue: color(0, 190, 255),
    cGreen: color(0, 100, 0),
    cBrown: color(181, 114, 42),
    cLightBlue: color(97, 255, 255),

    pattern_scale: 800,
    pattern_octaves: 5,
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
      var mapDotN = map(dotN, 4000, 11000, 0, 1);
      var v = values.v * 128;

      var col1 = lerpColor(root.cBlack, root.cBlue, mappedV * 0.8);
      var col2 = lerpColor(col1, root.cBrown, mapDotN);
      var col2_1 = lerpColor(col2, root.cWhiteGrey, mapDotN * 0.5);
      var col3 = lerpColor(
        col2_1,
        root.cClouds,
        sin(vecO.x / 40) *
          cos(vecO.y / 40) *
          noise(vecN.x / 80, vecN.y / 80) *
          0
      );
      var col4 = lerpColor(
        col3,
        root.cBlack,
        0.1 * smoothstep(1.2, 1.3, abs(vecN.y) / 40 + abs(vecN.x) / 40)
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
      y + 4.0 * q[1] + 9.2,
      scale,
      octaves,
      lacunarity,
      gain
    ) * 40,
    fbm(
      x + 4.0 * q[0] + 8.3,
      y + 4.0 * q[1] + 2.8,
      scale,
      octaves,
      lacunarity,
      gain
    ) * 40,
  ];

  return {
    v: fbm(x + 4.0 * r[0], y + 4.0 * r[1], scale, octaves, lacunarity, gain),
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

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderCircles = renderCircles;
exports.createCircles = createCircles;

var _fractal = require('./fractal');

var _color = require('./color');

function renderCircles(svgSettings, circles) {
  var outputScale = svgSettings.outputScale;


  var renderString = '';
  var i = 0;
  for (i = 0; i < circles.length; i++) {
    var _circles$i = circles[i],
        x = _circles$i.x,
        y = _circles$i.y,
        r = _circles$i.r,
        strokeWidth = _circles$i.strokeWidth,
        strokeColor = _circles$i.strokeColor;

    renderString += '<circle cx="' + x * outputScale + '" cy="' + y * outputScale + '" r="' + r * outputScale + '" style="stroke: ' + strokeColor + '; stroke-width: ' + strokeWidth + '; fill: none;" />';
  }

  return renderString;
}

function createCircleAtPoint(baseX, baseY, settings, pixelColor) {
  var applyFractalDisplacement = settings.applyFractalDisplacement,
      radius = settings.radius,
      radiusOnColor = settings.radiusOnColor,
      radiusRandomness = settings.radiusRandomness,
      strokeColor = settings.strokeColor,
      strokeWidth = settings.strokeWidth,
      strokeWidthRandomness = settings.strokeWidthRandomness;


  var x = baseX;
  var y = baseY;

  var circleRadius = radius;
  if (radiusOnColor) {
    circleRadius = (0, _color.getPixelColorIntensity)(pixelColor, settings) * radius;
  }

  circleRadius *= 1 - Math.random() * radiusRandomness;

  var circle = { x: x, y: y,
    r: circleRadius,
    strokeColor: strokeColor,
    strokeWidth: strokeWidth * (1 - Math.random() * strokeWidthRandomness)
  };

  if (applyFractalDisplacement) {
    var _getFractalDispacemen = (0, _fractal.getFractalDispacementForPoint)(circle.x, circle.y, settings),
        xDisplacement = _getFractalDispacemen.xDisplacement,
        yDisplacement = _getFractalDispacemen.yDisplacement;

    circle.x += xDisplacement;
    circle.y += yDisplacement;
  }

  return circle;
}

function createCircles(settings, imageData, width, height) {
  var renderEveryXPixels = settings.renderEveryXPixels,
      renderEveryYPixels = settings.renderEveryYPixels;


  var circles = [];

  for (var x = 0; x < width; x += renderEveryXPixels) {
    for (var y = 0; y < height; y += renderEveryYPixels) {
      var pixelColor = (0, _color.getPixelColorAtXY)(imageData, x, y, width);
      if (!(0, _color.isInColorThreshhold)(pixelColor, settings)) {
        continue;
      }

      circles.push(createCircleAtPoint(x, y, settings, pixelColor));
    }
  }

  return circles;
}
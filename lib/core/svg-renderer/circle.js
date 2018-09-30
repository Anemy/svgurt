'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderCircles = renderCircles;
exports.createCircles = createCircles;

var _fractal = require('./fractal');

var _color = require('./color');

function renderCircles(svgSettings, circles) {
  var fill = svgSettings.fill,
      fillColor = svgSettings.fillColor,
      scale = svgSettings.scale,
      stroke = svgSettings.stroke;


  var renderString = '';
  var i = 0;
  for (i = 0; i < circles.length; i++) {
    var _circles$i = circles[i],
        x = _circles$i.x,
        y = _circles$i.y,
        r = _circles$i.r,
        strokeWidth = _circles$i.strokeWidth,
        strokeColor = _circles$i.strokeColor;

    renderString += '<circle cx="' + x * scale + '" cy="' + y * scale + '" r="' + r * scale + '" style="stroke: ' + (stroke ? strokeColor : 'none') + '; stroke-width: ' + strokeWidth + '; fill: ' + (fill ? fillColor : 'none') + ';" />';
  }

  return renderString;
}

function createCircleAtPoint(baseX, baseY, settings, pixelColor) {
  var autoColor = settings.autoColor,
      applyFractalDisplacement = settings.applyFractalDisplacement,
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

  var circleColor = autoColor ? 'rgb(' + pixelColor.r + ', ' + pixelColor.g + ', ' + pixelColor.b + ')' : strokeColor;

  var circle = {
    x: x,
    y: y,
    r: circleRadius,
    strokeColor: circleColor,
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
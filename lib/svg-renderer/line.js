'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderLines = renderLines;
exports.createLines = createLines;

var _fractal = require('./fractal');

var _color = require('./color');

function renderLines(svgSettings, lines) {
  var outputScale = svgSettings.outputScale;


  var renderString = '';
  var i = 0;
  for (i = 0; i < lines.length; i++) {
    var _lines$i = lines[i],
        x1 = _lines$i.x1,
        y1 = _lines$i.y1,
        x2 = _lines$i.x2,
        y2 = _lines$i.y2,
        strokeWidth = _lines$i.strokeWidth,
        strokeColor = _lines$i.strokeColor;

    renderString += '<line x1="' + x1 * outputScale + '" y1="' + y1 * outputScale + '" x2="' + x2 * outputScale + '" y2="' + y2 * outputScale + '" style="stroke: ' + strokeColor + '; stroke-width: ' + strokeWidth + '" />';
  }

  return renderString;
}

var VERTICAL_THRESHOLD = 100000;
var HORIZONTAL_THRESHOLD = 0.000001;
function createContinuousLine(lineNumber, width, height, dir, settings) {
  var amountOfLines = settings.amountOfLines,
      _settings$offset = settings.offset,
      offset = _settings$offset === undefined ? 0 : _settings$offset,
      strokeColor = settings.strokeColor,
      strokeWidth = settings.strokeWidth,
      strokeWidthRandomness = settings.strokeWidthRandomness;


  var run = Math.cos(dir * (Math.PI / 180));
  var rise = Math.sin(dir * (Math.PI / 180));
  var slope = run !== 0 ? rise / run : 0;

  var lineIteration = lineNumber / amountOfLines;

  var x1 = void 0;
  var y1 = void 0;
  var x2 = void 0;
  var y2 = void 0;

  if (Math.abs(slope) > VERTICAL_THRESHOLD) {
    // Super high or negative slope is vertical.
    x1 = lineIteration * width;
    y1 = height;
    x2 = lineIteration * width;
    y2 = 0;
  } else if (slope > 0) {
    // Positive will go to the bottom right. LEFT & TOP Origins
    var linesStartX = -height / slope;
    var distanceToWidth = Math.abs(linesStartX) + width;
    var startX = lineIteration * distanceToWidth + linesStartX + offset;

    if (startX + height / slope > width) {
      x1 = width;
      y1 = Math.max(0, (-startX + width) * slope);
    } else {
      x1 = Math.max(0, startX + height / slope);
      y1 = height;
    }

    if (startX < 0) {
      x2 = 0;
      y2 = Math.min(height, -startX * slope);
    } else {
      x2 = startX;
      y2 = 0;
    }
  } else if (slope < 0) {
    // Negative will go to the top right. LEFT & BOTTOM Origins
    var _linesStartX = height / slope;
    var _distanceToWidth = Math.abs(_linesStartX) + width;
    var _startX = lineIteration * _distanceToWidth + _linesStartX + offset;

    if (_startX < 0) {
      x1 = 0;
      y1 = Math.max(0, height - _startX * slope);
    } else {
      x1 = _startX;
      y1 = height;
    }

    if (_startX - height / slope > width) {
      x2 = width;
      y2 = Math.min(height, height - -(-_startX + width) * slope);
    } else {
      x2 = Math.max(0, _startX - height / slope);
      y2 = 0;
    }
  } else {
    // Horizontal.
    x1 = 0;
    y1 = lineIteration * height;
    x2 = width;
    y2 = lineIteration * height;
  }

  var line = { x1: x1, y1: y1, x2: x2, y2: y2,
    dir: dir,
    strokeColor: strokeColor,
    strokeWidth: strokeWidth * (1 - Math.random() * strokeWidthRandomness)
  };

  return line;
}

function createContinuousLines(lineNumber, width, height, settings) {
  var crossHatch = settings.crossHatch,
      direction = settings.direction,
      directionRandomness = settings.directionRandomness;


  var lines = [];

  var dir = -direction + 180 * directionRandomness * Math.random();

  lines.push(createContinuousLine(lineNumber, width, height, dir, settings));

  if (crossHatch) {
    var perpendicularDir = dir > -90 ? dir - 90 : dir + 90;
    lines.push(createContinuousLine(lineNumber, width, height, perpendicularDir, settings));
  }

  return lines;
}

function createLineAtPoint(x, y, settings, pixelColor) {
  var applyFractalDisplacement = settings.applyFractalDisplacement,
      displaceOrigin = settings.displaceOrigin,
      direction = settings.direction,
      directionRandomness = settings.directionRandomness,
      lineLength = settings.lineLength,
      lengthOnColor = settings.lengthOnColor,
      lengthRandomness = settings.lengthRandomness,
      strokeColor = settings.strokeColor,
      strokeWidth = settings.strokeWidth,
      strokeWidthRandomness = settings.strokeWidthRandomness;


  var x1 = x;
  var y1 = y;

  var lengthOfLine = lineLength;
  if (lengthOnColor) {
    lengthOfLine = (0, _color.getPixelColorIntensity)(pixelColor, settings) * lengthOfLine;
  }

  var dir = -direction + 180 * directionRandomness * Math.random();
  var xMove = lengthOfLine * Math.cos(dir * (Math.PI / 180));
  var yMove = lengthOfLine * Math.sin(dir * (Math.PI / 180));

  var lenRandom = 1 - Math.random() * lengthRandomness;
  var x2 = x1 + xMove * lenRandom;
  var y2 = y1 + yMove * lenRandom;

  var line = { x1: x1, y1: y1, x2: x2, y2: y2,
    strokeColor: strokeColor,
    strokeWidth: strokeWidth * (1 - Math.random() * strokeWidthRandomness)
  };

  if (applyFractalDisplacement) {
    if (displaceOrigin) {
      var _getFractalDispacemen = (0, _fractal.getFractalDispacementForPoint)(line.x1, line.y1, settings),
          _xDisplacement = _getFractalDispacemen.xDisplacement,
          _yDisplacement = _getFractalDispacemen.yDisplacement;

      line.x1 += _xDisplacement;
      line.y1 += _yDisplacement;
    }

    var _getFractalDispacemen2 = (0, _fractal.getFractalDispacementForPoint)(line.x2, line.y2, settings),
        xDisplacement = _getFractalDispacemen2.xDisplacement,
        yDisplacement = _getFractalDispacemen2.yDisplacement;

    line.x2 += xDisplacement;
    line.y2 += yDisplacement;
  }

  return line;
}

function getLinesAlongLine(guidingLine, width, height, settings, imageData) {
  var applyFractalDisplacement = settings.applyFractalDisplacement,
      displaceOrigin = settings.displaceOrigin,
      minLineLength = settings.minLineLength;
  var dir = guidingLine.dir,
      strokeColor = guidingLine.strokeColor,
      strokeWidth = guidingLine.strokeWidth;


  var linesAlongLine = [];

  var currentX = guidingLine.x1;
  var currentY = guidingLine.y1;
  var pixelInThreshold = void 0;
  var lastPixelInThreshold = void 0;
  var lastX = currentX;
  var lastY = currentY;
  var x1 = currentX;
  var y1 = currentY;

  var tick = 1;
  var tickX = tick * Math.cos(dir * (Math.PI / 180));
  var tickY = tick * Math.sin(dir * (Math.PI / 180));

  if (Math.abs(tickX) > VERTICAL_THRESHOLD) {
    tickX = width;
  }
  if (Math.abs(tickX) < HORIZONTAL_THRESHOLD) {
    tickX = 0;
  }
  if (Math.abs(tickY) > VERTICAL_THRESHOLD) {
    tickY = height;
  }
  if (Math.abs(tickY) < HORIZONTAL_THRESHOLD) {
    tickY = 0;
  }

  var amountOfPixelsInLine = Math.abs(Math.abs(guidingLine.x1) - Math.abs(guidingLine.x2)) + Math.abs(Math.abs(guidingLine.y1) - Math.abs(guidingLine.y2));
  for (var i = 0; i < amountOfPixelsInLine; i++) {
    var pixelColor = (0, _color.getPixelColorAtXY)(imageData, currentX, currentY, width);
    pixelInThreshold = (0, _color.isInColorThreshhold)(pixelColor, settings);
    if (!pixelInThreshold) {
      if (lastPixelInThreshold && Math.abs(Math.abs(x1) - Math.abs(lastX)) + Math.abs(Math.abs(y1) - Math.abs(lastY)) > minLineLength) {
        if (applyFractalDisplacement) {
          if (displaceOrigin) {
            var _getFractalDispacemen3 = (0, _fractal.getFractalDispacementForPoint)(x1, y1, settings),
                _xDisplacement2 = _getFractalDispacemen3.xDisplacement,
                _yDisplacement2 = _getFractalDispacemen3.yDisplacement;

            x1 += _xDisplacement2;
            y1 += _yDisplacement2;
          }

          var _getFractalDispacemen4 = (0, _fractal.getFractalDispacementForPoint)(lastX, lastY, settings),
              xDisplacement = _getFractalDispacemen4.xDisplacement,
              yDisplacement = _getFractalDispacemen4.yDisplacement;

          lastX += xDisplacement;
          lastY += yDisplacement;
        }

        linesAlongLine.push({
          x1: x1, y1: y1, x2: lastX, y2: lastY, strokeColor: strokeColor, strokeWidth: strokeWidth
        });
      }
      x1 = currentX;
      y1 = currentY;
    }
    lastPixelInThreshold = pixelInThreshold;
    lastX = currentX;
    lastY = currentY;
    currentX += tickX;
    currentY += tickY;
  }

  if (lastPixelInThreshold && Math.abs(x1 - lastX) + Math.abs(y1 - lastY) > minLineLength) {
    linesAlongLine.push({
      x1: x1, y1: y1, x2: lastX, y2: lastY, strokeColor: strokeColor, strokeWidth: strokeWidth
    });
  }

  return linesAlongLine;
}

function createLines(settings, imageData, width, height) {
  var amountOfLines = settings.amountOfLines,
      continuous = settings.continuous,
      renderEveryXPixels = settings.renderEveryXPixels,
      renderEveryYPixels = settings.renderEveryYPixels;


  var lines = [];

  var x = 0;
  var y = 0;
  if (continuous) {
    for (var i = 0; i < amountOfLines; i++) {
      var continuousLines = createContinuousLines(i, width, height, settings, imageData);

      for (var m = 0; m < continuousLines.length; m++) {
        var linesAlongLine = getLinesAlongLine(continuousLines[m], width, height, settings, imageData);

        for (var k = 0; k < linesAlongLine.length; k++) {
          lines.push(linesAlongLine[k]);
        }
      }
    }
  } else {
    for (x = 0; x < width; x += renderEveryXPixels) {
      for (y = 0; y < height; y += renderEveryYPixels) {
        var pixelColor = (0, _color.getPixelColorAtXY)(imageData, x, y, width);
        if (!(0, _color.isInColorThreshhold)(pixelColor, settings)) {
          continue;
        }

        lines.push(createLineAtPoint(x, y, settings, pixelColor));
      }
    }
  }

  return lines;
}
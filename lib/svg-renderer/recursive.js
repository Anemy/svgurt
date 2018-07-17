'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderPaths = renderPaths;
exports.createRecursivePaths = createRecursivePaths;

var _fractal = require('./fractal');

var _color = require('./color');

var _ControllerConstants = require('../controller/ControllerConstants');

function renderPaths(svgSettings, paths) {
  var renderString = '';
  for (var i = 0; i < paths.length; i++) {
    var _paths$i = paths[i],
        pathString = _paths$i.pathString,
        strokeWidth = _paths$i.strokeWidth,
        strokeColor = _paths$i.strokeColor;


    renderString += '<path d="' + pathString + '" style="stroke: ' + strokeColor + '; stroke-width: ' + strokeWidth + '; fill: none;" />';
  }

  return renderString;
}

function buildRecursivePath(settings, imageData, x, y, width, height, travelled, stack) {
  // Ensure this is a valid pixel.
  if (x < 0 || y < 0 || x >= width || y >= height) {
    return '';
  }

  if (travelled[x][y]) {
    return '';
  }

  var pixelColor = (0, _color.getPixelColorAtXY)(imageData, x, y, width);
  if (!(0, _color.isInColorThreshhold)(pixelColor, settings)) {
    return '';
  }

  var applyFractalDisplacement = settings.applyFractalDisplacement,
      outputScale = settings.outputScale,
      maxRecursiveDepth = settings.maxRecursiveDepth,
      renderEveryXPixels = settings.renderEveryXPixels,
      renderEveryYPixels = settings.renderEveryYPixels,
      recursiveAlgorithm = settings.recursiveAlgorithm;


  var xPos = x;
  var yPos = y;

  var xBase = x;
  var yBase = y;

  if (applyFractalDisplacement) {
    // if (displaceOrigin) {
    //   const { xDisplacement, yDisplacement } = getFractalDispacementForPoint(xBase, yBase, settings);

    //   xBase += Math.round(xDisplacement / renderEveryXPixels) * renderEveryXPixels;
    //   yBase += Math.round(yDisplacement / renderEveryYPixels) * renderEveryYPixels;
    // }

    var _getFractalDispacemen = (0, _fractal.getFractalDispacementForPoint)(x, y, settings),
        xDisplacement = _getFractalDispacemen.xDisplacement,
        yDisplacement = _getFractalDispacemen.yDisplacement;

    xPos += xDisplacement;
    yPos += yDisplacement;
  }

  var pathString = ' L ' + xPos * outputScale + ' ' + yPos * outputScale;
  travelled[x][y] = true;

  if (stack > maxRecursiveDepth) {
    return pathString;
  }

  var moved = false;
  for (var i = -1; i < 2; i++) {
    for (var k = -1; k < 2; k++) {
      if (i === 0 && k === 0) {
        continue;
      }

      var xMove = void 0;
      var yMove = void 0;

      // eslint-disable-next-line default-case
      switch (recursiveAlgorithm) {
        case _ControllerConstants.RECURSIVE_LINE_ALGORITHMS.first:
          {
            xMove = xBase + renderEveryXPixels * i;
            yMove = yBase + renderEveryYPixels * k;
            break;
          }
        case _ControllerConstants.RECURSIVE_LINE_ALGORITHMS.second:
          {
            xMove = xBase + Math.abs(renderEveryXPixels * i);
            yMove = yBase - renderEveryYPixels * k;
            break;
          }
        case _ControllerConstants.RECURSIVE_LINE_ALGORITHMS.third:
          {
            xMove = xBase + Math.abs(renderEveryXPixels * i);
            yMove = yBase - Math.abs(renderEveryYPixels * k);
            break;
          }
        case _ControllerConstants.RECURSIVE_LINE_ALGORITHMS.fourth:
          {
            xMove = xBase + renderEveryXPixels * i;
            yMove = yBase + renderEveryYPixels * k;
            break;
          }
        case _ControllerConstants.RECURSIVE_LINE_ALGORITHMS.fifth:
          {
            xMove = xBase + Math.abs(renderEveryXPixels * i);
            yMove = yBase + Math.abs(renderEveryYPixels * k);
            break;
          }
      }

      var pathAddition = buildRecursivePath(settings, imageData, xMove, yMove, width, height, travelled, stack + 1);

      if (pathAddition) {
        if (moved) {
          pathString += ' M ' + xPos * outputScale + ' ' + yPos * outputScale;
        } else {
          moved = true;
        }

        pathString += pathAddition;

        if (recursiveAlgorithm === _ControllerConstants.RECURSIVE_LINE_ALGORITHMS.fifth || recursiveAlgorithm === _ControllerConstants.RECURSIVE_LINE_ALGORITHMS.fourth) {
          return pathString;
        }
      }
    }
  }

  return pathString;
}

function createRecursivePaths(settings, imageData, width, height) {
  var autoColor = settings.autoColor,
      outputScale = settings.outputScale,
      renderEveryXPixels = settings.renderEveryXPixels,
      renderEveryYPixels = settings.renderEveryYPixels,
      strokeColor = settings.strokeColor,
      strokeWidth = settings.strokeWidth,
      strokeWidthRandomness = settings.strokeWidthRandomness;


  var travelled = [];
  var paths = [];

  for (var x = 0; x < width; x += renderEveryXPixels) {
    travelled[x] = [];
  }

  for (var _x = 0; _x < width; _x += renderEveryXPixels) {
    for (var y = 0; y < height; y += renderEveryYPixels) {
      var pathString = buildRecursivePath(settings, imageData, _x, y, width, height, travelled, 0);
      var pixelColor = (0, _color.getPixelColorAtXY)(imageData, _x, y, width);
      var pathColor = autoColor ? 'rgb(' + pixelColor.r + ', ' + pixelColor.g + ', ' + pixelColor.b + ')' : strokeColor;

      if (pathString && pathString.length > 0) {
        paths.push({
          pathString: 'M ' + _x * outputScale + ' ' + y * outputScale + ' ' + pathString,
          strokeColor: pathColor,
          strokeWidth: strokeWidth * (1 - Math.random() * strokeWidthRandomness)
        });
      }
    }
  }

  return paths;
}
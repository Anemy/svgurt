'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderCurves = renderCurves;
exports.createCurves = createCurves;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _fractal = require('./fractal');

var _color = require('./color');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function renderCurves(svgSettings, curves) {
  var outputScale = svgSettings.outputScale;


  var renderString = '';

  var _loop = function _loop(i) {
    var _curves$i = curves[i],
        x = _curves$i.x,
        y = _curves$i.y,
        controlPoints = _curves$i.controlPoints,
        strokeWidth = _curves$i.strokeWidth,
        strokeColor = _curves$i.strokeColor;


    var curvePath = 'M ' + x * outputScale + ' ' + y * outputScale + ' C';
    _lodash2.default.each(controlPoints, function (point, index) {
      curvePath += ' ' + point.x * outputScale + ' ' + point.y * outputScale + (index === controlPoints.length - 1 ? '' : ',');
    });

    renderString += '<path d="' + curvePath + '" style="stroke: ' + strokeColor + '; stroke-width: ' + strokeWidth + '; fill: none;" />';
  };

  for (var i = 0; i < curves.length; i++) {
    _loop(i);
  }

  return renderString;
}

function createCurveAtPoint(baseX, baseY, settings, pixelColor) {
  var autoColor = settings.autoColor,
      amplitude = settings.amplitude,
      amplitudeRandomness = settings.amplitudeRandomness,
      applyFractalDisplacement = settings.applyFractalDisplacement,
      direction = settings.direction,
      directionRandomness = settings.directionRandomness,
      displaceOrigin = settings.displaceOrigin,
      strokeColor = settings.strokeColor,
      strokeWidth = settings.strokeWidth,
      strokeWidthRandomness = settings.strokeWidthRandomness,
      wavelength = settings.wavelength,
      wavelengthRandomness = settings.wavelengthRandomness,
      waves = settings.waves,
      wavesRandomness = settings.wavesRandomness;


  var x = baseX;
  var y = baseY;

  var curveColor = autoColor ? 'rgb(' + pixelColor.r + ', ' + pixelColor.g + ', ' + pixelColor.b + ')' : strokeColor;

  if (applyFractalDisplacement) {
    var _getFractalDispacemen = (0, _fractal.getFractalDispacementForPoint)(baseX, baseY, settings),
        xDisplacement = _getFractalDispacemen.xDisplacement,
        yDisplacement = _getFractalDispacemen.yDisplacement;

    x += xDisplacement;
    y += yDisplacement;
  }

  var dir = -direction + 180 * directionRandomness * Math.random();
  var xDir = Math.cos(dir * (Math.PI / 180));
  var yDir = Math.sin(dir * (Math.PI / 180));
  var inverseXDir = Math.cos((dir - 90) * (Math.PI / 180));
  var inverseYDir = Math.sin((dir - 90) * (Math.PI / 180));
  var wavelen = wavelength * (1 - Math.random() * wavelengthRandomness);
  var amp = amplitude * (1 - Math.random() * amplitudeRandomness);
  var wavAmount = Math.round(waves * (1 - Math.random() * wavesRandomness));
  var controlPoints = [];
  for (var i = 0; i < wavAmount; i++) {
    controlPoints.push({
      x: x + ((i * wavelen + wavelen / 4) * xDir + inverseXDir * amp),
      y: y + ((i * wavelen + wavelen / 4) * yDir + inverseYDir * amp)
    }, {
      x: x + ((i * wavelen + wavelen * (3 / 4)) * xDir - inverseXDir * amp),
      y: y + ((i * wavelen + wavelen * (3 / 4)) * yDir - inverseYDir * amp)
    }, {
      x: x + (i + 1) * wavelen * xDir,
      y: y + (i + 1) * wavelen * yDir
    });

    if (displaceOrigin) {
      for (var k = controlPoints.length - 3; k < controlPoints.length; k++) {
        var _getFractalDispacemen2 = (0, _fractal.getFractalDispacementForPoint)(controlPoints[k].x, controlPoints[k].y, settings),
            _xDisplacement = _getFractalDispacemen2.xDisplacement,
            _yDisplacement = _getFractalDispacemen2.yDisplacement;

        controlPoints[k].x += _xDisplacement;
        controlPoints[k].y += _yDisplacement;
      }
    }
  }

  var curve = {
    x: x,
    y: y,
    controlPoints: controlPoints,
    strokeColor: curveColor,
    strokeWidth: strokeWidth * (1 - Math.random() * strokeWidthRandomness)
  };

  return curve;
}

function createCurves(settings, imageData, width, height) {
  var renderEveryXPixels = settings.renderEveryXPixels,
      renderEveryYPixels = settings.renderEveryYPixels;


  var curves = [];

  for (var x = 0; x < width; x += renderEveryXPixels) {
    for (var y = 0; y < height; y += renderEveryYPixels) {
      var pixelColor = (0, _color.getPixelColorAtXY)(imageData, x, y, width);
      if (!(0, _color.isInColorThreshhold)(pixelColor, settings)) {
        continue;
      }

      curves.push(createCurveAtPoint(x, y, settings, pixelColor));
    }
  }

  return curves;
}
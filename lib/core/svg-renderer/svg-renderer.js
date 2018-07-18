'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _setImmediate2 = require('babel-runtime/core-js/set-immediate');

var _setImmediate3 = _interopRequireDefault(_setImmediate2);

exports.renderSvgString = renderSvgString;

var _ControllerConstants = require('../ControllerConstants');

var _circle = require('./circle');

var _curve = require('./curve');

var _line = require('./line');

var _recursive = require('./recursive');

var _concentric = require('./concentric');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function renderSvgString(imageData, svgSettings, width, height, done) {
  var outputScale = svgSettings.outputScale;


  (0, _setImmediate3.default)(function () {
    var dimensionsString = 'height="' + height * outputScale + '" width="' + width * outputScale + '"';
    var nameSpaceString = 'xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"';
    var svgString = '<svg ' + dimensionsString + ' ' + nameSpaceString + '>';

    // eslint-disable-next-line default-case
    switch (svgSettings.svgRenderType) {
      case _ControllerConstants.SVG_RENDER_TYPES.CIRCLE:
        {
          var circles = (0, _circle.createCircles)(svgSettings, imageData, width, height);

          svgString += (0, _circle.renderCircles)(svgSettings, circles);
          break;
        }
      case _ControllerConstants.SVG_RENDER_TYPES.CURVE:
        {
          var curves = (0, _curve.createCurves)(svgSettings, imageData, width, height);

          svgString += (0, _curve.renderCurves)(svgSettings, curves);
          break;
        }
      case _ControllerConstants.SVG_RENDER_TYPES.LINE:
        {
          var lines = (0, _line.createLines)(svgSettings, imageData, width, height);

          svgString += (0, _line.renderLines)(svgSettings, lines);
          break;
        }
      case _ControllerConstants.SVG_RENDER_TYPES.RECURSIVE:
        {
          var _lines = (0, _recursive.createRecursivePaths)(svgSettings, imageData, width, height);

          svgString += (0, _recursive.renderPaths)(svgSettings, _lines);
          break;
        }
      case _ControllerConstants.SVG_RENDER_TYPES.CONCENTRIC:
        {
          var concentricPaths = (0, _concentric.createConcentricPaths)(svgSettings, imageData, width, height);

          svgString += (0, _concentric.renderConcentricPaths)(svgSettings, concentricPaths, width / 2, height / 2);
        }
    }

    svgString += '</svg>';

    done(svgString);
  });
}
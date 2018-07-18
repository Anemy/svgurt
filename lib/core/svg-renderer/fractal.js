'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFractalDispacementForPoint = getFractalDispacementForPoint;

var _noise = require('../utils/noise');

var _noise2 = _interopRequireDefault(_noise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getFractalDispacementForPoint(x, y, _ref) {
  var displacementAmount = _ref.displacementAmount,
      fractalRatioX = _ref.fractalRatioX,
      fractalRatioY = _ref.fractalRatioY,
      fractalRandomSeed = _ref.fractalRandomSeed;

  _noise2.default.seed(fractalRandomSeed);

  var angleNoiseValue = Math.abs(_noise2.default.simplex2(x * fractalRatioX, y * fractalRatioY)) * Math.PI * 2;
  var displacementNoiseValue = Math.abs(_noise2.default.simplex2(x * fractalRatioX + 20000, y * fractalRatioY + 20000)) * displacementAmount;

  return {
    xDisplacement: Math.cos(angleNoiseValue) * displacementNoiseValue,
    yDisplacement: Math.sin(angleNoiseValue) * displacementNoiseValue
  };
}
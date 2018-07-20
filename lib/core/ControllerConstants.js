'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.controllerConfig = exports.RECURSIVE_LINE_ALGORITHMS = exports.SVG_RENDER_TYPES = undefined;

var _random = require('./utils/random');

var SVG_RENDER_TYPES = exports.SVG_RENDER_TYPES = {
  CIRCLE: 'CIRCLE',
  CURVE: 'CURVE',
  LINE: 'LINE',
  RECURSIVE: 'RECURSIVE',
  CONCENTRIC: 'CONCENTRIC'
};

var RECURSIVE_LINE_ALGORITHMS = exports.RECURSIVE_LINE_ALGORITHMS = {
  first: 'first',
  second: 'second',
  third: 'third',
  fourth: 'fourth',
  fifth: 'fifth'
};

var controllerConfig = exports.controllerConfig = {
  // General Controls
  'Live Update': {
    default: true
  },

  // Image Controls
  blur: {
    default: 0,
    description: 'Image blur'
  },
  grayscale: {
    default: false
  },
  invert: {
    default: false
  },
  'Edge Detection': {
    default: false
  },
  postBlur: {
    default: 0
  },
  posterize: {
    default: false
  },
  posterizeLevels: {
    default: 5
  },
  lowThreshold: {
    default: 20
  },
  highThreshold: {
    default: 50
  },
  applyFractalField: {
    default: false
  },
  fieldOpacity: {
    default: 0.5
  },
  fieldRatioX: {
    default: 0.01
  },
  fieldRatioY: {
    default: 0.01
  },
  fieldRandomSeed: {
    default: (0, _random.createRandomSeed)()
  },

  // SVG Controls
  amplitude: {
    default: 5
  },
  amplitudeRandomness: {
    default: 0.5
  },
  amountOfLines: {
    default: 150
  },
  continuous: {
    default: false
  },
  crossHatch: {
    default: true
  },
  direction: {
    default: 30
  },
  directionRandomness: {
    default: 0.01
  },
  displaceOrigin: {
    default: false
  },
  lineLength: {
    default: 6
  },
  lengthOnColor: {
    default: true
  },
  lengthRandomness: {
    default: 0.2
  },
  minColorRecognized: {
    default: 50
  },
  maxColorRecognized: {
    default: 200
  },
  maxRecursiveDepth: {
    default: 150
  },
  minLineLength: {
    default: 1
  },
  outputScale: {
    default: 1
  },
  randomSeed: {
    default: (0, _random.createRandomSeed)()
  },
  radius: {
    default: 1.5
  },
  radiusOnColor: {
    default: false
  },
  radiusRandomness: {
    default: 0.25
  },
  recursiveAlgorithm: {
    default: RECURSIVE_LINE_ALGORITHMS.fifth
  },
  renderEveryXPixels: {
    default: 5
  },
  renderEveryYPixels: {
    default: 5
  },
  startAtCenterOfShapes: {
    default: false
  },
  strokeColor: {
    default: 'rgb(28, 32, 38)'
  },
  strokeWidth: {
    default: 1
  },
  strokeWidthRandomness: {
    default: 0.1
  },
  svgRenderType: {
    default: SVG_RENDER_TYPES.RECURSIVE
  },
  wavelength: {
    default: 3
  },
  wavelengthRandomness: {
    default: 0.5
  },
  waves: {
    default: 3
  },
  wavesRandomness: {
    default: 0.5
  },
  applyFractalDisplacement: {
    default: false
  },
  displacementAmount: {
    default: 5
  },
  fractalRatioX: {
    default: 0.01
  },
  fractalRatioY: {
    default: 0.01
  },
  fractalRandomSeed: {
    default: (0, _random.createRandomSeed)()
  },
  chooseSVGRenderType: {
    default: function _default() {}
  },
  autoColor: {
    default: false
  },
  arcUnits: {
    default: 200
  },
  intensityWeight: {
    default: 100000
  },
  radiusStep: {
    default: 5
  }
};
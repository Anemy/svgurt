'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RECURSIVE_LINE_ALGORITHMS = exports.SVG_RENDER_TYPES = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

exports.updateRenderType = updateRenderType;
exports.createController = createController;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _dat = require('dat.gui');

var _dat2 = _interopRequireDefault(_dat);

require('./Controller.css');

var _random = require('../utils/random');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SVG_RENDER_TYPES = exports.SVG_RENDER_TYPES = {
  CIRCLE: 'CIRCLE',
  CURVE: 'CURVE',
  LINE: 'LINE',
  RECURSIVE: 'RECURSIVE'
};

var RECURSIVE_LINE_ALGORITHMS = exports.RECURSIVE_LINE_ALGORITHMS = {
  first: 'first',
  second: 'second',
  third: 'third',
  fourth: 'fourth',
  fifth: 'fifth'
};

function openLinkInNewTab(url) {
  (0, _assign2.default)(document.createElement('a'), {
    target: '_blank',
    href: url,
    rel: 'noopener noreferrer'
  }).click();
}

// const controllerConfig = {
//   blur: {

//   }
// };

var ControllerControls = function () {
  function ControllerControls() {
    (0, _classCallCheck3.default)(this, ControllerControls);
    this.blur = 0;
    this.grayscale = true;
    this.invert = true;
    this.cannyEdgeDetection = false;
    this.postBlur = 0;
    this.posterize = false;
    this.posterizeLevels = 5;
    this.lowThreshold = 20;
    this.highThreshold = 50;
    this.applyFractalField = false;
    this.fieldOpacity = 0.5;
    this.fieldRatioX = 0.01;
    this.fieldRatioY = 0.01;
    this.fieldRandomSeed = (0, _random.createRandomSeed)();
    this.amplitude = 5;
    this.amplitudeRandomness = 0.5;
    this.amountOfLines = 150;
    this.continuous = false;
    this.crossHatch = true;
    this.direction = 30;
    this.directionRandomness = 0.01;
    this.displaceOrigin = false;
    this.length = 6;
    this.lengthOnColor = true;
    this.lengthRandomness = 0.2;
    this.minColorRecognized = 50;
    this.maxColorRecognized = 255;
    this.maxRecursiveDepth = 150;
    this.minLineLength = 1;
    this.outputScale = 1;
    this.randomSeed = (0, _random.createRandomSeed)();
    this.radius = 1.5;
    this.radiusOnColor = false;
    this.radiusRandomness = 0.25;
    this.resurseBehindNonMatching = false;
    this.recursiveAlgorithm = RECURSIVE_LINE_ALGORITHMS.fifth;
    this.renderEveryXPixels = 5;
    this.renderEveryYPixels = 5;
    this.startAtCenterOfShapes = false;
    this.strokeColor = 'rgb(28, 32, 38)';
    this.strokeWidth = 1;
    this.strokeWidthRandomness = 0.1;
    this.svgRenderType = SVG_RENDER_TYPES.RECURSIVE;
    this.wavelength = 3;
    this.wavelengthRandomness = 0.5;
    this.waves = 3;
    this.wavesRandomness = 0.5;
    this.applyFractalDisplacement = false;
    this.displacementAmount = 5;
    this.fractalRatioX = 0.01;
    this.fractalRatioY = 0.01;
    this.fractalRandomSeed = (0, _random.createRandomSeed)();
    this['Live Update'] = true;
  }

  (0, _createClass3.default)(ControllerControls, [{
    key: 'Import New Image',
    value: function ImportNewImage() {}

    // Image Controls


    // SVG Controls

  }, {
    key: 'chooseSVGRenderType',
    value: function chooseSVGRenderType() {}
  }, {
    key: 'Download SVG',
    value: function DownloadSVG() {}

    // General Controls

  }, {
    key: 'Github',


    // About
    value: function Github() {
      openLinkInNewTab('https://github.com/Anemy/svgurt');
    }
  }]);
  return ControllerControls;
}();

function updateRenderType(controller) {
  var newRenderType = controller.settings.svgRenderType;
  var svgFolder = controller.svgFolder;

  _lodash2.default.each(controller.svgChangingControls, function (svgRenderSettingController) {
    svgFolder.remove(svgRenderSettingController);
  });
  controller.svgChangingControls = {};
  _lodash2.default.each(controller.svgRenderChangingControls, function (svgRenderChangingController) {
    svgFolder.remove(svgRenderChangingController);
  });
  controller.svgRenderChangingControls = {};

  var mainController = controller.settings;

  controller.svgRenderChangingControls.svgRenderType = svgFolder.add(mainController, 'svgRenderType', _lodash2.default.keys(SVG_RENDER_TYPES));

  // eslint-disable-next-line default-case
  switch (newRenderType) {
    case SVG_RENDER_TYPES.CIRCLE:
      {
        controller.svgChangingControls['strokeWidth'] = svgFolder.add(mainController, 'strokeWidth', 0, 20);
        controller.svgChangingControls['strokeWidthRandomness'] = svgFolder.add(mainController, 'strokeWidthRandomness', 0, 1);
        controller.svgChangingControls['renderEveryXPixels'] = svgFolder.add(mainController, 'renderEveryXPixels', 1, 50).step(1);
        controller.svgChangingControls['renderEveryYPixels'] = svgFolder.add(mainController, 'renderEveryYPixels', 1, 50).step(1);
        // controller.svgChangingControls['continuous'] = svgFolder.add(mainController, 'continuous');
        controller.svgChangingControls['radius'] = svgFolder.add(mainController, 'radius', 0, 50);
        controller.svgChangingControls['radiusOnColor'] = svgFolder.add(mainController, 'radiusOnColor');
        controller.svgChangingControls['radiusRandomness'] = svgFolder.add(mainController, 'radiusRandomness', 0, 1);
        break;
      }
    case SVG_RENDER_TYPES.CURVE:
      {
        controller.svgChangingControls['strokeWidth'] = svgFolder.add(mainController, 'strokeWidth', 0, 20);
        controller.svgChangingControls['strokeWidthRandomness'] = svgFolder.add(mainController, 'strokeWidthRandomness', 0, 1);
        controller.svgChangingControls['renderEveryXPixels'] = svgFolder.add(mainController, 'renderEveryXPixels', 1, 50).step(1);
        controller.svgChangingControls['renderEveryYPixels'] = svgFolder.add(mainController, 'renderEveryYPixels', 1, 50).step(1);
        controller.svgChangingControls['waves'] = svgFolder.add(mainController, 'waves', 0, 50);
        controller.svgChangingControls['wavesRandomness'] = svgFolder.add(mainController, 'wavesRandomness', 0, 1);
        controller.svgChangingControls['direction'] = svgFolder.add(mainController, 'direction', 0, 180);
        controller.svgChangingControls['directionRandomness'] = svgFolder.add(mainController, 'directionRandomness', 0, 1);
        controller.svgChangingControls['amplitude'] = svgFolder.add(mainController, 'amplitude', 0, 50);
        controller.svgChangingControls['amplitudeRandomness'] = svgFolder.add(mainController, 'amplitudeRandomness', 0, 1);
        // controller.svgRenderChangingControls['continuous'] = svgFolder.add(mainController, 'continuous');
        // if (!mainController.continuous) {
        controller.svgChangingControls['wavelength'] = svgFolder.add(mainController, 'wavelength', 0, 50);
        controller.svgChangingControls['wavelengthRandomness'] = svgFolder.add(mainController, 'wavelengthRandomness', 0, 1);
        // }
        break;
      }
    case SVG_RENDER_TYPES.LINE:
      {
        controller.svgChangingControls['strokeWidth'] = svgFolder.add(mainController, 'strokeWidth', 0, 20);
        controller.svgChangingControls['strokeWidthRandomness'] = svgFolder.add(mainController, 'strokeWidthRandomness', 0, 1);
        controller.svgRenderChangingControls['continuous'] = svgFolder.add(mainController, 'continuous');
        if (!mainController.continuous) {
          controller.svgChangingControls['renderEveryXPixels'] = svgFolder.add(mainController, 'renderEveryXPixels', 1, 50).step(1);
          controller.svgChangingControls['renderEveryYPixels'] = svgFolder.add(mainController, 'renderEveryYPixels', 1, 50).step(1);
          controller.svgChangingControls['length'] = svgFolder.add(mainController, 'length', 0, 50);
          controller.svgChangingControls['lengthOnColor'] = svgFolder.add(mainController, 'lengthOnColor');
          controller.svgChangingControls['lengthRandomness'] = svgFolder.add(mainController, 'lengthRandomness', 0, 1);
        } else {
          controller.svgChangingControls['minLineLength'] = svgFolder.add(mainController, 'minLineLength', 1, 50).step(1);
          controller.svgChangingControls['crossHatch'] = svgFolder.add(mainController, 'crossHatch');
          controller.svgChangingControls['amountOfLines'] = svgFolder.add(mainController, 'amountOfLines', 1, 5000).step(1);
        }
        controller.svgChangingControls['direction'] = svgFolder.add(mainController, 'direction', 0, 180);
        controller.svgChangingControls['directionRandomness'] = svgFolder.add(mainController, 'directionRandomness', 0, 1);
        break;
      }
    case SVG_RENDER_TYPES.RECURSIVE:
      {
        controller.svgChangingControls['strokeWidth'] = svgFolder.add(mainController, 'strokeWidth', 0, 20);
        controller.svgChangingControls['strokeWidthRandomness'] = svgFolder.add(mainController, 'strokeWidthRandomness', 0, 1);
        controller.svgChangingControls['renderEveryXPixels'] = svgFolder.add(mainController, 'renderEveryXPixels', 1, 50).step(1);
        controller.svgChangingControls['renderEveryYPixels'] = svgFolder.add(mainController, 'renderEveryYPixels', 1, 50).step(1);
        controller.svgChangingControls['recursiveAlgorithm'] = svgFolder.add(mainController, 'recursiveAlgorithm', _lodash2.default.keys(RECURSIVE_LINE_ALGORITHMS));
        controller.svgChangingControls['maxRecursiveDepth'] = svgFolder.add(mainController, 'maxRecursiveDepth', 1, 1000).step(1);
        break;
      }
  }
}

var datConfig = {
  // load: JSON, // When we have some states.
  useLocalStorage: true
};

function createController() {
  var gui = new _dat2.default.GUI(datConfig);

  var controller = {
    imageChangingControls: {},
    svgChangingControls: {},
    svgSettingControls: {}
  };

  var mainController = new ControllerControls();

  controller['Import New Image'] = gui.add(mainController, 'Import New Image');

  var imageFolder = gui.addFolder('Image Controls');

  controller.imageChangingControls['grayscale'] = imageFolder.add(mainController, 'grayscale');
  controller.imageChangingControls['blur'] = imageFolder.add(mainController, 'blur', 0, 30).step(1);
  controller.imageChangingControls['invert'] = imageFolder.add(mainController, 'invert');
  var posterizeFolder = imageFolder.addFolder('Posterize');
  controller.imageChangingControls['posterize'] = posterizeFolder.add(mainController, 'posterize');
  controller.imageChangingControls['posterizeLevels'] = posterizeFolder.add(mainController, 'posterizeLevels', 1, 30).step(1);
  var cannyFolder = imageFolder.addFolder('Edge Detection');
  controller.imageChangingControls['cannyEdgeDetection'] = cannyFolder.add(mainController, 'cannyEdgeDetection');
  controller.imageChangingControls['lowThreshold'] = cannyFolder.add(mainController, 'lowThreshold', 0, 128).step(1);
  controller.imageChangingControls['highThreshold'] = cannyFolder.add(mainController, 'highThreshold', 0, 128).step(1);
  var fieldFolder = imageFolder.addFolder('Fractal Field Opacity');
  controller.imageChangingControls['applyFractalField'] = fieldFolder.add(mainController, 'applyFractalField');
  controller.imageChangingControls['fieldOpacity'] = fieldFolder.add(mainController, 'fieldOpacity', 0, 1);
  controller.imageChangingControls['fieldRatioX'] = fieldFolder.add(mainController, 'fieldRatioX', 0, 1);
  controller.imageChangingControls['fieldRatioY'] = fieldFolder.add(mainController, 'fieldRatioY', 0, 1);
  controller.imageChangingControls['fieldRandomSeed'] = fieldFolder.add(mainController, 'fieldRandomSeed', 0, _random.MAX_SEED).step(1);
  controller.imageChangingControls['postBlur'] = imageFolder.add(mainController, 'postBlur', 0, 30).step(1);

  var svgFolder = gui.addFolder('SVG Controls');
  controller.svgFolder = svgFolder;
  controller.svgSettingControls['minColorRecognized'] = svgFolder.add(mainController, 'minColorRecognized', 0, 255).step(1);
  controller.svgSettingControls['maxColorRecognized'] = svgFolder.add(mainController, 'maxColorRecognized', 0, 255).step(1);
  var fractalFolder = svgFolder.addFolder('Displacement Fractal Field');
  controller.svgSettingControls['applyFractalDisplacement'] = fractalFolder.add(mainController, 'applyFractalDisplacement');
  controller.svgSettingControls['displacementAmount'] = fractalFolder.add(mainController, 'displacementAmount', 0, 200);
  controller.svgSettingControls['displaceOrigin'] = fractalFolder.add(mainController, 'displaceOrigin');
  controller.svgSettingControls['fractalRatioX'] = fractalFolder.add(mainController, 'fractalRatioX', 0, 1);
  controller.svgSettingControls['fractalRatioY'] = fractalFolder.add(mainController, 'fractalRatioY', 0, 1);
  controller.svgSettingControls['fractalRandomSeed'] = fractalFolder.add(mainController, 'fractalRandomSeed', 0, _random.MAX_SEED).step(1);
  controller.svgSettingControls['outputScale'] = svgFolder.add(mainController, 'outputScale', 0, 5);
  controller.downloadSvgButton = gui.add(mainController, 'Download SVG');

  controller['Live Update'] = gui.add(mainController, 'Live Update');

  var aboutFolder = gui.addFolder('About');
  controller.Github = aboutFolder.add(mainController, 'Github');

  controller.gui = gui;
  controller.settings = mainController;

  // gui.remember(mainController);

  updateRenderType(controller);

  return controller;
}
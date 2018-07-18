'use strict';

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _imageSize = require('image-size');

var _imageSize2 = _interopRequireDefault(_imageSize);

var _imageManipulator = require('./core/image-manipulator');

var _ControllerConstants = require('./core/ControllerConstants');

var _svgRenderer = require('./core/svg-renderer/svg-renderer');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var configDefaults = {};

_lodash2.default.each(_ControllerConstants.controllerConfig, function (configItem, index) {
  configDefaults[index] = configItem.default;
});

var defaultConfig = (0, _extends3.default)({}, configDefaults, {
  input: 'image.jpg',
  output: 'output',
  returnSVGString: false
});

function runSvgurtOnFile(config, inputFileName, outputFileName, callback) {
  var fileNameToImport = inputFileName.indexOf('./') === 0 ? inputFileName : './' + inputFileName;

  // Get the image dimensions.
  (0, _imageSize2.default)(fileNameToImport, function (err, dimensions) {
    if (err) {
      callback('Error importing image: ' + err);
      return;
    }

    var width = dimensions.width,
        height = dimensions.height;


    _fs2.default.readFile(fileNameToImport, 'utf-8', function (err, data) {
      if (err) {
        callback('Error importing image: ' + err);
        return;
      }

      var imageData = new Buffer(data, 'utf-8');

      var imageDataToUse = {
        data: imageData
      };

      // Do image manipulation - this mutates the image data.
      // It mutates because we're depending on some libraries that mutate it... Not my choice!
      (0, _imageManipulator.manipulateImageData)(imageDataToUse, config, width, height);

      // Run svg creation based on the image data.
      (0, _svgRenderer.renderSvgString)(imageDataToUse.data, config, width, height, function (svgString) {
        // Write svg string to output file name.
        if (config.returnSVGString) {
          callback(false, svgString);
        } else {
          _fs2.default.writeFile(outputFileName + '.svg', svgString, function () {
            callback(false);
          });
        }
      });
    });
  });
}

module.exports = function (config, callback) {
  var svgurtConfig = (0, _extends3.default)({}, defaultConfig, config);

  if (_lodash2.default.isArray(svgurtConfig.input)) {
    var isOutputArray = _lodash2.default.isArray(svgurtConfig.output);

    _lodash2.default.each(svgurtConfig.input, function (inputFileName, index) {
      if (isOutputArray && svgurtConfig.output[index]) {
        runSvgurtOnFile(svgurtConfig, inputFileName, svgurtConfig.output[index], callback);
      } else {
        // If they don't supply a corresponding output file name then we just use the input file name.
        runSvgurtOnFile(svgurtConfig, inputFileName, inputFileName, callback);
      }
    });
  } else {
    if (_lodash2.default.isArray(svgurtConfig.output)) {
      if (_lodash2.default.isEmpty(svgurtConfig.output)) {
        svgurtConfig.output = defaultConfig.output;
      } else {
        // Can't have an output array with out an input array.
        svgurtConfig.output = _lodash2.default.first(svgurtConfig.output);
      }
    }

    runSvgurtOnFile(svgurtConfig, svgurtConfig.input, svgurtConfig.output, callback);
  }
};
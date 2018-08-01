"use strict";

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _getPixels = require("get-pixels");

var _getPixels2 = _interopRequireDefault(_getPixels);

var _imageManipulator = require("./core/image-manipulator");

var _ControllerConstants = require("./core/ControllerConstants");

var _svgRenderer = require("./core/svg-renderer/svg-renderer");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var configDefaults = {};

_lodash2.default.each(_ControllerConstants.controllerConfig, function (configItem, index) {
  configDefaults[index] = configItem.default;
});

var defaultConfig = (0, _extends3.default)({}, configDefaults, {
  input: "image.jpg",
  output: "output",
  returnSVGString: false
});

function runSvgurtOnFile(config, inputFileName, outputFileName, callback) {
  var fileNameToImport = _path2.default.join(__dirname, "..", inputFileName);

  (0, _getPixels2.default)(fileNameToImport, function (err, pixels) {
    if (err) {
      callback("Error importing image: " + err);
      return;
    }

    var width = pixels.shape[0];
    var height = pixels.shape[1];

    var imageDataToUse = {
      data: pixels.data
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
        _fs2.default.writeFile(outputFileName + ".svg", svgString, function () {
          callback(false);
        });
      }
    });
  });
}

module.exports = function (config, callback) {
  var svgurtConfig = (0, _extends3.default)({}, defaultConfig, config);

  if (_lodash2.default.isArray(svgurtConfig.input)) {
    var isOutputArray = _lodash2.default.isArray(svgurtConfig.output);

    var done = 0;
    var svgStrings = [];
    var errStrings = [];

    _lodash2.default.each(svgurtConfig.input, function (inputFileName, index) {
      var doneFunction = function doneFunction(err, output) {
        done++;

        if (err) {
          errStrings.push(err);
        } else if (config.returnSVGString) {
          svgStrings.push(output);
        }

        if (done === svgurtConfig.input.length) {
          callback(_lodash2.default.isEmpty(errStrings) ? false : errStrings, svgStrings);
        }
      };

      if (isOutputArray && svgurtConfig.output[index]) {
        runSvgurtOnFile(svgurtConfig, inputFileName, svgurtConfig.output[index], doneFunction);
      } else {
        // If they don't supply a corresponding output file name then we just use the input file name.
        runSvgurtOnFile(svgurtConfig, inputFileName, inputFileName, doneFunction);
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
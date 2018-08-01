"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.manipulateImageData = manipulateImageData;

var _jsfeat = require("jsfeat");

var _jsfeat2 = _interopRequireDefault(_jsfeat);

var _stackblurCanvas = require("stackblur-canvas");

var _stackblurCanvas2 = _interopRequireDefault(_stackblurCanvas);

var _noise = require("./utils/noise");

var _noise2 = _interopRequireDefault(_noise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function grayScale(imageData, width, height) {
  var grayImageMatrix = new _jsfeat2.default.matrix_t(width, height, _jsfeat2.default.U8C1_t);

  _jsfeat2.default.imgproc.grayscale(imageData.data, width, height, grayImageMatrix);

  var data_u32 = new Uint32Array(imageData.data.buffer);
  var i = grayImageMatrix.cols * grayImageMatrix.rows;
  var pix = 0;

  var alpha = 0xff << 24;
  while (--i >= 0) {
    pix = grayImageMatrix.data[i];
    data_u32[i] = alpha | pix << 16 | pix << 8 | pix;
  }

  return grayImageMatrix;
}

function cannyEdgeDetection(imageData, lowThreshold, highThreshold, width, height) {
  var matrix = new _jsfeat2.default.matrix_t(width, height, _jsfeat2.default.U8C1_t);

  _jsfeat2.default.imgproc.grayscale(imageData.data, width, height, matrix);

  _jsfeat2.default.imgproc.canny(matrix, matrix, lowThreshold, highThreshold);

  var data_u32 = new Uint32Array(imageData.data.buffer);
  var i = matrix.cols * matrix.rows;
  var pix = 0;

  var alpha = 0xff << 24;
  while (--i >= 0) {
    pix = matrix.data[i];
    data_u32[i] = alpha | pix << 16 | pix << 8 | pix;
  }
}

function blurImage(imageData, blurAmount, width, height) {
  _stackblurCanvas2.default.imageDataRGB(imageData, 0, 0, width, height, Math.floor(blurAmount));
}

function invertImage(imageData) {
  for (var i = 0; i < imageData.data.length; i++) {
    if ((i + 1) % 4 !== 0) {
      // Skip alpha channel.
      imageData.data[i] = 255 - imageData.data[i];
    }
  }
}

function posterizeImage(imageData, posterizeLevels) {
  var numOfAreas = 256 / posterizeLevels;
  var numOfValues = 255 / (posterizeLevels - 1);

  for (var i = 0; i < imageData.data.length; i++) {
    if ((i + 1) % 4 !== 0) {
      // Skip alpha channel.
      imageData.data[i] = Math.floor(Math.floor(imageData.data[i] / numOfAreas) * numOfValues);
    }
  }
}

function fractalField(imageData, _ref, width) {
  var fieldOpacity = _ref.fieldOpacity,
      fieldRatioX = _ref.fieldRatioX,
      fieldRatioY = _ref.fieldRatioY,
      fieldRandomSeed = _ref.fieldRandomSeed;

  _noise2.default.seed(fieldRandomSeed);

  for (var i = 0; i < imageData.data.length; i++) {
    if ((i + 1) % 4 !== 0) {
      // Skip alpha channel.
      var noiseValue = _noise2.default.simplex2(Math.floor(i / 4) % width * fieldRatioX, Math.floor(i / 4 / width) * fieldRatioY);
      imageData.data[i] = imageData.data[i] * (1 - Math.abs(noiseValue) * fieldOpacity);
    }
  }
}

// This mutates imageData according to the passed settings.
function manipulateImageData(imageData, imageSettings, width, height) {
  if (imageSettings.grayscale) {
    grayScale(imageData, width, height);
  }

  if (imageSettings.invert) {
    invertImage(imageData);
  }

  if (imageSettings.blur && imageSettings.blur > 0) {
    blurImage(imageData, imageSettings.blur, width, height);
  }

  if (imageSettings.posterize) {
    posterizeImage(imageData, imageSettings.posterizeLevels);
  }

  if (imageSettings["Edge Detection"]) {
    cannyEdgeDetection(imageData, imageSettings.lowThreshold, imageSettings.highThreshold, width, height);
  }

  if (imageSettings.applyFractalField) {
    fractalField(imageData, imageSettings, width);
  }

  if (imageSettings.postBlur && imageSettings.postBlur > 0) {
    blurImage(imageData, imageSettings.postBlur, width, height);
  }
}
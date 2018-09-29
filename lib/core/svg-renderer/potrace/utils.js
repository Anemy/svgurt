'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.loadImage = loadImage;
exports.createBitmap = createBitmap;
exports.sign = sign;

var _Bitmap = require('./Bitmap.js');

var _Bitmap2 = _interopRequireDefault(_Bitmap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function loadImage(url) {
  return new _promise2.default(function (resolve, reject) {
    var image = new Image();
    image.onload = function () {
      return resolve(image);
    };
    image.onerror = reject;
    image.src = url;
  });
}

function createBitmap(canvas) {
  var width = canvas.width,
      height = canvas.height;

  var imageData = canvas.getContext('2d').getImageData(0, 0, width, height);
  var bitmap = new _Bitmap2.default(width, height);

  var imageDataIndex = 0;
  var length = width * height;
  for (var bitmapIndex = 0; bitmapIndex < length; bitmapIndex++) {
    var r = 0.2126 * imageData.data[imageDataIndex++];
    var g = 0.7153 * imageData.data[imageDataIndex++];
    var b = 0.0721 * imageData.data[imageDataIndex++];
    // eslint-disable-next-line
    var a = imageDataIndex++; // alpha
    var color = r + g + b;

    bitmap.data[bitmapIndex] = color < 128 ? 1 : 0;
  }

  return bitmap;
}

function sign(i) {
  return i > 0 ? 1 : i < 0 ? -1 : 0;
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPixelColorAtDataIndex = getPixelColorAtDataIndex;
exports.getPixelColorAtXY = getPixelColorAtXY;
exports.isInColorThreshhold = isInColorThreshhold;
exports.getPixelColorIntensity = getPixelColorIntensity;
function getPixelColorAtDataIndex(imageData, dataIndex) {
  return {
    r: imageData[dataIndex],
    g: imageData[dataIndex + 1],
    b: imageData[dataIndex + 2],
    a: imageData[dataIndex + 3] / 255
  };
}

function getPixelColorAtXY(imageData, x, y, width) {
  var dataIndex = (Math.round(x) + Math.round(y) * width) * 4;

  return getPixelColorAtDataIndex(imageData, dataIndex);
}

function isInColorThreshhold(pixel, controls) {
  var minColorRecognized = controls.minColorRecognized,
      maxColorRecognized = controls.maxColorRecognized;


  return pixel.r >= minColorRecognized && pixel.g >= minColorRecognized && pixel.b >= minColorRecognized && pixel.r <= maxColorRecognized && pixel.g <= maxColorRecognized && pixel.b <= maxColorRecognized;
}

function getPixelColorIntensity(pixel, settings) {
  var minColorRecognized = settings.minColorRecognized,
      maxColorRecognized = settings.maxColorRecognized;


  var r = pixel.r - minColorRecognized;
  var g = pixel.g - minColorRecognized;
  var b = pixel.b - minColorRecognized;
  var colorSum = Math.max(1, r + g + b);

  var outOf = Math.max(1, Math.abs(maxColorRecognized - minColorRecognized));

  return colorSum / 3 / outOf;
}
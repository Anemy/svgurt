import jsfeat from 'jsfeat';
import noise from '../utils/noise';
import StackBlur from 'stackblur-canvas';

function grayScale(imageData, width, height) {
  const grayImageMatrix = new jsfeat.matrix_t(width, height, jsfeat.U8C1_t);

  jsfeat.imgproc.grayscale(imageData.data, width, height, grayImageMatrix);

  let data_u32 = new Uint32Array(imageData.data.buffer);
  let i = grayImageMatrix.cols * grayImageMatrix.rows;
  let pix = 0;

  const alpha = (0xff << 24);
  while (--i >= 0) {
    pix = grayImageMatrix.data[i];
    data_u32[i] = alpha | (pix << 16) | (pix << 8) | pix;
  }

  return grayImageMatrix;
}

function cannyEdge(imageData, lowThreshold, highThreshold, width, height) {
  const matrix = new jsfeat.matrix_t(width, height, jsfeat.U8C1_t);

  jsfeat.imgproc.grayscale(imageData.data, width, height, matrix);

  jsfeat.imgproc.canny(matrix, matrix, lowThreshold, highThreshold);

  let data_u32 = new Uint32Array(imageData.data.buffer);
  let i = matrix.cols * matrix.rows;
  let pix = 0;

  const alpha = (0xff << 24);
  while (--i >= 0) {
    pix = matrix.data[i];
    data_u32[i] = alpha | (pix << 16) | (pix << 8) | pix;
  }
}

function blurImage(imageData, blurAmount, width, height) {
  StackBlur.imageDataRGB(imageData, 0, 0, width, height, Math.floor(blurAmount));
}

function invertImage(imageData) {
  for (let i = 0; i < imageData.data.length; i++) {
    if ((i + 1) % 4 !== 0) { // Skip alpha channel.
      imageData.data[i] = 255 - imageData.data[i];
    }
  }
}

function fractalField(imageData, {
  fieldOpacity,
  fieldRatioX,
  fieldRatioY,
  fieldRandomSeed
}, width) {
  noise.seed(fieldRandomSeed);

  for (let i = 0; i < imageData.data.length; i++) {
    if ((i + 1) % 4 !== 0) { // Skip alpha channel.
      const noiseValue = noise.simplex2(((Math.floor(i / 4) % width) * fieldRatioX), Math.floor((i / 4) / width) * fieldRatioY);
      imageData.data[i] = imageData.data[i] * (1 - Math.abs(noiseValue) * fieldOpacity);
    }
  }
}

// This mutates imageData according to the passed settings.
export function manipulateImageData(imageData, imageSettings, width, height) {
  if (imageSettings.grayscale) {
    grayScale(imageData, width, height);
  }

  if (imageSettings.invert) {
    invertImage(imageData);
  }

  if (imageSettings.blur && imageSettings.blur > 0) {
    blurImage(imageData, imageSettings.blur, width, height);
  }

  if (imageSettings.cannyEdgeDetection) {
    cannyEdge(imageData, imageSettings.lowThreshold, imageSettings.highThreshold, width, height);
  }

  if (imageSettings.applyFractalField) {
    fractalField(imageData, imageSettings, width);
  }
}
import jsfeat from 'jsfeat';
import StackBlur from 'stackblur-canvas';

// ctx.drawImage(video, 0, 0, 640, 480);
// var imageData = ctx.getImageData(0, 0, 640, 480);

// stat.start("grayscale");
// jsfeat.imgproc.grayscale(imageData.data, 640, 480, img_u8);
// stat.stop("grayscale");

// var r = options.blur_radius|0;
// var kernel_size = (r+1) << 1;

// stat.start("gauss blur");
// jsfeat.imgproc.gaussian_blur(img_u8, img_u8, kernel_size, 0);
// stat.stop("gauss blur");

// stat.start("canny edge");
// jsfeat.imgproc.canny(img_u8, img_u8, options.low_threshold|0, options.high_threshold|0);
// stat.stop("canny edge");

// // render result back to canvas
// var data_u32 = new Uint32Array(imageData.data.buffer);
// var alpha = (0xff << 24);
// var i = img_u8.cols*img_u8.rows, pix = 0;
// while(--i >= 0) {
//     pix = img_u8.data[i];
//     data_u32[i] = alpha | (pix << 16) | (pix << 8) | pix;
// }

// ctx.putImageData(imageData, 0, 0);

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
}

function blurImage(imageData, blurAmount, width, height) {
  // const imageMatrix = new jsfeat.matrix_t(width, height, jsfeat.U8C1_t);

  // imageMatrix.data = imageData;

  // console.log('blur with w, h', width, height);

  // jsfeat.imgproc.gaussian_blur(imageData.data, imageData.data, blurAmount, 0);

  // let data_u32 = new Uint32Array(imageData.data.buffer);
  // let i = imageMatrix.cols * imageMatrix.rows;
  // let pix = 0;

  // const alpha = (0xff << 24);
  // while (--i >= 0) {
  //     pix = imageMatrix.data[i];
  //     data_u32[i] = alpha | (pix << 16) | (pix << 8) | pix;
  // }

  console.log('width', width, 'height', height, 'blurAmount', blurAmount);

  StackBlur.imageDataRGB(imageData, 0, 0, width, height, Math.floor(blurAmount));
}

function invertImage(imageData) {
  for (let i = 0; i < imageData.data.length; i++) {
    if (i % 4 === 0) { // Skip alpha channel.
      imageData.data[i] = 255 - imageData.data[i];
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
}


//   // Invert the image for example.
//   for (let i = 0; i < imageData.length; i++) {
//     if (i % 4 === 0) { // Skip alpha channel.
//       imageData[i] = 255 - imageData[i];
//     }
//   }

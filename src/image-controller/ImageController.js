import jsfeat from 'jsfeat';

export default class ImageController {
  constructor() {
    this.imageData = null;
    this.originalImageData = null;
    this.loadedImage = false;

    this.width = 0;
    this.height = 0;

    this.rendered = false;
    this.isRendering = false;
  }

  invertImage() {
    const grayImageMatrix = new jsfeat.matrix_t(this.width, this.height, jsfeat.U8C1_t);

    console.log('pre imageData', [...this.image.data]);

    jsfeat.imgproc.grayscale(this.image.data, this.width, this.height, grayImageMatrix);
    
    let data_u32 = new Uint32Array(this.image.data.buffer);
    let i = grayImageMatrix.cols * grayImageMatrix.rows, pix = 0;

    let alpha = (0xff << 24);
    while (--i >= 0) {
        pix = grayImageMatrix.data[i];
        data_u32[i] = alpha | (pix << 16) | (pix << 8) | pix;
    }

    console.log('post imageData', [...this.image.data]);

    this.imageData = [...this.image.data];
  }

  getNeedsRender() {
    return this.loadedImage && !this.isRendering && !this.rendered;
  }

  setNeedsRender() {
    this.rendered = false;
  }

  setRendering() {
    this.isRendering = true;
  }

  setRendered() {
    this.rendered = true;
    this.isRendering = false;
  }

  getRenderHeight() {
    return this.height;
  }

  getRenderWidth() {
    return this.width;
  }

  getData() {
    return this.imageData;
  }

  setData(newData) {
    this.imageData = newData;
  }

  loadImageFromURI(imageURI, done) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const image = new Image();

    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;

      this.width = image.width;
      this.height = image.height;

      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      this.image = context.getImageData(0, 0, canvas.width, canvas.height);
      this.imageData = [...context.getImageData(0, 0, canvas.width, canvas.height).data];
      this.originalImageData = [...this.imageData];
      this.loadedImage = true;
      this.setNeedsRender();
      done(false);
    };

    image.onerror = () => {
      this.loadedImage = false;
      done(true);
    };

    image.src = imageURI;
  }
}


// setTimeout(() => {
//   // Invert the image in a few seconds just for example - remove later.
//   const imageData = [...this.image.getData()];

//   for (let i = 0; i < imageData.length; i++) {
//     if (i % 4 === 0) { // Skip alpha channel.
//       imageData[i] = 255 - imageData[i];
//     }
//   }

//   this.image.setData(imageData);
//   this.image.setNeedsRender();

//   this.setState({
//     // Force a re-render.
//     imageLoaded: true
//   });
// }, 3000);
export default class ImageController {
  constructor() {
    this.imageData = null;
    this.loadedImage = false;

    this.width = 0;
    this.height = 0;

    this.rendered = false;
    this.isRendering = false;
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

      this.imageData = [...context.getImageData(0, 0, canvas.width, canvas.height).data];
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
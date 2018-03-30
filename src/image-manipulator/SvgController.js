// TODO: Add some randomness factors.


const SVG_RENDER_TYPES = {
  CIRCLE: 'CIRCLE',
  CURVE: 'CURVE',
  HASH: 'HASH',
  LINE: 'LINE',
  RECTANGLE: 'RECTANGLE'
};

// How to fill - recursive filling functions.

// const SVG_ANALYZE_TYPES = {
//   BLOB: 'BLOB',
//   DIRECTIONAL: 'DIRECTIONAL'
// };

export class SvgControllerThreshholds {
  static colorDiffMin = 0;
  static colorDiffMax = 5;
  static xMinDiff = 3;
  static xMaxDiff = 10;
  static yMinDiff = 0;
  static yMaxDiff = 0;
  static renderType = SVG_RENDER_TYPES.LINE
}

function isPixelInThreshhold(trackerPixel, pixel) {
  const {
    colorDiff
  } = SvgControllerThreshholds;

  return Math.abs(trackerPixel.r - pixel.r) < colorDiff &&
         Math.abs(trackerPixel.g - pixel.g) < colorDiff &&
         Math.abs(trackerPixel.b - pixel.b) < colorDiff;
}

function isPixelInDrawThreshold(trackerPixel, pixel) {
  const {
    xMinDiff,
    xMaxDiff,
    yMinDiff,
    yMaxDiff
  } = SvgControllerThreshholds;

  return Math.abs(pixel.x - trackerPixel.x) < xMinDiff || Math.abs(pixel.x - trackerPixel.x) > xMaxDiff ||
         Math.abs(pixel.y - trackerPixel.y) < yMinDiff || Math.abs(pixel.y - trackerPixel.y) > yMaxDiff;
}


export default class SvgController {
  constructor() {
    this.image = null;

    this.width = 0;
    this.height = 0;

    this.needsRender = true;
    this.isRendered = false;
    this.isRendering = false;

    this.svgString = null;
  }

  setImage(image) {
    this.image = image;
    this.height = image.getRenderHeight();
    this.width = image.getRenderWidth();
  }

  getNeedsRender() {
    return this.needsRender && this.image.loadedImage && !this.isRendering && !this.isRendered;
  }

  setNeedsRender() {
    this.isRendered = false;
    this.needsRender = true;
  }

  getIsRendered() {
    return this.isRendered;
  }

  getIsRendering() {
    return this.isRendering;
  }

  renderSvgString(done) {
    this.isRendering = true;
    this.isRendered = false;

    let newString = `<svg
      height="${this.getRenderHeight()}"
      width="${this.getRenderWidth()}"
    >`;
    setTimeout(() => {
      const imageData = this.image.getData();

      let currentTrackingPixel = null;
      let lastPixel = null;
      for (let i = 0; i < imageData.length / 4; i++) {
        const pixelIndex = i * 4;
        const pixel = {
          x: i % this.width,
          y: Math.floor(i / this.width),
          r: imageData[pixelIndex],
          g: imageData[pixelIndex + 1],
          b: imageData[pixelIndex + 2],
          a: imageData[pixelIndex + 3] / 255
        };

        if (!currentTrackingPixel || pixel.y !== currentTrackingPixel.y) {
          currentTrackingPixel = {
            ...pixel
          };
          lastPixel = {
            ...pixel
          };
          continue;
        }

        const inThreshhold = isPixelInThreshhold(currentTrackingPixel, pixel);
        if (!inThreshhold) {
          // Make the line! New tracker.
          if (lastPixel.y % 10 === 0 && isPixelInDrawThreshold(lastPixel, currentTrackingPixel)) {
            const displayColor = 'rgb(28, 32, 38)';// `rgb(${pixel.r}, ${pixel.g}, ${pixel.b})`;
            newString += `<line x1="${lastPixel.x}" y1="${lastPixel.y}" x2="${currentTrackingPixel.x}" y2="${currentTrackingPixel.y}" style="stroke: ${displayColor}; stroke-width:2" />`;
          }

          currentTrackingPixel = {
            ...pixel
          };
        }

        lastPixel = {
          ...pixel
        };
      }

      this.isRendering = false;
      this.isRendered = true;

      newString += '</svg>';
      this.svgString = newString;

      done();
    }, 20);
  }

  setRendering() {
    this.isRendering = true;
  }

  setRendered() {
    this.isRendered = true;
    this.isRendering = false;
    this.needsRender = false;
  }

  getRenderHeight() {
    return this.height;
  }

  getRenderWidth() {
    return this.width;
  }

  getSvgString() {
    return this.svgString;
  }
}

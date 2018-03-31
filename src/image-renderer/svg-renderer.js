// TODO: Add some randomness factors.

export const SVG_RENDER_TYPES = {
  CIRCLE: 'CIRCLE',
  CURVE: 'CURVE',
  HASH: 'HASH',
  LINE: 'LINE',
  RECTANGLE: 'RECTANGLE'
};

// How to fill - recursive filling functions.

function isPixelInGridThreshold(pixel, svgSettings) {
  const {
    renderEveryXPixels,
    renderEveryYPixels
  } = svgSettings;

  return pixel.x % renderEveryXPixels === 0 && pixel.y % renderEveryYPixels === 0;
}

function isPixelInColorThreshhold(pixel, controls) {
  const {
    minColorRecognized,
    maxColorRecognized
  } = controls;

  return pixel.r >= minColorRecognized &&
         pixel.g >= minColorRecognized &&
         pixel.b >= minColorRecognized &&
         pixel.r <= maxColorRecognized &&
         pixel.g <= maxColorRecognized &&
         pixel.b <= maxColorRecognized;
}

function tryToRenderPixel(pixel, svgSettings) {
  switch (svgSettings.svgRenderType) {
    case SVG_RENDER_TYPES.CURVE: {
      if (isPixelInGridThreshold(pixel, svgSettings) &&
          isPixelInColorThreshhold(pixel, svgSettings)) {
        const displayColor = 'rgb(28, 32, 38)';// `rgb(${pixel.r}, ${pixel.g}, ${pixel.b})`;
        return `<line x1="${pixel.x}" y1="${pixel.y}" x2="${pixel.x + 5}" y2="${pixel.y - 3}" style="stroke: ${displayColor}; stroke-width: ${svgSettings.strokeWidth}" />`;
      }
    }
  }
}

export function renderSvgString(imageData, svgSettings, width, height, done) {
  setImmediate(() => {
    let svgString = `<svg
      height="${width}"
      width="${height}"
    >`;

    for (let i = 0; i < imageData.length / 4; i++) {
      const pixelIndex = i * 4;
      const pixel = {
        x: i % width,
        y: Math.floor(i / width),
        r: imageData[pixelIndex],
        g: imageData[pixelIndex + 1],
        b: imageData[pixelIndex + 2],
        a: imageData[pixelIndex + 3] / 255
      };

      const svgPixelString = tryToRenderPixel(pixel, svgSettings);
      if (svgPixelString) {
        svgString += svgPixelString;
      }
    }

    svgString += '</svg>';

    done(svgString);
  });
}

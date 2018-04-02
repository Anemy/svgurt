// TODO: Add some randomness factors.

export const SVG_RENDER_TYPES = {
  CIRCLE: 'CIRCLE',
  CURVE: 'CURVE',
  // HASH: 'HASH',
  LINE: 'LINE'
  // RECTANGLE: 'RECTANGLE'
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

/*
f(x) = A sin(wt + p)
where

A is the amplitude
w is the frequency
p is the phase
*/

function tryToRenderPixel(pixel, svgSettings) {
  switch (svgSettings.svgRenderType) {
    case SVG_RENDER_TYPES.CURVE: {
      if (isPixelInGridThreshold(pixel, svgSettings) &&
          isPixelInColorThreshhold(pixel, svgSettings)) {
        const displayColor = 'rgb(28, 32, 38)';// `rgb(${pixel.r}, ${pixel.g}, ${pixel.b})`;
        // While through wavelength to end.
        let curvePath = `M ${pixel.x} ${pixel.y}`;
        for (let i = 0; i < svgSettings.waves; i++) {
          let points = [{
            x: pixel.x + (Math.PI / 2) * (i + 1) * Math.cos(svgSettings.direction * (Math.PI / 180)) * svgSettings.wavelength,
            y: pixel.y + (Math.PI / 2) * (i + 1) * Math.sin(svgSettings.direction * (Math.PI / 180)) * svgSettings.wavelength
          }, {
            x: pixel.x + (Math.PI * (3 / 2)) * (i + 1) * Math.cos(svgSettings.direction * (Math.PI / 180)) * svgSettings.wavelength,
            y: pixel.y + (Math.PI * (3 / 2)) * (i + 1) * Math.sin(svgSettings.direction * (Math.PI / 180)) * svgSettings.wavelength
          }, {
            x: pixel.x + (Math.PI * 2) * (i + 1) * Math.cos(svgSettings.direction * (Math.PI / 180)) * svgSettings.wavelength,
            y: pixel.y + (Math.PI * 2) * (i + 1) * Math.sin(svgSettings.direction * (Math.PI / 180)) * svgSettings.wavelength
          }];
          curvePath += ` C ${points[0].x} ${points[0].y}, ${points[1].x} ${points[1].y}, ${points[2].x} ${points[2].y}`;
        }
        if (Math.random() > .9) {
          console.log('curvepath', curvePath);
        }
        return `<path d="${curvePath}" style="stroke: ${displayColor}; stroke-width: ${svgSettings.strokeWidth};" />`;
      }
      break;
    }
    case SVG_RENDER_TYPES.LINE: {
      if (isPixelInGridThreshold(pixel, svgSettings) &&
          isPixelInColorThreshhold(pixel, svgSettings)) {
        const displayColor = 'rgb(28, 32, 38)';// `rgb(${pixel.r}, ${pixel.g}, ${pixel.b})`;
        return `<line x1="${pixel.x}" y1="${pixel.y}" x2="${pixel.x + svgSettings.length * Math.cos(svgSettings.direction * (Math.PI / 180))}" y2="${pixel.y + svgSettings.length * Math.sin(svgSettings.direction * (Math.PI / 180))}" style="stroke: ${displayColor}; stroke-width: ${svgSettings.strokeWidth}" />`;
      }
      break;
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

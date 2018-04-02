// TODO: Add some randomness factors.

export const SVG_RENDER_TYPES = {
  // CIRCLE: 'CIRCLE',
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
        const {
          amplitude,
          direction,
          randomness,
          strokeWidth,
          wavelength,
          waves
        } = svgSettings;

        const displayColor = 'rgb(28, 32, 38)';
        // While through wavelength to end.
        let curvePath = `M ${pixel.x} ${pixel.y}`;
        const dir = direction + 360 * randomness * Math.random();
        const xDir = Math.cos(dir * (Math.PI / 180));
        const yDir = Math.sin(dir * (Math.PI / 180));
        const inverseXDir = Math.cos((dir - 90) * (Math.PI / 180));
        const inverseYDir = Math.sin((dir - 90) * (Math.PI / 180));
        const wavelen = wavelength * (1 - Math.random() * randomness);
        const amp = amplitude * (1 - Math.random() * randomness);
        const wavAmount = waves - Math.round(waves * (1 - Math.random() * randomness));
        for (let i = 0; i < wavAmount; i++) {
          let points = [{
            x: pixel.x + (((i * wavelen) + wavelen / 4) * xDir + inverseXDir * amp),
            y: pixel.y + (((i * wavelen) + wavelen / 4) * yDir + inverseYDir * amp)
          }, {
            x: pixel.x + (((i * wavelen) + wavelen * (3 / 4)) * xDir - inverseXDir * amp),
            y: pixel.y + (((i * wavelen) + wavelen * (3 / 4)) * yDir - inverseYDir * amp)
          }, {
            x: pixel.x + (((i + 1) * wavelen) * xDir),
            y: pixel.y + (((i + 1) * wavelen) * yDir)
          }];

          curvePath += ` C ${points[0].x} ${points[0].y}, ${points[1].x} ${points[1].y}, ${points[2].x} ${points[2].y}`;
        }

        return `<path d="${curvePath}" style="stroke: ${displayColor}; stroke-width: ${strokeWidth}; fill: none;" />`;
      }
      break;
    }
    case SVG_RENDER_TYPES.LINE: {
      if (isPixelInGridThreshold(pixel, svgSettings) &&
          isPixelInColorThreshhold(pixel, svgSettings)) {
        const displayColor = 'rgb(28, 32, 38)';

        const {
          direction,
          length,
          randomness,
          strokeWidth
        } = svgSettings;

        const dir = direction + 360 * randomness * Math.random();
        const xMove = length * Math.cos(dir * (Math.PI / 180));
        const yMove = length * Math.sin(dir * (Math.PI / 180));

        const x1 = pixel.x;
        const y1 = pixel.y;
        const x2 = pixel.x + xMove * (1 - (Math.random() * randomness));
        const y2 = pixel.y + yMove * (1 - (Math.random() * randomness));

        return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke: ${displayColor}; stroke-width: ${strokeWidth}" />`;
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

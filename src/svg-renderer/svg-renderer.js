import noise from '../utils/noise';

import { SVG_RENDER_TYPES } from '../controller/Controller';
import { createLines, renderLines } from './line';

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

function applyFractalFieldToPoint(pixel, {
  applyFractalDisplacement,
  displacementAmount,
  fractalRatioX,
  fractalRatioY,
  fractalRandomSeed
}) {
  if (!applyFractalDisplacement) {
    return;
  }

  noise.seed(fractalRandomSeed);

  const angleNoiseValue = Math.abs(noise.simplex2(pixel.x * fractalRatioX, pixel.y * fractalRatioY)) * Math.PI * 2;
  const displacementNoiseValue = Math.abs(noise.simplex2((pixel.x * fractalRatioX) + 20000, (pixel.y * fractalRatioY) + 20000)) * displacementAmount;

  pixel.x += Math.cos(angleNoiseValue) * displacementNoiseValue;
  pixel.y += Math.sin(angleNoiseValue) * displacementNoiseValue;
}

function tryToRenderPixel(pixel, svgSettings) {
  switch (svgSettings.svgRenderType) {
    case SVG_RENDER_TYPES.CIRCLE: {
      if (isPixelInGridThreshold(pixel, svgSettings) &&
          isPixelInColorThreshhold(pixel, svgSettings)) {
        const {
          strokeWidth,
          strokeWidthRandomness,
          radius,
          radiusRandomness
        } = svgSettings;

        // TODO(@Rhys): Avoid mutating functions.
        applyFractalFieldToPoint(pixel, svgSettings);

        const displayColor = 'rgb(28, 32, 38)';
        const r = radius * (1 - radiusRandomness * Math.random());
        const strokeW = strokeWidth * (1 - Math.random() * strokeWidthRandomness);
        return `<circle cx="${pixel.x}" cy="${pixel.y}" r="${r}" style="stroke: ${displayColor}; stroke-width: ${strokeW}; fill: none;" />`;
      }
      break;
    }
    case SVG_RENDER_TYPES.CURVE: {
      if (isPixelInGridThreshold(pixel, svgSettings) &&
          isPixelInColorThreshhold(pixel, svgSettings)) {
        const {
          amplitude,
          amplitudeRandomness,
          direction,
          directionRandomness,
          strokeWidth,
          strokeWidthRandomness,
          wavelength,
          wavelengthRandomness,
          waves,
          wavesRandomness
        } = svgSettings;

        // TODO(@Rhys): Avoid mutating functions.
        applyFractalFieldToPoint(pixel, svgSettings);

        const displayColor = 'rgb(28, 32, 38)';
        // While through wavelength to end.
        let curvePath = `M ${pixel.x} ${pixel.y}`;
        const dir = direction + 360 * directionRandomness * Math.random();
        const xDir = Math.cos(dir * (Math.PI / 180));
        const yDir = Math.sin(dir * (Math.PI / 180));
        const inverseXDir = Math.cos((dir - 90) * (Math.PI / 180));
        const inverseYDir = Math.sin((dir - 90) * (Math.PI / 180));
        const wavelen = wavelength * (1 - Math.random() * wavelengthRandomness);
        const amp = amplitude * (1 - Math.random() * amplitudeRandomness);
        const wavAmount = Math.round(waves * (1 - Math.random() * wavesRandomness));
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

        const strokeW = strokeWidth * (1 - Math.random() * strokeWidthRandomness);
        return `<path d="${curvePath}" style="stroke: ${displayColor}; stroke-width: ${strokeW}; fill: none;" />`;
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

    let isLine = false;
    switch (svgSettings.svgRenderType) {
      case SVG_RENDER_TYPES.LINE: {
        const lines = createLines(svgSettings, imageData, width, height);

        svgString += renderLines(svgSettings, lines);
        isLine = true;
      }
    }

    if (!isLine) {
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
    }

    svgString += '</svg>';

    done(svgString);
  });
}

import _ from 'lodash';

import { getFractalDispacementForPoint } from './fractal';
import { getPixelColorAtXY, isInColorThreshhold } from './color';

export function renderCurves(svgSettings, curves) {
  const { scale } = svgSettings;

  let renderString = '';
  for (let i = 0; i < curves.length; i++) {
    const { x, y, controlPoints, strokeWidth, strokeColor } = curves[i];

    let curvePath = `M ${x * scale} ${y * scale} C`;
    _.each(controlPoints, (point, index) => {
      curvePath +=
        ` ${point.x * scale} ${point.y * scale}` +
        (index === controlPoints.length - 1 ? '' : ',');
    });

    renderString += `<path d="${curvePath}" style="stroke: ${strokeColor}; stroke-width: ${strokeWidth}; fill: none;" />`;
  }

  return renderString;
}

function createCurveAtPoint(baseX, baseY, settings, pixelColor) {
  const {
    autoColor,
    amplitude,
    amplitudeRandomness,
    applyFractalDisplacement,
    direction,
    directionRandomness,
    displaceOrigin,
    strokeColor,
    strokeWidth,
    strokeWidthRandomness,
    wavelength,
    wavelengthRandomness,
    waves,
    wavesRandomness
  } = settings;

  let x = baseX;
  let y = baseY;

  const curveColor = autoColor
    ? `rgb(${pixelColor.r}, ${pixelColor.g}, ${pixelColor.b})`
    : strokeColor;

  if (applyFractalDisplacement) {
    const { xDisplacement, yDisplacement } = getFractalDispacementForPoint(
      baseX,
      baseY,
      settings
    );

    x += xDisplacement;
    y += yDisplacement;
  }

  const dir = -direction + 180 * directionRandomness * Math.random();
  const xDir = Math.cos(dir * (Math.PI / 180));
  const yDir = Math.sin(dir * (Math.PI / 180));
  const inverseXDir = Math.cos((dir - 90) * (Math.PI / 180));
  const inverseYDir = Math.sin((dir - 90) * (Math.PI / 180));
  const wavelen = wavelength * (1 - Math.random() * wavelengthRandomness);
  const amp = amplitude * (1 - Math.random() * amplitudeRandomness);
  const wavAmount = Math.round(waves * (1 - Math.random() * wavesRandomness));
  const controlPoints = [];
  for (let i = 0; i < wavAmount; i++) {
    controlPoints.push(
      {
        x: x + ((i * wavelen + wavelen / 4) * xDir + inverseXDir * amp),
        y: y + ((i * wavelen + wavelen / 4) * yDir + inverseYDir * amp)
      },
      {
        x: x + ((i * wavelen + wavelen * (3 / 4)) * xDir - inverseXDir * amp),
        y: y + ((i * wavelen + wavelen * (3 / 4)) * yDir - inverseYDir * amp)
      },
      {
        x: x + (i + 1) * wavelen * xDir,
        y: y + (i + 1) * wavelen * yDir
      }
    );

    if (displaceOrigin) {
      for (let k = controlPoints.length - 3; k < controlPoints.length; k++) {
        const { xDisplacement, yDisplacement } = getFractalDispacementForPoint(
          controlPoints[k].x,
          controlPoints[k].y,
          settings
        );

        controlPoints[k].x += xDisplacement;
        controlPoints[k].y += yDisplacement;
      }
    }
  }

  const curve = {
    x,
    y,
    controlPoints,
    strokeColor: curveColor,
    strokeWidth: strokeWidth * (1 - Math.random() * strokeWidthRandomness)
  };

  return curve;
}

export function createCurves(settings, imageData, width, height) {
  const { renderEveryXPixels, renderEveryYPixels } = settings;

  const curves = [];

  for (let x = 0; x < width; x += renderEveryXPixels) {
    for (let y = 0; y < height; y += renderEveryYPixels) {
      const pixelColor = getPixelColorAtXY(imageData, x, y, width);
      if (!isInColorThreshhold(pixelColor, settings)) {
        continue;
      }

      curves.push(createCurveAtPoint(x, y, settings, pixelColor));
    }
  }

  return curves;
}

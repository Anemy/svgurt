import _ from 'lodash';

import { getFractalDispacementForPoint } from './fractal';
import { getPixelColorAtDataIndex, isInColorThreshhold } from './color';

export function renderLines(svgSettings, lines) {
  let renderString = '';
  _.each(lines, line => {
    const { x1, y1, x2, y2, strokeWidth, strokeColor } = line;
    renderString += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke: ${strokeColor}; stroke-width: ${strokeWidth}" />`;
  });

  return renderString;
}

function createContinuousLineBetweenPoints(startX, startY, width, height, settings, imageData) {
  const {
    applyFractalFieldToPoint,
    displaceOrigin,
    direction,
    directionRandomness,
    strokeColor,
    strokeWidth,
    strokeWidthRandomness
  } = settings;

}

function createLineAtPoint(x, y, settings) {
  const {
    applyFractalFieldToPoint,
    displaceOrigin,
    direction,
    directionRandomness,
    length,
    lengthRandomness,
    strokeColor,
    strokeWidth,
    strokeWidthRandomness
  } = settings;

  const x1 = x;
  const y1 = y;

  const dir = direction + 360 * directionRandomness * Math.random();
  const xMove = length * Math.cos(dir * (Math.PI / 180));
  const yMove = length * Math.sin(dir * (Math.PI / 180));

  const lenRandom = (1 - (Math.random() * lengthRandomness));
  const x2 = x1 + xMove * lenRandom;
  const y2 = y1 + yMove * lenRandom;

  const line = { x1, y1, x2, y2,
    strokeColor,
    strokeWidth: strokeWidth * (1 - Math.random() * strokeWidthRandomness)
  };

  if (applyFractalFieldToPoint) {
    const { xDisplacement, yDisplacement } = getFractalDispacementForPoint(x1, y1, settings);

    if (displaceOrigin) {
      line.x += xDisplacement;
      line.y += yDisplacement;
    }

    line.x2 += xDisplacement;
    line.y2 += yDisplacement;
  }

  return line;
}

export function createLines(settings, imageData, width, height) {
  const {
    continuous,
    renderEveryXPixels,
    renderEveryYPixels
  } = settings;

  const lines = [];

  if (continuous) {
    for (let i = 0; i < width; i += renderEveryXPixels) {
      lines.push(createContinuousLineBetweenPoints(i, 0, width, height, settings, imageData));
    }

    for (let i = 0; i < height; i += renderEveryYPixels) {
      lines.push(createContinuousLineBetweenPoints(0, i, width, height, settings, imageData));
    }
  } else {
    for (let i = 0; i < width; i += renderEveryXPixels) {
      for (let k = 0; k < height; k += renderEveryYPixels) {
        const dataIndex = (i + (k * width)) * 4;
        const pixelColor = getPixelColorAtDataIndex(imageData, dataIndex);
        if (!isInColorThreshhold(pixelColor)) {
          continue;
        }

        const x = i % width;
        const y = Math.floor(i / width);

        lines.push(createLineAtPoint(x, y, settings));
      }
    }
  }

  return lines;
}
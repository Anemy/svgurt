import { getFractalDispacementForPoint } from './fractal';
import { getPixelColorAtDataIndex, isInColorThreshhold } from './color';

export function renderLines(svgSettings, lines) {
  let renderString = '';
  let i = 0;
  for (i = 0; i < lines.length; i++) {
    const { x1, y1, x2, y2, strokeWidth, strokeColor } = lines[i];
    renderString += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke: ${strokeColor}; stroke-width: ${strokeWidth}" />`;
  }

  return renderString;
}

function lineIntersection(m1, b1, m2, b2) {
  if (m1 === m2) {
    throw new Error('parallel slopes');
  }
  const x = (b2 - b1) / (m1 - m2);
  return {
    x,
    y: m1 * x + b1
  };
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
  const dir = direction + 360 * directionRandomness * Math.random();
  const run = Math.cos(dir * (Math.PI / 180));
  const rise = Math.sin(dir * (Math.PI / 180));
  const slope = run !== 0 ? Math.abs(rise / run) : 0;

  if (slope === 0) {
    // TODO
    return { x1: 0, y1: 0, x2: 0, y2: 0 };
  }

  // const rightSlope = 0; // Infinite?
  // const bottomSlope = 0; // Constant - not linear

  const rayIntersectionWithBottomLineX = (height - startY) / slope;
  const rayIntersectionWithRightLineY = (width - startX) * slope;

  let endX;
  let endY;

  if (rayIntersectionWithBottomLineX <= width) {
    endX = rayIntersectionWithBottomLineX;
    endY = height;
  } else if (rayIntersectionWithRightLineY <= height) {
    endX = width;
    endY = rayIntersectionWithRightLineY;
  } else {
    // Straight line or something?!

    return { x1: 0, y1: 0, x2: 0, y2: 0 };
  }

  // const intersectionWithBottomLine = { x: , y: height };
  // const end = getLineIntersection(bottomLine);
  // const endX = width; // lineIntersection(startX);
  // const endY = height; // lineIntersection();

  // Calculate intersection point between the side of the rectangle and ray from line.
  // const bottomLine = { x1: 0, y1: height, x2: width, y2 };
  // const rightLine = { x1: width, y1: 0, x2: width, y2: height };

  const x1 = startX;
  const y1 = startY;
  const x2 = endX;
  const y2 = endY;

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
      line.x1 += xDisplacement;
      line.y2 += yDisplacement;
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

  let x = 0;
  let y = 0;
  if (continuous) {
    for (let x = 0; x < width; x += renderEveryXPixels) {
      lines.push(createContinuousLineBetweenPoints(x, 0, width, height, settings, imageData));
    }

    for (let y = 0; y < height; y += renderEveryYPixels) {
      lines.push(createContinuousLineBetweenPoints(0, y, width, height, settings, imageData));
    }
  } else {
    for (x = 0; x < width; x += renderEveryXPixels) {
      for (y = 0; y < height; y += renderEveryYPixels) {
        const dataIndex = (x + (y * width)) * 4;
        const pixelColor = getPixelColorAtDataIndex(imageData, dataIndex);
        if (!isInColorThreshhold(pixelColor, settings)) {
          continue;
        }

        lines.push(createLineAtPoint(x, y, settings));
      }
    }
  }

  return lines;
}

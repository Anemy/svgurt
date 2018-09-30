import { getFractalDispacementForPoint } from './fractal';
import {
  getPixelColorAtXY,
  isInColorThreshhold,
  getPixelColorIntensity
} from './color';

export function renderLines(svgSettings, lines) {
  const { scale } = svgSettings;

  let renderString = '';
  let i = 0;
  for (i = 0; i < lines.length; i++) {
    const { x1, y1, x2, y2, strokeWidth, strokeColor } = lines[i];
    renderString += `<line x1="${x1 * scale}" y1="${y1 *
      scale}" x2="${x2 * scale}" y2="${y2 *
      scale}" style="stroke: ${strokeColor}; stroke-width: ${strokeWidth}" />`;
  }

  return renderString;
}

const VERTICAL_THRESHOLD = 100000;
const HORIZONTAL_THRESHOLD = 0.000001;
function createContinuousLine(lineNumber, width, height, dir, settings) {
  const {
    amountOfLines,
    offset = 0,
    strokeColor,
    strokeWidth,
    strokeWidthRandomness
  } = settings;

  const run = Math.cos(dir * (Math.PI / 180));
  const rise = Math.sin(dir * (Math.PI / 180));
  const slope = run !== 0 ? rise / run : 0;

  const lineIteration = lineNumber / amountOfLines;

  let x1;
  let y1;
  let x2;
  let y2;

  if (Math.abs(slope) > VERTICAL_THRESHOLD) {
    // Super high or negative slope is vertical.
    x1 = lineIteration * width;
    y1 = height;
    x2 = lineIteration * width;
    y2 = 0;
  } else if (slope > 0) {
    // Positive will go to the bottom right. LEFT & TOP Origins
    const linesStartX = -height / slope;
    const distanceToWidth = Math.abs(linesStartX) + width;
    const startX = lineIteration * distanceToWidth + linesStartX + offset;

    if (startX + height / slope > width) {
      x1 = width;
      y1 = Math.max(0, (-startX + width) * slope);
    } else {
      x1 = Math.max(0, startX + height / slope);
      y1 = height;
    }

    if (startX < 0) {
      x2 = 0;
      y2 = Math.min(height, -startX * slope);
    } else {
      x2 = startX;
      y2 = 0;
    }
  } else if (slope < 0) {
    // Negative will go to the top right. LEFT & BOTTOM Origins
    const linesStartX = height / slope;
    const distanceToWidth = Math.abs(linesStartX) + width;
    const startX = lineIteration * distanceToWidth + linesStartX + offset;

    if (startX < 0) {
      x1 = 0;
      y1 = Math.max(0, height - startX * slope);
    } else {
      x1 = startX;
      y1 = height;
    }

    if (startX - height / slope > width) {
      x2 = width;
      y2 = Math.min(height, height - -(-startX + width) * slope);
    } else {
      x2 = Math.max(0, startX - height / slope);
      y2 = 0;
    }
  } else {
    // Horizontal.
    x1 = 0;
    y1 = lineIteration * height;
    x2 = width;
    y2 = lineIteration * height;
  }

  const line = {
    x1,
    y1,
    x2,
    y2,
    dir,
    strokeColor,
    strokeWidth: strokeWidth * (1 - Math.random() * strokeWidthRandomness)
  };

  return line;
}

function createContinuousLines(lineNumber, width, height, settings) {
  const { crossHatch, direction, directionRandomness } = settings;

  const lines = [];

  const dir = -direction + 180 * directionRandomness * Math.random();

  lines.push(createContinuousLine(lineNumber, width, height, dir, settings));

  if (crossHatch) {
    let perpendicularDir = dir > -90 ? dir - 90 : dir + 90;
    lines.push(
      createContinuousLine(
        lineNumber,
        width,
        height,
        perpendicularDir,
        settings
      )
    );
  }

  return lines;
}

function createLineAtPoint(x, y, settings, pixelColor) {
  const {
    autoColor,
    applyFractalDisplacement,
    displaceOrigin,
    direction,
    directionRandomness,
    lineLength,
    lengthOnColor,
    lengthRandomness,
    strokeColor,
    strokeWidth,
    strokeWidthRandomness
  } = settings;

  const x1 = x;
  const y1 = y;

  const lineColor = autoColor
    ? `rgb(${pixelColor.r}, ${pixelColor.g}, ${pixelColor.b})`
    : strokeColor;

  let lengthOfLine = lineLength;
  if (lengthOnColor) {
    lengthOfLine = getPixelColorIntensity(pixelColor, settings) * lengthOfLine;
  }

  const dir = -direction + 180 * directionRandomness * Math.random();
  const xMove = lengthOfLine * Math.cos(dir * (Math.PI / 180));
  const yMove = lengthOfLine * Math.sin(dir * (Math.PI / 180));

  const lenRandom = 1 - Math.random() * lengthRandomness;
  const x2 = x1 + xMove * lenRandom;
  const y2 = y1 + yMove * lenRandom;

  const line = {
    x1,
    y1,
    x2,
    y2,
    strokeColor: lineColor,
    strokeWidth: strokeWidth * (1 - Math.random() * strokeWidthRandomness)
  };

  if (applyFractalDisplacement) {
    if (displaceOrigin) {
      const { xDisplacement, yDisplacement } = getFractalDispacementForPoint(
        line.x1,
        line.y1,
        settings
      );

      line.x1 += xDisplacement;
      line.y1 += yDisplacement;
    }

    const { xDisplacement, yDisplacement } = getFractalDispacementForPoint(
      line.x2,
      line.y2,
      settings
    );

    line.x2 += xDisplacement;
    line.y2 += yDisplacement;
  }

  return line;
}

function getLinesAlongLine(guidingLine, width, height, settings, imageData) {
  const { applyFractalDisplacement, displaceOrigin, minLineLength } = settings;

  const { dir, strokeColor, strokeWidth } = guidingLine;

  const linesAlongLine = [];

  let currentX = guidingLine.x1;
  let currentY = guidingLine.y1;
  let pixelInThreshold;
  let lastPixelInThreshold;
  let lastX = currentX;
  let lastY = currentY;
  let x1 = currentX;
  let y1 = currentY;

  const tick = 1;
  let tickX = tick * Math.cos(dir * (Math.PI / 180));
  let tickY = tick * Math.sin(dir * (Math.PI / 180));

  if (Math.abs(tickX) > VERTICAL_THRESHOLD) {
    tickX = width;
  }
  if (Math.abs(tickX) < HORIZONTAL_THRESHOLD) {
    tickX = 0;
  }
  if (Math.abs(tickY) > VERTICAL_THRESHOLD) {
    tickY = height;
  }
  if (Math.abs(tickY) < HORIZONTAL_THRESHOLD) {
    tickY = 0;
  }

  let amountOfPixelsInLine =
    Math.abs(Math.abs(guidingLine.x1) - Math.abs(guidingLine.x2)) +
    Math.abs(Math.abs(guidingLine.y1) - Math.abs(guidingLine.y2));
  for (let i = 0; i < amountOfPixelsInLine; i++) {
    const pixelColor = getPixelColorAtXY(imageData, currentX, currentY, width);
    pixelInThreshold = isInColorThreshhold(pixelColor, settings);
    if (!pixelInThreshold) {
      if (
        lastPixelInThreshold &&
        Math.abs(Math.abs(x1) - Math.abs(lastX)) +
          Math.abs(Math.abs(y1) - Math.abs(lastY)) >
          minLineLength
      ) {
        if (applyFractalDisplacement) {
          if (displaceOrigin) {
            const {
              xDisplacement,
              yDisplacement
            } = getFractalDispacementForPoint(x1, y1, settings);
            x1 += xDisplacement;
            y1 += yDisplacement;
          }

          const {
            xDisplacement,
            yDisplacement
          } = getFractalDispacementForPoint(lastX, lastY, settings);
          lastX += xDisplacement;
          lastY += yDisplacement;
        }

        linesAlongLine.push({
          x1,
          y1,
          x2: lastX,
          y2: lastY,
          strokeColor,
          strokeWidth
        });
      }
      x1 = currentX;
      y1 = currentY;
    }
    lastPixelInThreshold = pixelInThreshold;
    lastX = currentX;
    lastY = currentY;
    currentX += tickX;
    currentY += tickY;
  }

  if (
    lastPixelInThreshold &&
    Math.abs(x1 - lastX) + Math.abs(y1 - lastY) > minLineLength
  ) {
    linesAlongLine.push({
      x1,
      y1,
      x2: lastX,
      y2: lastY,
      strokeColor,
      strokeWidth
    });
  }

  return linesAlongLine;
}

export function createLines(settings, imageData, width, height) {
  const {
    amountOfLines,
    continuous,
    renderEveryXPixels,
    renderEveryYPixels
  } = settings;

  const lines = [];

  let x = 0;
  let y = 0;
  if (continuous) {
    for (let i = 0; i < amountOfLines; i++) {
      const continuousLines = createContinuousLines(
        i,
        width,
        height,
        settings,
        imageData
      );

      for (let m = 0; m < continuousLines.length; m++) {
        const linesAlongLine = getLinesAlongLine(
          continuousLines[m],
          width,
          height,
          settings,
          imageData
        );

        for (let k = 0; k < linesAlongLine.length; k++) {
          lines.push(linesAlongLine[k]);
        }
      }
    }
  } else {
    for (x = 0; x < width; x += renderEveryXPixels) {
      for (y = 0; y < height; y += renderEveryYPixels) {
        const pixelColor = getPixelColorAtXY(imageData, x, y, width);
        if (!isInColorThreshhold(pixelColor, settings)) {
          continue;
        }

        lines.push(createLineAtPoint(x, y, settings, pixelColor));
      }
    }
  }

  return lines;
}

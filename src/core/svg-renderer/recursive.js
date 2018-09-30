import { getFractalDispacementForPoint } from './fractal';
import { getPixelColorAtXY, isInColorThreshhold } from './color';

import { RECURSIVE_LINE_ALGORITHMS } from '../ControllerConstants';

export function renderPaths(svgSettings, paths) {
  let renderString = '';
  for (let i = 0; i < paths.length; i++) {
    const { pathString, strokeWidth, strokeColor } = paths[i];

    renderString += `<path d="${pathString}" style="stroke: ${strokeColor}; stroke-width: ${strokeWidth}; fill: none;" />`;
  }

  return renderString;
}

function buildRecursivePath(
  settings,
  imageData,
  x,
  y,
  width,
  height,
  travelled,
  stack
) {
  // Ensure this is a valid pixel.
  if (x < 0 || y < 0 || x >= width || y >= height) {
    return '';
  }

  if (travelled[x][y]) {
    return '';
  }

  const pixelColor = getPixelColorAtXY(imageData, x, y, width);
  if (!isInColorThreshhold(pixelColor, settings)) {
    return '';
  }

  const {
    applyFractalDisplacement,
    // displaceOrigin,
    scale,
    maxRecursiveDepth,
    renderEveryXPixels,
    renderEveryYPixels,
    recursiveAlgorithm
  } = settings;

  let xPos = x;
  let yPos = y;

  let xBase = x;
  let yBase = y;

  if (applyFractalDisplacement) {
    // if (displaceOrigin) {
    //   const { xDisplacement, yDisplacement } = getFractalDispacementForPoint(xBase, yBase, settings);

    //   xBase += Math.round(xDisplacement / renderEveryXPixels) * renderEveryXPixels;
    //   yBase += Math.round(yDisplacement / renderEveryYPixels) * renderEveryYPixels;
    // }

    const { xDisplacement, yDisplacement } = getFractalDispacementForPoint(
      x,
      y,
      settings
    );

    xPos += xDisplacement;
    yPos += yDisplacement;
  }

  let pathString = ` L ${xPos * scale} ${yPos * scale}`;
  travelled[x][y] = true;

  if (stack > maxRecursiveDepth) {
    return pathString;
  }

  let moved = false;
  for (let i = -1; i < 2; i++) {
    for (let k = -1; k < 2; k++) {
      if (i === 0 && k === 0) {
        continue;
      }

      let xMove;
      let yMove;

      // eslint-disable-next-line default-case
      switch (recursiveAlgorithm) {
        case RECURSIVE_LINE_ALGORITHMS.first: {
          xMove = xBase + renderEveryXPixels * i;
          yMove = yBase + renderEveryYPixels * k;
          break;
        }
        case RECURSIVE_LINE_ALGORITHMS.second: {
          xMove = xBase + Math.abs(renderEveryXPixels * i);
          yMove = yBase - renderEveryYPixels * k;
          break;
        }
        case RECURSIVE_LINE_ALGORITHMS.third: {
          xMove = xBase + Math.abs(renderEveryXPixels * i);
          yMove = yBase - Math.abs(renderEveryYPixels * k);
          break;
        }
        case RECURSIVE_LINE_ALGORITHMS.fourth: {
          xMove = xBase + renderEveryXPixels * i;
          yMove = yBase + renderEveryYPixels * k;
          break;
        }
        case RECURSIVE_LINE_ALGORITHMS.fifth: {
          xMove = xBase + Math.abs(renderEveryXPixels * i);
          yMove = yBase + Math.abs(renderEveryYPixels * k);
          break;
        }
      }

      const pathAddition = buildRecursivePath(
        settings,
        imageData,
        xMove,
        yMove,
        width,
        height,
        travelled,
        stack + 1
      );

      if (pathAddition) {
        if (moved) {
          pathString += ` M ${xPos * scale} ${yPos * scale}`;
        } else {
          moved = true;
        }

        pathString += pathAddition;

        if (
          recursiveAlgorithm === RECURSIVE_LINE_ALGORITHMS.fifth ||
          recursiveAlgorithm === RECURSIVE_LINE_ALGORITHMS.fourth
        ) {
          return pathString;
        }
      }
    }
  }

  return pathString;
}

export function createRecursivePaths(settings, imageData, width, height) {
  const {
    autoColor,
    scale,
    renderEveryXPixels,
    renderEveryYPixels,
    strokeColor,
    strokeWidth,
    strokeWidthRandomness
  } = settings;

  const travelled = [];
  const paths = [];

  for (let x = 0; x < width; x += renderEveryXPixels) {
    travelled[x] = [];
  }

  for (let x = 0; x < width; x += renderEveryXPixels) {
    for (let y = 0; y < height; y += renderEveryYPixels) {
      const pathString = buildRecursivePath(
        settings,
        imageData,
        x,
        y,
        width,
        height,
        travelled,
        0
      );
      const pixelColor = getPixelColorAtXY(imageData, x, y, width);
      const pathColor = autoColor
        ? `rgb(${pixelColor.r}, ${pixelColor.g}, ${pixelColor.b})`
        : strokeColor;

      if (pathString && pathString.length > 0) {
        paths.push({
          pathString: `M ${x * scale} ${y * scale} ${pathString}`,
          strokeColor: pathColor,
          strokeWidth: strokeWidth * (1 - Math.random() * strokeWidthRandomness)
        });
      }
    }
  }

  return paths;
}

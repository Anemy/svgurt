// import { getFractalDispacementForPoint } from './fractal';
import {
  getPixelColorAtXY,
  isInColorThreshhold,
  getPixelColorIntensity
} from './color';

function createConcentricCirclePath(settings, radius, imageData, centerX, centerY) {
  const {
    arcUnits,
    intensityWeight
  } = settings;

  const arcAngle = 2 * Math.PI / arcUnits;

  const pathArcs = [];
  for (let i = 1; i <= arcUnits ; i++) {
    const xNew = centerX + radius * Math.sin(arcAngle * i);
    const yNew = centerY - radius * Math.cos(arcAngle * i);

    const xArcCenter = centerX + radius * Math.sin(arcAngle * i - arcAngle/2);
    const yArcCenter = centerY - radius * Math.cos(arcAngle * i - arcAngle/2);

    const pixelColor = getPixelColorAtXY(imageData, xArcCenter, yArcCenter, centerX * 2);
    let eclipseHeight = radius;
    if (isInColorThreshhold(pixelColor, settings)) {
      eclipseHeight = getPixelColorIntensity(pixelColor, settings) * intensityWeight + radius;
    }

    const pathArc = {
      rx: radius,
      ry: eclipseHeight,
      xRot: (i * arcAngle - arcAngle/2) * 360 / (2 * Math.PI),
      x: xNew,
      y: yNew
    };
    pathArcs.push(pathArc);
  }

  return pathArcs;
}

function createConcentricShapePath(settings, radius, imageData, centerX, centerY) {
  const {
    intensityWeight
  } = settings;

  const arcAngle = (2 * Math.PI) / (settings['shape sides'] * settings['units per side']);

  const pathPoints = [];

  for (let k = 0; k < settings['shape sides']; k++) {
    // For each side:
    // Get starting location. Top of circle.
    // Get ending location. Next position.
    // Step the units.
    // Build lines for each unit.

    const currentX = centerX + radius * Math.sin(arcAngle * k);
    const currentY = centerY - radius * Math.cos(arcAngle * k);

    const nextX = centerX + radius * Math.sin(arcAngle * (k + 1));
    const nextY = centerY - radius * Math.cos(arcAngle * (k + 1));

    for (let i = 1; i <= settings['units per side'] ; i++) {
      const xNew = centerX + radius * Math.sin(arcAngle * i);
      const yNew = centerY - radius * Math.cos(arcAngle * i);

      const xArcCenter = centerX + radius * Math.sin(arcAngle * i - arcAngle/2);
      const yArcCenter = centerY - radius * Math.cos(arcAngle * i - arcAngle/2);

      const pixelColor = getPixelColorAtXY(imageData, xArcCenter, yArcCenter, centerX * 2);
      let eclipseHeight = radius;
      if (isInColorThreshhold(pixelColor, settings)) {
        eclipseHeight = getPixelColorIntensity(pixelColor, settings) * intensityWeight + radius;
      }

      const pathArc = {
        x: xNew,
        y: yNew
      };
      pathPoints.push(pathArc);
    }
  }

  return pathPoints;
}

export function createConcentricPaths(settings, imageData, width, height) {
  const { circleShape, radiusStep } = settings;
  const maxRadius = Math.max(width, height)/2;
  const concentricPaths = [];

  for (let r = radiusStep; r <= maxRadius; r += radiusStep) {
    const pathInfo = {
      radius: r
    };

    if (circleShape) {
      pathInfo.arcs = createConcentricCirclePath(settings, r, imageData, width / 2, height / 2);
    } else {
      pathInfo.lines = createConcentricShapePath(settings, r, imageData, width / 2, height / 2);
    }

    concentricPaths.push(pathInfo);
  }

  return concentricPaths;
}

export function renderConcentricPaths(svgSettings, concentricPaths, centerX, centerY) {
  const {
    circleShape,
    outputScale,
    strokeColor,
    strokeWidth
  } = svgSettings;

  let renderString = '';
  for (let i = 0; i < concentricPaths.length; i++) {
    const conPath = concentricPaths[i];
    renderString += `<path d="M ${centerX* outputScale} ${centerY* outputScale} m 0 ${-conPath.radius * outputScale}`;
    if (circleShape) {
      for (let j = 0; j < conPath.arcs.length; j++) {
        const { rx, ry, xRot, x, y} = conPath.arcs[j];
        renderString += ` A ${rx * outputScale} ${ry * outputScale} ${xRot} 0 1 ${x * outputScale} ${y * outputScale}`;
      }
    } else {
      for (let j = 0; j < conPath.lines.length; j++) {
        const { x, y } = conPath.lines[j];
        renderString += ` L ${x * outputScale} ${y * outputScale}`;
      }
    }
    renderString += `"stroke="${strokeColor}"; stroke-width="${strokeWidth}"; style="fill: none;" />`;
  }

  return renderString;
}


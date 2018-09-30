import {
  getPixelColorAtXY,
  isInColorThreshhold,
  getPixelColorIntensity
} from './color';

function createConcentricPath(settings, radius, imageData, centerX, centerY) {
  const { circleArcs, intensityWeight } = settings;

  const arcAngle = (2 * Math.PI) / circleArcs; // hardcoded to 1 degree for now

  const pathArcs = [];
  for (let i = 1; i <= circleArcs; i++) {
    const xNew = centerX + radius * Math.sin(arcAngle * i);
    const yNew = centerY - radius * Math.cos(arcAngle * i);

    const xArcCenter = centerX + radius * Math.sin(arcAngle * i - arcAngle / 2);
    const yArcCenter = centerY - radius * Math.cos(arcAngle * i - arcAngle / 2);

    const pixelColor = getPixelColorAtXY(
      imageData,
      xArcCenter,
      yArcCenter,
      centerX * 2
    );
    let eclipseHeight = radius;
    if (isInColorThreshhold(pixelColor, settings)) {
      eclipseHeight =
        getPixelColorIntensity(pixelColor, settings) * intensityWeight + radius;
    }

    const pathArc = {
      rx: radius,
      ry: eclipseHeight,
      xRot: ((i * arcAngle - arcAngle / 2) * 360) / (2 * Math.PI),
      x: xNew,
      y: yNew
    };
    pathArcs.push(pathArc);
  }

  return pathArcs;
}

export function createConcentricPaths(settings, imageData, width, height) {
  const { radiusStep } = settings;
  const maxRadius = Math.max(width, height) / 2;
  const concentricPaths = [];

  for (let r = radiusStep; r <= maxRadius; r += radiusStep) {
    const pathInfo = {
      radius: r,
      arcs: createConcentricPath(settings, r, imageData, width / 2, height / 2)
    };
    concentricPaths.push(pathInfo);
  }

  return concentricPaths;
}

export function renderConcentricPaths(
  svgSettings,
  concentricPaths,
  centerX,
  centerY
) {
  const { scale, strokeColor, strokeWidth } = svgSettings;

  let renderString = '';
  for (let i = 0; i < concentricPaths.length; i++) {
    const conPath = concentricPaths[i];
    renderString += `<path d="M ${centerX * scale} ${centerY *
      scale} m 0 ${-conPath.radius * scale}`;
    for (let j = 0; j < conPath.arcs.length; j++) {
      const { rx, ry, xRot, x, y } = conPath.arcs[j];
      renderString += ` A ${rx * scale} ${ry *
        scale} ${xRot} 0 1 ${x * scale} ${y * scale}`;
    }
    renderString += `" stroke="${strokeColor}" stroke-width="${strokeWidth}" style="fill: none;" />`;
  }

  return renderString;
}

export function renderPotracePaths(svgSettings, paths) {
  const {
    fill,
    fillColor,
    outputScale,
    stroke,
    strokeColor,
    strokeWidth
  } = svgSettings;

  let pathString = '';

  for (let i = 0; i < paths.length; i++) {
    pathString += '<path d="';

    for (let k = 0; k < paths[i].length; k++) {
      if (paths[i][k].type === 'POINT') {
        pathString += ` M ${paths[i][k].x * outputScale} ${paths[i][k].y *
          outputScale}`;
      } else if (paths[i][k].type === 'CURVE') {
        pathString += ' C';
        pathString += ` ${paths[i][k].x1 * outputScale},${paths[i][k].y1 *
          outputScale}`;
        pathString += ` ${paths[i][k].x2 * outputScale},${paths[i][k].y2 *
          outputScale}`;
        pathString += ` ${paths[i][k].x * outputScale},${paths[i][k].y *
          outputScale}`;
      }
    }

    pathString += `" stroke="${
      stroke ? strokeColor : 'none'
    }" stroke-width="${strokeWidth}" style="fill: ${
      fill ? fillColor : 'none'
    };" />`;
  }

  return pathString;
}

export function renderPotracePaths(svgSettings, paths) {
  const {
    fill,
    fillColor,
    scale,
    stroke,
    strokeColor,
    strokeWidth
  } = svgSettings;

  let pathString = '';

  for (let i = 0; i < paths.length; i++) {
    pathString += '<path d="';

    for (let k = 0; k < paths[i].length; k++) {
      if (paths[i][k].type === 'POINT') {
        pathString += ` M ${paths[i][k].x * scale} ${paths[i][k].y *
          scale}`;
      } else if (paths[i][k].type === 'CURVE') {
        pathString += ' C';
        pathString += ` ${paths[i][k].x1 * scale},${paths[i][k].y1 *
          scale}`;
        pathString += ` ${paths[i][k].x2 * scale},${paths[i][k].y2 *
          scale}`;
        pathString += ` ${paths[i][k].x * scale},${paths[i][k].y *
          scale}`;
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

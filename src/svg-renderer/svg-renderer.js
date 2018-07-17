import { SVG_RENDER_TYPES } from '../controller/ControllerConstants';
import { createCircles, renderCircles } from './circle';
import { createCurves, renderCurves } from './curve';
import { createLines, renderLines } from './line';
import { createRecursivePaths, renderPaths } from './recursive';

export function renderSvgString(imageData, svgSettings, width, height, done) {
  const {
    outputScale
  } = svgSettings;

  setImmediate(() => {
    let svgString = `<svg
      height="${height * outputScale}"
      width="${width * outputScale}"
    >`;

    // eslint-disable-next-line default-case
    switch (svgSettings.svgRenderType) {
      case SVG_RENDER_TYPES.CIRCLE: {
        const circles = createCircles(svgSettings, imageData, width, height);

        svgString += renderCircles(svgSettings, circles);
        break;
      }
      case SVG_RENDER_TYPES.CURVE: {
        const curves = createCurves(svgSettings, imageData, width, height);

        svgString += renderCurves(svgSettings, curves);
        break;
      }
      case SVG_RENDER_TYPES.LINE: {
        const lines = createLines(svgSettings, imageData, width, height);

        svgString += renderLines(svgSettings, lines);
        break;
      }
      case SVG_RENDER_TYPES.RECURSIVE: {
        const lines = createRecursivePaths(svgSettings, imageData, width, height);
        svgString += renderPaths(svgSettings, lines);
      }
    }

    svgString += '</svg>';

    done(svgString);
  });
}

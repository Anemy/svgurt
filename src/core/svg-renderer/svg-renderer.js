import { SVG_RENDER_TYPES } from '../ControllerConstants';
import { createCircles, renderCircles } from './circle';
import { createCurves, renderCurves } from './curve';
import { createLines, renderLines } from './line';
import { createRecursivePaths, renderPaths } from './recursive';
import { createConcentricPaths, renderConcentricPaths } from './concentric';
import { renderPotracePaths } from './trace';
import potrace from './potrace';

export function renderSvgString(
  imageData,
  canvas,
  svgSettings,
  width,
  height,
  done
) {
  const { scale } = svgSettings;

  setTimeout(() => {
    const dimensionsString = `height="${height * scale}" width="${width *
      scale}"`;
    const nameSpaceString =
      'xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"';
    let svgString = `<svg ${dimensionsString} ${nameSpaceString}>`;

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
        const lines = createRecursivePaths(
          svgSettings,
          imageData,
          width,
          height
        );

        svgString += renderPaths(svgSettings, lines);
        break;
      }
      case SVG_RENDER_TYPES.TRACE: {
        if (!canvas) {
          done(
            null,
            'Unfortunatly, we only currently support trace in the browser, since it reads data from html canvas. This is on our roadmap to fix. Feel free to make a github issue about it to get us moving on it.'
          );
          return;
        }

        const paths = potrace.getPaths(
          potrace.traceCanvas(canvas, {
            turdsize: svgSettings.noiseSize
          })
        );

        svgString += renderPotracePaths(svgSettings, paths);
        break;
      }
      case SVG_RENDER_TYPES.CONCENTRIC: {
        const concentricPaths = createConcentricPaths(
          svgSettings,
          imageData,
          width,
          height
        );

        svgString += renderConcentricPaths(
          svgSettings,
          concentricPaths,
          width / 2,
          height / 2
        );
      }
    }

    svgString += '</svg>';

    done(svgString);
  });
}

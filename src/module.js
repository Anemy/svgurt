import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import getPixels from 'get-pixels';
import { promisify } from 'util';

import { manipulateImageData } from './core/image-manipulator';
import { controllerConfig } from './core/ControllerConstants';
import { renderSvgString } from './core/svg-renderer/svg-renderer';

const configDefaults = {};

_.each(controllerConfig, (configItem, index) => {
  configDefaults[index] = configItem.default;
});

const defaultConfig = {
  ...configDefaults,
  input: 'image.jpg',
  output: 'output',
  returnSVGString: false
};

async function runSvgurtOnFile(config, inputFileName, outputFileName) {
  const fileNameToImport = path.join(__dirname, '..', inputFileName);

  let pixels;
  try {
    const runGetPixels = promisify(getPixels);
    pixels = await runGetPixels(fileNameToImport);
  } catch (err) {
    throw new Error(`Error importing image: ${err}`);
  }

  const width = pixels.shape[0];
  const height = pixels.shape[1];

  const imageDataToUse = {
    data: pixels.data
  };

  // Do image manipulation - this mutates the image data.
  // It mutates because we're depending on some libraries that mutate it... Not my choice!
  manipulateImageData(imageDataToUse, config, width, height);

  // Run svg creation based on the image data.
  const svgString = await renderSvgString(
    imageDataToUse.data,
    null,
    config,
    width,
    height,
  );

  // Write svg string to output file name.
  if (config.returnSVGString) {
    return svgString;
  } else {
    const writeFile = promisify(fs.writeFile);
    await writeFile(`${outputFileName}.svg`, svgString);
  }
}

async function runSvgurt(config) {
  let svgurtConfig = {
    ...defaultConfig,
    ...config
  };

  if (_.isArray(svgurtConfig.input)) {
    const isOutputArray = _.isArray(svgurtConfig.output);

    let svgStrings = [];
    let errStrings = [];

    await Promise.all(svgurtConfig.input, (inputFileName, index) => {
      try {
        let res;
        if (isOutputArray && svgurtConfig.output[index]) {
          res = runSvgurtOnFile(
            svgurtConfig,
            inputFileName,
            svgurtConfig.output[index]
          );

        } else {
          // If they don't supply a corresponding output file name then we just use the input file name.
          res = runSvgurtOnFile(
            svgurtConfig,
            inputFileName,
            inputFileName
          );
        }

        if (config.returnSVGString) {
          svgStrings.push(res);
        }
      } catch (err) {
        errStrings.push(err);
      }
    });

    return _.isEmpty(errStrings) ? false : errStrings, svgStrings;
  } else {
    if (_.isArray(svgurtConfig.output)) {
      if (_.isEmpty(svgurtConfig.output)) {
        svgurtConfig.output = defaultConfig.output;
      } else {
        // Can't have an output array with out an input array.
        svgurtConfig.output = _.first(svgurtConfig.output);
      }
    }

    return await runSvgurtOnFile(
      svgurtConfig,
      svgurtConfig.input,
      svgurtConfig.output,
    );
  }
};


module.exports = runSvgurt;
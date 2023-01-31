import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import getPixels from 'get-pixels';
import { promisify } from 'util';

import { manipulateImageData } from './core/image-manipulator';
import { controllerConfig } from './core/ControllerConstants';
import { renderSvgString } from './core/svg-renderer/svg-renderer';

// TODO: Cleanup a lot of the things in this file.
// We should have some better flows and configuration management.

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

// Data is either a file name or a buffer.
async function runSvgurtOnData(config, input, outputFileName) {
  let pixels;
  try {
    const runGetPixels = promisify(getPixels);
    // Types from https://github.com/scijs/get-pixels/blob/master/node-pixels.js#L108
    if (config.imageBuffer && config.imageBufferType) {
      pixels = await runGetPixels(config.imageBuffer, config.imageBufferType);
    } else {
      pixels = await runGetPixels(input);
    }
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
    await writeFile(`${outputFileName || config.output}.svg`, svgString);
  }
}

async function runSvgurtOnFile(config, inputFileName, outputFileName) {
  const fileNameToImport = path.join(__dirname, '..', inputFileName);

  return await runSvgurtOnData(config, fileNameToImport, outputFileName);
}

async function runSvgurt(config) {
  const svgurtConfig = {
    ...defaultConfig,
    ...config
  };

  // Types from https://github.com/scijs/get-pixels/blob/master/node-pixels.js#L108
  if (svgurtConfig.imageBuffer && svgurtConfig.imageBufferType) {
    return await runSvgurtOnData(svgurtConfig);
  }

  // File runners.
  if (_.isArray(svgurtConfig.input)) {
    const isOutputArray = _.isArray(svgurtConfig.output);

    let svgStrings = [];
    let errStrings = [];

    await Promise.all(svgurtConfig.input, async(inputFileName, index) => {
      try {
        let res;
        if (isOutputArray && svgurtConfig.output[index]) {
          res = await runSvgurtOnFile(
            svgurtConfig,
            inputFileName,
            svgurtConfig.output[index]
          );

        } else {
          // If they don't supply a corresponding output file name then we just use the input file name.
          res = await runSvgurtOnFile(
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
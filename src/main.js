
import _ from 'lodash';
import imageDataURI from 'image-data-uri';
import imageSize from 'image-size';

import { manipulateImageData } from './image-renderer/image-manipulator';
import { controllerConfig } from './controller/ControllerConstants';
import { renderSvgString } from './svg-renderer/svg-renderer';

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

function runSvgurtOnFile(config, inputFileName, outputFileName, callback) {
  const fileNameToImport = inputFileName.indexOf('./') === 0 ? inputFileName : `./${inputFileName}`;

  // Get the image dimensions.
  imageSize(fileNameToImport, (err, dimensions) => {
    if (err) {
      callback(`Error importing image: ${err}`);
    }

    const { width, height } = dimensions;

    // Get the image data.
    imageDataURI.encodeFromFile(fileNameToImport).then(imageData => {
      let imageDataToUse = [...imageData];

      // Do image manipulation - this mutates the image data.
      // It mutates because we're depending on some libraries that mutate it... Not my choice!
      manipulateImageData({data: imageDataToUse}, config, width, height);

      // Run svg creation based on the image data.
      renderSvgString(imageDataToUse, config, width, height, svgString => {
        // Write svg string to output file name.
        if (config.returnSVGString) {
          callback(false, svgString);
        } else {
          const fsName = 'fs';
          const fs = require(fsName);

          fs.writeFile(`${outputFileName}.svg`, svgString, function() {
            callback(false);
          });
        }
      });
    }).catch(err => {
      callback(`Error running svgurt when importing image ${fileNameToImport} ${err}`);
    });
  });
}

module.exports = function(config, callback) {
  let svgurtConfig = {
    ...defaultConfig,
    ...config
  };

  if (_.isArray(svgurtConfig.input)) {
    const isOutputArray = _.isArray(svgurtConfig.output);

    _.each(svgurtConfig.input, (inputFileName, index) => {
      if (isOutputArray && svgurtConfig.output[index]) {
        runSvgurtOnFile(svgurtConfig, inputFileName, svgurtConfig.output[index], callback);
      } else {
        // If they don't supply a corresponding output file name then we just use the input file name.
        runSvgurtOnFile(svgurtConfig, inputFileName, inputFileName, callback);
      }
    });
  } else {
    if (_.isArray(svgurtConfig.output)) {
      if (_.isEmpty(svgurtConfig.output)) {
        svgurtConfig.output = defaultConfig.output;
      } else {
        // Can't have an output array with out an input array.
        svgurtConfig.output = _.first(svgurtConfig.output);
      }
    }

    runSvgurtOnFile(svgurtConfig, svgurtConfig.input, svgurtConfig.output, callback);
  }
};

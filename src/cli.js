#! /usr/bin/env node

import _ from 'lodash';
import path from 'path';
import svgurt from './module';

const args = process.argv.slice(2);

if (args[0] === '-h' || args[0] === 'help') {
  console.log('Please look at the cli docs located at http://svgurt.com/#/cli');
} else if (!args[0]) {
  console.log(
    'Error: You must supply a config json file location when running svgurt.'
  );
  console.log(
    'Feel free to look at the cli docs located at http://svgurt.com/#/cli'
  );
} else {
  const config = require(path.join(__dirname, '..', args[0]));

  svgurt(config, (err, result) => {
    if (err) {
      console.error(err);
      return;
    }

    if (config.returnSVGString) {
      if (_.isArray(result)) {
        _.each(result, resultString => {
          console.log(resultString);
        });
      } else {
        console.log(result);
      }
    }
  });
}

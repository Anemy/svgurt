#! /usr/bin/env node
"use strict";

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _module = require("./module");

var _module2 = _interopRequireDefault(_module);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var args = process.argv.slice(2);

if (args[0] === "-h" || args[0] === "help") {
  console.log("Please look at the cli docs located at http://svgurt.com/#/cli");
} else if (!args[0]) {
  console.log("Error: You must supply a config json file location when running svgurt.");
  console.log("Feel free to look at the cli docs located at http://svgurt.com/#/cli");
} else {
  var config = require(_path2.default.join(__dirname, "..", args[0]));

  (0, _module2.default)(config, function (err, result) {
    if (err) {
      console.error(err);
      return;
    }

    if (config.returnSVGString) {
      if (_lodash2.default.isArray(result)) {
        _lodash2.default.each(result, function (resultString) {
          console.log(resultString);
        });
      } else {
        console.log(result);
      }
    }
  });
}
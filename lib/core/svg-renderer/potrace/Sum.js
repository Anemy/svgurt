"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Sum = function Sum(x, y, xy, x2, y2) {
  (0, _classCallCheck3.default)(this, Sum);

  this.x = x;
  this.y = y;
  this.xy = xy;
  this.x2 = x2;
  this.y2 = y2;
};

exports.default = Sum;
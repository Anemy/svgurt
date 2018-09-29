'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Point = function () {
  function Point(x, y) {
    (0, _classCallCheck3.default)(this, Point);

    this.x = x;
    this.y = y;
  }

  (0, _createClass3.default)(Point, [{
    key: 'copy',
    value: function copy() {
      return new Point(this.x, this.y);
    }
  }, {
    key: 'toIndex',
    value: function toIndex(width, height) {
      if (this.x < 0 || this.y < 0 || this.x >= width || this.y >= height) return null;
      return width * this.y + this.x;
    }
  }, {
    key: 'lerp',
    value: function lerp(point, lambda) {
      var x = this.x + lambda * (point.x - this.x);
      var y = this.y + lambda * (point.y - this.y);

      return new Point(x, y);
    }
  }, {
    key: 'dorthInfty',
    value: function dorthInfty(point) {
      var x = -(0, _utils.sign)(point.y - this.y);
      var y = (0, _utils.sign)(point.x - this.x);

      return new Point(x, y);
    }
  }, {
    key: 'ddenom',
    value: function ddenom(point) {
      var r = this.dorthInfty(point);

      return r.y * (point.x - this.x) - r.x * (point.y - this.y);
    }
  }]);
  return Point;
}();

exports.default = Point;
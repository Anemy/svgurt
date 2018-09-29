'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _Point = require('./Point.js');

var _Point2 = _interopRequireDefault(_Point);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Bitmap = function () {
  function Bitmap(width, height) {
    (0, _classCallCheck3.default)(this, Bitmap);

    this.width = width;
    this.height = height;
    this.size = width * height;
    this.data = new Int8Array(this.size);
  }

  (0, _createClass3.default)(Bitmap, [{
    key: 'at',
    value: function at(x, y) {
      return x >= 0 && x < this.width && y >= 0 && y < this.height && this.data[this.width * y + x] === 1;
    }
  }, {
    key: 'flip',
    value: function flip(x, y) {
      if (this.at(x, y)) {
        this.data[this.width * y + x] = 0;
      } else {
        this.data[this.width * y + x] = 1;
      }
    }
  }, {
    key: 'copy',
    value: function copy() {
      var bitmap = new Bitmap(this.width, this.height);
      for (var i = 0; i < this.size; i++) {
        bitmap.data[i] = this.data[i];
      }
      return bitmap;
    }
  }, {
    key: 'index',
    value: function index(i) {
      var x = i % this.width;
      var y = Math.floor(i / this.width);
      return new _Point2.default(x, y);
    }
  }, {
    key: 'xOrPath',
    value: function xOrPath(path) {
      var y1 = path.points[0].y;

      for (var i = 1; i < path.points.length; i++) {
        var x = path.points[i].x;
        var y = path.points[i].y;

        if (y !== y1) {
          var minY = Math.min(y1, y);
          var maxX = path.maxX;
          for (var j = x; j < maxX; j++) {
            this.flip(j, minY);
          }
          y1 = y;
        }
      }
    }
  }]);
  return Bitmap;
}();

exports.default = Bitmap;
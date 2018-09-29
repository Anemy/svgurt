"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require("babel-runtime/helpers/toConsumableArray");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Path = function () {
  function Path(points, area, isHole) {
    (0, _classCallCheck3.default)(this, Path);

    this.points = points;
    this.area = area;
    this.isHole = isHole;

    var xValues = this.points.map(function (_ref) {
      var x = _ref.x;
      return x;
    });
    var yValues = this.points.map(function (_ref2) {
      var y = _ref2.y;
      return y;
    });

    this.minX = Math.min.apply(Math, (0, _toConsumableArray3.default)(xValues));
    this.minY = Math.min.apply(Math, (0, _toConsumableArray3.default)(yValues));
    this.maxX = Math.max.apply(Math, (0, _toConsumableArray3.default)(xValues));
    this.maxY = Math.max.apply(Math, (0, _toConsumableArray3.default)(yValues));

    this.curve = {};
  }

  (0, _createClass3.default)(Path, [{
    key: "reverse",
    value: function reverse() {
      this.curve.vertex.reverse();
    }
  }]);
  return Path;
}();

exports.default = Path;
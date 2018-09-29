"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Quad = function () {
  function Quad() {
    (0, _classCallCheck3.default)(this, Quad);

    this.data = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  }

  (0, _createClass3.default)(Quad, [{
    key: "at",
    value: function at(x, y) {
      return this.data[x * 3 + y];
    }
  }]);
  return Quad;
}();

exports.default = Quad;
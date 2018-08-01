"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactMarkdown = require("react-markdown");

var _reactMarkdown2 = _interopRequireDefault(_reactMarkdown);

var _reactRouterDom = require("react-router-dom");

require("./CLIPage.css");

var _cliWiki = require("./cli-wiki.md");

var _cliWiki2 = _interopRequireDefault(_cliWiki);

var _SvgurtTextLogo = require("../home/SvgurtTextLogo");

var _SvgurtTextLogo2 = _interopRequireDefault(_SvgurtTextLogo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CLIPage = function (_Component) {
  (0, _inherits3.default)(CLIPage, _Component);

  function CLIPage() {
    (0, _classCallCheck3.default)(this, CLIPage);
    return (0, _possibleConstructorReturn3.default)(this, (CLIPage.__proto__ || (0, _getPrototypeOf2.default)(CLIPage)).apply(this, arguments));
  }

  (0, _createClass3.default)(CLIPage, [{
    key: "render",
    value: function render() {
      return _react2.default.createElement(
        _react2.default.Fragment,
        null,
        _react2.default.createElement(
          "div",
          { className: "svgee-top-nav-bar" },
          _react2.default.createElement(_SvgurtTextLogo2.default, null),
          _react2.default.createElement(
            _reactRouterDom.Link,
            { className: "svgee-top-nav-link", to: "/" },
            "Home"
          ),
          _react2.default.createElement(
            _reactRouterDom.Link,
            { className: "svgee-top-nav-link", to: "demo" },
            "Demo"
          ),
          _react2.default.createElement(
            "a",
            {
              className: "svgee-top-nav-link",
              href: "https://github.com/Anemy/svgurt",
              rel: "noopener noreferrer",
              target: "_blank"
            },
            "Github"
          )
        ),
        _react2.default.createElement(
          "div",
          { className: "svgee-docs-container" },
          _react2.default.createElement(_reactMarkdown2.default, { source: _cliWiki2.default })
        )
      );
    }
  }]);
  return CLIPage;
}(_react.Component);

exports.default = CLIPage;
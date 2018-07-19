'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = require('react-router-dom');

require('./Home.css');

var _SvgurtExampleSvg = require('./SvgurtExampleSvg');

var _SvgurtExampleSvg2 = _interopRequireDefault(_SvgurtExampleSvg);

var _SvgurtTextLogo = require('./SvgurtTextLogo');

var _SvgurtTextLogo2 = _interopRequireDefault(_SvgurtTextLogo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Home = function (_Component) {
  (0, _inherits3.default)(Home, _Component);

  function Home() {
    (0, _classCallCheck3.default)(this, Home);
    return (0, _possibleConstructorReturn3.default)(this, (Home.__proto__ || (0, _getPrototypeOf2.default)(Home)).apply(this, arguments));
  }

  (0, _createClass3.default)(Home, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'svgee-home' },
        _react2.default.createElement(
          'div',
          { className: 'svgee-top-nav-bar' },
          _react2.default.createElement(_SvgurtTextLogo2.default, null),
          _react2.default.createElement(
            _reactRouterDom.Link,
            {
              className: 'svgee-top-nav-link',
              to: 'cli'
            },
            'CLI Docs'
          ),
          _react2.default.createElement(
            _reactRouterDom.Link,
            {
              className: 'svgee-top-nav-link',
              to: 'demo'
            },
            'Demo'
          ),
          _react2.default.createElement(
            'a',
            {
              className: 'svgee-top-nav-link',
              href: 'https://github.com/Anemy/svgurt',
              rel: 'noopener noreferrer',
              target: '_blank'
            },
            'Github'
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'svgee-home-page' },
          _react2.default.createElement('img', {
            className: 'svgee-logo-image',
            src: '/images/svgurt_logo.png',
            alt: 'svgurt logo'
          }),
          _react2.default.createElement(
            'h1',
            { className: 'svgee-svgurt-title' },
            'Svgurt'
          ),
          _react2.default.createElement(
            'h2',
            { className: 'svgee-tool-desc' },
            'Image -> SVG Vectorizing Tool'
          ),
          _react2.default.createElement(
            'h3',
            { className: 'svgee-open-source-desc' },
            'Free &\xA0',
            _react2.default.createElement(
              'a',
              {
                href: 'https://github.com/Anemy/svgurt',
                rel: 'noopener noreferrer',
                target: '_blank'
              },
              'Open Source'
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'svgee-demo-link-container' },
            _react2.default.createElement(
              _reactRouterDom.Link,
              {
                className: 'svgee-demo-link',
                to: 'demo'
              },
              'Live Demo'
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'svgee-import-image-example' },
            _react2.default.createElement('img', {
              className: 'svgee-example-image',
              src: '/images/palm.png',
              alt: 'palm tree'
            }),
            _react2.default.createElement(
              'div',
              { className: 'svgee-example-text' },
              '-->'
            ),
            _react2.default.createElement(_SvgurtExampleSvg2.default, null)
          )
        )
      );
    }
  }]);
  return Home;
}(_react.Component);

exports.default = Home;
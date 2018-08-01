'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _setImmediate2 = require('babel-runtime/core-js/set-immediate');

var _setImmediate3 = _interopRequireDefault(_setImmediate2);

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

require('./Demo.css');

var _ImageRenderer = require('../image-renderer/ImageRenderer');

var _ImageRenderer2 = _interopRequireDefault(_ImageRenderer);

var _Controller = require('../controller/Controller');

var _exampleImage = require('../fixtures/example-image');

var _exampleImage2 = _interopRequireDefault(_exampleImage);

var _SvgurtTextLogo = require('../home/SvgurtTextLogo');

var _SvgurtTextLogo2 = _interopRequireDefault(_SvgurtTextLogo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Demo = function (_Component) {
  (0, _inherits3.default)(Demo, _Component);

  function Demo(props) {
    (0, _classCallCheck3.default)(this, Demo);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Demo.__proto__ || (0, _getPrototypeOf2.default)(Demo)).call(this, props));

    _this.state = {
      loadingImage: true,
      imageLoaded: false,
      imageLoadingError: false
    };
    _this.controller = null;
    _this.originalImageURI = null;

    _this.invertImageClicked = function () {
      if (_this.state.imageLoaded) {
        _this.image.invertImage();

        _this.image.setNeedsRender();

        _this.setState({
          imageLoaded: true
        });
      }
    };

    _this.loadExampleImage = function () {
      _this.originalImageURI = _exampleImage2.default;

      _this.controller = (0, _Controller.createController)();

      _this.setState({
        imageLoaded: true,
        loadingImage: false
      });
    };

    _this.handleImageChange = function () {
      if (!_this.state.loadingImage && _this.imageInputRef.files && _this.imageInputRef.files[0]) {
        _this.setState({
          loadingImage: true,
          imageLoadingError: false
        });

        var reader = new FileReader();

        reader.onloadend = function () {
          _this.controller = (0, _Controller.createController)();
          _this.originalImageURI = reader.result;

          _this.setState({
            loadingImage: false,
            imageLoaded: true
          });
        };

        reader.onerror = function () {
          _this.setState({
            loadingImage: false,
            imageLoadingError: true
          });
        };

        (0, _setImmediate3.default)(function () {
          reader.readAsDataURL(_this.imageInputRef.files[0]);
        });
      }
    };

    return _this;
  }

  (0, _createClass3.default)(Demo, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.loadExampleImage();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.controller) {
        this.controller.gui.destroy();
        this.controller = null;
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _state = this.state,
          imageLoaded = _state.imageLoaded,
          imageLoadingError = _state.imageLoadingError,
          loadingImage = _state.loadingImage;


      return _react2.default.createElement(
        _react2.default.Fragment,
        null,
        _react2.default.createElement(
          'div',
          { className: 'svgee-top-nav-bar' },
          _react2.default.createElement(_SvgurtTextLogo2.default, null),
          _react2.default.createElement(
            _reactRouterDom.Link,
            { className: 'svgee-top-nav-link', to: '/' },
            'Home'
          ),
          _react2.default.createElement(
            _reactRouterDom.Link,
            { className: 'svgee-top-nav-link', to: 'cli' },
            'Cli Docs'
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
        loadingImage && _react2.default.createElement(
          'p',
          null,
          'Importing Image...'
        ),
        imageLoadingError && _react2.default.createElement(
          'p',
          null,
          'Failed to load image. Please try again.'
        ),
        imageLoaded && _react2.default.createElement(_ImageRenderer2.default, {
          controller: this.controller,
          imageURI: this.originalImageURI
        }),
        _react2.default.createElement('div', { id: 'js-dat-gui-container', className: 'svgee-dat-gui-container' })
      );
    }
  }]);
  return Demo;
}(_react.Component);

exports.default = Demo;
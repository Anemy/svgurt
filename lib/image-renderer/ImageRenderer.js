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

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Controller = require('../controller/Controller');

var _imageManipulator = require('./image-manipulator');

var _svgRenderer = require('../svg-renderer/svg-renderer');

var _downloader = require('./downloader');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ImageRenderer = function (_Component) {
  (0, _inherits3.default)(ImageRenderer, _Component);

  function ImageRenderer(props) {
    (0, _classCallCheck3.default)(this, ImageRenderer);

    var _this = (0, _possibleConstructorReturn3.default)(this, (ImageRenderer.__proto__ || (0, _getPrototypeOf2.default)(ImageRenderer)).call(this, props));

    _this.state = {
      imageLoadingError: false,
      isRendered: false,
      isRendering: false,
      loadingImage: true,
      svgString: ''
    };

    _this.updateSvgControlListeners = function () {
      var controller = _this.props.controller;

      _lodash2.default.each(controller.svgRenderChangingControls, function (svgRenderChangingControl) {
        svgRenderChangingControl.onChange(function () {
          (0, _Controller.updateRenderType)(_this.props.controller);

          _this.updateSvgRender();

          _this.updateSvgControlListeners();
        });
      });

      _lodash2.default.each(_this.props.controller.svgChangingControls, function (svgSettingControl) {
        svgSettingControl.onFinishChange(function () {
          _this.updateSvgRender();
        });
      });
    };

    _this.listenToSvgControls = function () {
      _this.props.controller.downloadSvgButton.onChange(function () {
        (0, _downloader.downloadSVGString)(_this.state.svgString);
      });

      _this.updateSvgControlListeners();

      _lodash2.default.each(_this.props.controller.svgSettingControls, function (svgSettingControl) {
        svgSettingControl.onFinishChange(function () {
          _this.updateSvgRender();
        });
      });
    };

    _this.canvasRef = null;
    _this.imageURI = null;
    _this.renderedImage = null;

    _this.handleImageChange = function () {
      if (!_this.state.loadingImage && _this.hiddenImageChooser.files && _this.hiddenImageChooser.files[0]) {
        _this.setState({
          imageLoadingError: false,
          loadingImage: true
        });

        var reader = new FileReader();

        reader.onloadend = function () {
          _this.imageURI = reader.result;

          _this.setState({
            loadingImage: false,
            imageLoaded: true
          });

          (0, _setImmediate3.default)(function () {
            return _this.renderFirstTimeImage();
          });
        };

        reader.onerror = function () {
          _this.setState({
            loadingImage: false,
            imageLoadingError: true
          });
        };

        (0, _setImmediate3.default)(function () {
          reader.readAsDataURL(_this.hiddenImageChooser.files[0]);
        });
      }
    };

    _this.imageURI = _this.props.imageURI;
    return _this;
  }

  (0, _createClass3.default)(ImageRenderer, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      this.props.controller['Import New Image'].onChange(function () {
        _this2.hiddenImageChooser.focus();
        _this2.hiddenImageChooser.click();
      });

      this.listenToSvgControls();

      // Listen for changes on all of the image changing controls.
      _lodash2.default.each(this.props.controller.imageChangingControls, function (imageChangingControl) {
        imageChangingControl.onFinishChange(function () {
          _this2.updateCanvasRender();
        });
      });

      this.props.controller['Live Update'].onFinishChange(function () {
        if (_this2.props.controller.settings['Live Update']) {
          // TODO: We can make this smarter and not force an update on both if both didn't change.
          _this2.updateCanvasRender();
        }
      });

      this.renderFirstTimeImage();
    }

    // These are controls which change on each change of a control.
    // Because they change often, we have to re-apply listeners on each change.

  }, {
    key: 'renderFirstTimeImage',
    value: function renderFirstTimeImage() {
      var _this3 = this;

      // TODO: Offload hard things to web workers.
      if (this.imageURI) {
        this.setState({
          isRendering: true,
          isRendered: false
        });

        var htmlRenderedImage = new Image();

        htmlRenderedImage.onload = function () {
          _this3.canvasRef.width = htmlRenderedImage.width;
          _this3.canvasRef.height = htmlRenderedImage.height;

          _this3.height = htmlRenderedImage.height;
          _this3.width = htmlRenderedImage.width;

          var ctx = _this3.canvasRef.getContext('2d');
          _this3.renderedImage = htmlRenderedImage;
          ctx.drawImage(htmlRenderedImage, 0, 0, _this3.width, _this3.height);
          _this3.imageData = ctx.getImageData(0, 0, _this3.width, _this3.height);

          (0, _imageManipulator.manipulateImageData)(_this3.imageData, _this3.props.controller.settings, _this3.width, _this3.height);

          ctx.putImageData(_this3.imageData, 0, 0);

          // Check if no updates here.
          _this3.setState({
            isRendered: true,
            isRendering: false,
            loadingImage: false
          });

          _this3.updateSvgRender();
        };

        htmlRenderedImage.src = this.imageURI;
      }
    }
  }, {
    key: 'updateSvgRender',
    value: function updateSvgRender() {
      var _this4 = this;

      if (this.state.isRendered && this.imageData && this.props.controller.settings['Live Update']) {
        (0, _svgRenderer.renderSvgString)(this.imageData.data, this.props.controller.settings, this.width, this.height, function (svgString) {
          // TODO: Version/cancel this.
          _this4.setState({
            svgString: svgString
          });
        });
      }
    }
  }, {
    key: 'updateCanvasRender',
    value: function updateCanvasRender() {
      // TODO: Offload hard things to web workers.
      // TODO: Version of render management.
      if (this.renderedImage && !this.state.isRendering && this.props.controller.settings['Live Update']) {
        this.setState({
          isRendering: true,
          isRendered: false
        });

        var ctx = this.canvasRef.getContext('2d');
        ctx.drawImage(this.renderedImage, 0, 0, this.width, this.height);
        this.imageData = ctx.getImageData(0, 0, this.width, this.height);

        (0, _imageManipulator.manipulateImageData)(this.imageData, this.props.controller.settings, this.width, this.height);

        ctx.putImageData(this.imageData, 0, 0);

        // Check if no updates here.
        this.setState({
          isRendered: true,
          isRendering: false
        });

        this.updateSvgRender();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this5 = this;

      var _state = this.state,
          isRendered = _state.isRendered,
          isRendering = _state.isRendering,
          loadingImage = _state.loadingImage,
          svgString = _state.svgString;


      return _react2.default.createElement(
        'div',
        { className: 'svgee-image-renderer' },
        _react2.default.createElement('input', {
          accept: 'image/*',
          onChange: function onChange() {
            return _this5.handleImageChange();
          },
          ref: function ref(_ref) {
            _this5.hiddenImageChooser = _ref;
          },
          type: 'file'
        }),
        loadingImage && _react2.default.createElement(
          'p',
          null,
          'Loading Image...'
        ),
        isRendering && _react2.default.createElement(
          'p',
          null,
          'Building Image...'
        ),
        _react2.default.createElement(
          'div',
          { className: 'grid no-gutters' },
          _react2.default.createElement(
            'div',
            { className: 'unit half' },
            _react2.default.createElement(
              'div',
              { className: 'svgee-home-item' },
              _react2.default.createElement('canvas', {
                style: {
                  visibility: isRendered && !isRendering ? 'visible' : 'hidden'
                },
                ref: function ref(_ref2) {
                  _this5.canvasRef = _ref2;
                }
              })
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'unit half' },
            _react2.default.createElement(
              'div',
              { className: 'svgee-home-item' },
              _react2.default.createElement('div', { dangerouslySetInnerHTML: { __html: svgString } })
            )
          )
        )
      );
    }
  }]);
  return ImageRenderer;
}(_react.Component);

exports.default = ImageRenderer;
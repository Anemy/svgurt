'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ControlBar;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactSelect = require('react-select');

var _reactSelect2 = _interopRequireDefault(_reactSelect);

require('react-select/dist/react-select.css');

require('./ControlBar.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ControlBar(props) {
  var onConfigChange = props.onConfigChange,
      onImportNewImageClicked = props.onImportNewImageClicked,
      onDownloadSVGClicked = props.onDownloadSVGClicked,
      currentConfigName = props.currentConfigName,
      configNames = props.configNames;


  var selectOptions = _lodash2.default.map(configNames, function (name) {
    return { value: name, label: name, className: 'svgee-control-bar-config-item' };
  });

  return _react2.default.createElement(
    'div',
    { className: 'svgee-image-renderer' },
    _react2.default.createElement(
      'div',
      { className: 'svgee-top-control-bar' },
      _react2.default.createElement(
        'div',
        { className: 'svgee-control-bar-left' },
        _react2.default.createElement(
          'div',
          { className: 'svgee-control-bar-config-selector-container' },
          _react2.default.createElement(_reactSelect2.default, {
            className: 'svgee-control-bar-config-selector',
            clearable: false,
            name: 'form-field-name',
            value: currentConfigName,
            onChange: function onChange(newConfig) {
              return onConfigChange(newConfig.value);
            },
            options: selectOptions
          })
        ),
        _react2.default.createElement(
          'div',
          {
            className: 'svgee-control-bar-button',
            onClick: onImportNewImageClicked
          },
          'New'
        ),
        _react2.default.createElement(
          'div',
          {
            className: 'svgee-control-bar-button',
            onClick: onImportNewImageClicked
          },
          'Save'
        ),
        _react2.default.createElement(
          'div',
          {
            className: 'svgee-control-bar-button',
            onClick: onImportNewImageClicked
          },
          'Revert'
        ),
        _react2.default.createElement(
          'div',
          {
            className: 'svgee-control-bar-button',
            onClick: onImportNewImageClicked
          },
          'Load'
        )
      ),
      _react2.default.createElement(
        'div',
        { className: 'svgee-control-bar-right' },
        _react2.default.createElement(
          'div',
          {
            className: 'svgee-control-bar-button',
            onClick: onImportNewImageClicked
          },
          'Import New Image'
        ),
        _react2.default.createElement(
          'div',
          {
            className: 'svgee-control-bar-button',
            onClick: onDownloadSVGClicked
          },
          'Download SVG'
        )
      )
    )
  );
}
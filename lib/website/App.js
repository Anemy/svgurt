"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = require("react-router-dom");

var _CLIPage = require("./cli/CLIPage");

var _CLIPage2 = _interopRequireDefault(_CLIPage);

var _Demo = require("./demo/Demo");

var _Demo2 = _interopRequireDefault(_Demo);

var _Home = require("./home/Home");

var _Home2 = _interopRequireDefault(_Home);

require("./App.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var App = function App() {
  return _react2.default.createElement(
    "main",
    null,
    _react2.default.createElement(
      _reactRouterDom.HashRouter,
      null,
      _react2.default.createElement(
        _react2.default.Fragment,
        null,
        _react2.default.createElement(_reactRouterDom.Route, { path: "/cli", component: _CLIPage2.default }),
        _react2.default.createElement(_reactRouterDom.Route, { path: "/demo", component: _Demo2.default }),
        _react2.default.createElement(_reactRouterDom.Route, { exact: true, path: "/", component: _Home2.default })
      )
    )
  );
};

exports.default = App;
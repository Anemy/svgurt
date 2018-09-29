'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Bitmap = exports.getPaths = exports.getSVG = exports.traceUrl = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var traceUrl = exports.traceUrl = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(url, options) {
    var image;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _utils.loadImage)(url, options);

          case 2:
            image = _context.sent;
            return _context.abrupt('return', traceImage(image, options));

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function traceUrl(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.traceImage = traceImage;
exports.traceCanvas = traceCanvas;
exports.traceBitmap = traceBitmap;

var _utils = require('./utils.js');

var _bitmapToPathList = require('./bitmapToPathList.js');

var _bitmapToPathList2 = _interopRequireDefault(_bitmapToPathList);

var _processPath = require('./processPath.js');

var _processPath2 = _interopRequireDefault(_processPath);

var _getSVG = require('./getSVG.js');

var _getSVG2 = _interopRequireDefault(_getSVG);

var _getPaths = require('./getPaths.js');

var _getPaths2 = _interopRequireDefault(_getPaths);

var _Bitmap = require('./Bitmap.js');

var _Bitmap2 = _interopRequireDefault(_Bitmap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OPTIONS = {
  turnpolicy: 'right',
  turdsize: 2,
  optcurve: true,
  alphamax: 1,
  opttolerance: 0.2
};

function traceImage(image, options) {
  var canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;

  var context = canvas.getContext('2d');
  context.drawImage(image, 0, 0);

  return traceCanvas(canvas, options);
}

function traceCanvas(canvas, options) {
  var bitmap = (0, _utils.createBitmap)(canvas);

  return traceBitmap(bitmap, options);
}

function traceBitmap(bitmap) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : OPTIONS;

  var pathList = (0, _bitmapToPathList2.default)(bitmap, options);
  (0, _processPath2.default)(pathList, options);

  return pathList;
}

exports.getSVG = _getSVG2.default;
exports.getPaths = _getPaths2.default;
exports.Bitmap = _Bitmap2.default;
exports.default = {
  Bitmap: _Bitmap2.default,
  getSVG: _getSVG2.default,
  getPaths: _getPaths2.default,
  traceCanvas: traceCanvas,
  traceImage: traceImage,
  traceUrl: traceUrl
};
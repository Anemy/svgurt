'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = bitmapToPathList;

var _Path = require('./Path.js');

var _Path2 = _interopRequireDefault(_Path);

var _Point = require('./Point.js');

var _Point2 = _interopRequireDefault(_Point);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function bitmapToPathList(bitmap, options) {
  var bitmapTarget = bitmap.copy();
  var pathList = [];

  for (var point = findNext(new _Point2.default(0, 0), bitmapTarget); point; point = findNext(point, bitmapTarget)) {
    var path = findPath(point, bitmap, bitmapTarget, options);
    if (path.area > options.turdsize) pathList.push(path);

    bitmapTarget.xOrPath(path);
  }

  return pathList;
}

function findNext(point, bitmapTarget) {
  for (var i = point.toIndex(bitmapTarget.width, bitmapTarget.height); i < bitmapTarget.size; i++) {
    if (bitmapTarget.data[i]) return bitmapTarget.index(i);
  }
  return false;
}

function findPath(point, bitmap, bitmapTarget, options) {
  var x = point.x,
      y = point.y;

  var dirX = 0;
  var dirY = 1;

  var points = [];
  var area = 0;
  var isHole = !bitmap.at(x, y);

  while (true) {
    points.push(new _Point2.default(x, y));

    x += dirX;
    y += dirY;
    area -= x * dirY;

    if (x === point.x && y === point.y) break;

    var left = bitmapTarget.at(x + (dirX + dirY - 1) / 2, y + (dirY - dirX - 1) / 2);
    var right = bitmapTarget.at(x + (dirX - dirY - 1) / 2, y + (dirY + dirX - 1) / 2);

    if (right && !left) {
      if (turn(options.turnpolicy, isHole, bitmapTarget, x, y)) {
        var tmp = dirX;
        dirX = -dirY;
        dirY = tmp;
      } else {
        var _tmp = dirX;
        dirX = dirY;
        dirY = -_tmp;
      }
    } else if (right) {
      var _tmp2 = dirX;
      dirX = -dirY;
      dirY = _tmp2;
    } else if (!left) {
      var _tmp3 = dirX;
      dirX = dirY;
      dirY = -_tmp3;
    }
  }

  return new _Path2.default(points, area, isHole);
}

function turn(turnpolicy, isHole, bitmap, x, y) {
  switch (turnpolicy) {
    case 'right':
      return true;

    case 'black':
      return !isHole;

    case 'white':
      return isHole;

    case 'majority':
      return majority(x, y, bitmap);

    case 'minority':
      return !majority(x, y, bitmap);

    default:
      return true;
  }
}

function majority(x, y, bitmap) {
  for (var i = 2; i < 5; i++) {
    var ct = 0;
    for (var a = -i + 1; a <= i - 1; a++) {
      ct += bitmap.at(x + a, y + i - 1) ? 1 : -1;
      ct += bitmap.at(x + i - 1, y + a - 1) ? 1 : -1;
      ct += bitmap.at(x + a - 1, y - i) ? 1 : -1;
      ct += bitmap.at(x - i, y + a) ? 1 : -1;
    }

    if (ct > 0) {
      return true;
    } else if (ct < 0) {
      return false;
    }
  }
  return false;
}
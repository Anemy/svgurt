'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSpiralPath = getSpiralPath;
function lineIntersection(m1, b1, m2, b2) {
  if (m1 === m2) {
    throw new Error('parallel slopes');
  }
  var x = (b2 - b1) / (m1 - m2);
  return {
    x: x,
    y: m1 * x + b1
  };
}

function pStr(point) {
  return point.x + ',' + point.y + ' ';
}

function getSpiralPath(center, startRadius, spacePerLoop, startTheta, endTheta, thetaStep) {
  // Rename spiral parameters for the formula r = a + bθ
  var a = startRadius; // start distance from center
  var b = spacePerLoop / Math.PI / 2; // space between each loop

  // convert angles to radians
  var oldTheta = startTheta * Math.PI / 180;
  var newTheta = oldTheta;
  endTheta = endTheta * Math.PI / 180;
  thetaStep = thetaStep * Math.PI / 180;

  // radii
  var oldR = void 0,
      newR = a + b * newTheta;

  // start and end points
  var oldPoint = { x: 0, y: 0 };
  var newPoint = {
    x: center.x + newR * Math.cos(newTheta),
    y: center.y + newR * Math.sin(newTheta)
  };

  // slopes of tangents
  var oldSlope = void 0;
  var newSlope = (b * Math.sin(oldTheta) + (a + b * newTheta) * Math.cos(oldTheta)) / (b * Math.cos(oldTheta) - (a + b * newTheta) * Math.sin(oldTheta));

  var path = 'M ' + pStr(newPoint);

  while (oldTheta < endTheta - thetaStep) {
    oldTheta = newTheta;
    newTheta += thetaStep;

    oldR = newR;
    newR = a + b * newTheta;

    oldPoint.x = newPoint.x;
    oldPoint.y = newPoint.y;
    newPoint.x = center.x + newR * Math.cos(newTheta);
    newPoint.y = center.y + newR * Math.sin(newTheta);

    // Slope calculation with the formula:
    // (b * sinΘ + (a + bΘ) * cosΘ) / (b * cosΘ - (a + bΘ) * sinΘ)
    var aPlusBTheta = a + b * newTheta;

    oldSlope = newSlope;
    newSlope = (b * Math.sin(newTheta) + aPlusBTheta * Math.cos(newTheta)) / (b * Math.cos(newTheta) - aPlusBTheta * Math.sin(newTheta));

    var oldIntercept = -(oldSlope * oldR * Math.cos(oldTheta) - oldR * Math.sin(oldTheta));
    var newIntercept = -(newSlope * newR * Math.cos(newTheta) - newR * Math.sin(newTheta));

    var controlPoint = lineIntersection(oldSlope, oldIntercept, newSlope, newIntercept);

    // Offset the control point by the center offset.
    controlPoint.x += center.x;
    controlPoint.y += center.y;

    path += 'Q ' + pStr(controlPoint) + pStr(newPoint);
  }

  return path;
}

// const path = getPath({x:400,y:400}, 0, 50, 0, 6*360, 30);
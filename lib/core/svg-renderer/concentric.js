'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createConcentricPaths = createConcentricPaths;
exports.renderConcentricPaths = renderConcentricPaths;

var _color = require('./color');

function createConcentricPath(settings, radius, imageData, centerX, centerY) {
  var circleArcs = settings.circleArcs,
      intensityWeight = settings.intensityWeight;


  var arcAngle = 2 * Math.PI / circleArcs; // hardcoded to 1 degree for now

  var pathArcs = [];
  for (var i = 1; i <= circleArcs; i++) {
    var xNew = centerX + radius * Math.sin(arcAngle * i);
    var yNew = centerY - radius * Math.cos(arcAngle * i);

    var xArcCenter = centerX + radius * Math.sin(arcAngle * i - arcAngle / 2);
    var yArcCenter = centerY - radius * Math.cos(arcAngle * i - arcAngle / 2);

    var pixelColor = (0, _color.getPixelColorAtXY)(imageData, xArcCenter, yArcCenter, centerX * 2);
    var eclipseHeight = radius;
    if ((0, _color.isInColorThreshhold)(pixelColor, settings)) {
      eclipseHeight = (0, _color.getPixelColorIntensity)(pixelColor, settings) * intensityWeight + radius;
    }

    var pathArc = {
      rx: radius,
      ry: eclipseHeight,
      xRot: (i * arcAngle - arcAngle / 2) * 360 / (2 * Math.PI),
      x: xNew,
      y: yNew
    };
    pathArcs.push(pathArc);
  }

  return pathArcs;
}

function createConcentricPaths(settings, imageData, width, height) {
  var radiusStep = settings.radiusStep;

  var maxRadius = Math.max(width, height) / 2;
  var concentricPaths = [];

  for (var r = radiusStep; r <= maxRadius; r += radiusStep) {
    var pathInfo = {
      radius: r,
      arcs: createConcentricPath(settings, r, imageData, width / 2, height / 2)
    };
    concentricPaths.push(pathInfo);
  }

  return concentricPaths;
}

function renderConcentricPaths(svgSettings, concentricPaths, centerX, centerY) {
  var outputScale = svgSettings.outputScale,
      strokeColor = svgSettings.strokeColor,
      strokeWidth = svgSettings.strokeWidth;


  var renderString = '';
  for (var i = 0; i < concentricPaths.length; i++) {
    var conPath = concentricPaths[i];
    renderString += '<path d="M ' + centerX * outputScale + ' ' + centerY * outputScale + ' m 0 ' + -conPath.radius * outputScale;
    for (var j = 0; j < conPath.arcs.length; j++) {
      var _conPath$arcs$j = conPath.arcs[j],
          rx = _conPath$arcs$j.rx,
          ry = _conPath$arcs$j.ry,
          xRot = _conPath$arcs$j.xRot,
          x = _conPath$arcs$j.x,
          y = _conPath$arcs$j.y;

      renderString += ' A ' + rx * outputScale + ' ' + ry * outputScale + ' ' + xRot + ' 0 1 ' + x * outputScale + ' ' + y * outputScale;
    }
    renderString += '" stroke="' + strokeColor + '" stroke-width="' + strokeWidth + '" style="fill: none;" />';
  }

  return renderString;
}
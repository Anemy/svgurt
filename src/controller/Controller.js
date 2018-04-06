import _ from 'lodash';
import dat from 'dat.gui';

import { createRandomSeed, MAX_SEED } from '../utils/random';

export const SVG_RENDER_TYPES = {
  CIRCLE: 'CIRCLE',
  CURVE: 'CURVE',
  LINE: 'LINE',
  RECURSIVE_LINE: 'RECURSIVE_LINE',
  SPIRAL: 'SPIRAL'
  // RECTANGLE: 'RECTANGLE'
};

export const RECURSIVE_LINE_ALGORITHMS = {
  DRAGON_CURVE: 'DRAGON_CURVE',
  PEANO_CURVE: 'PEANO_CURVE'
};

class ControllerControls {
  // Image Controls
  blur = 0;
  grayscale = false;
  invert = false;
  cannyEdgeDetection = false;
  lowThreshold = 20;
  highThreshold = 50;
  applyFractalField = false;
  fieldOpacity = 0.5;
  fieldRatioX = 0.01;
  fieldRatioY = 0.01;
  fieldRandomSeed = createRandomSeed();
  importNewImage() {}

  // SVG Controls
  amplitude = 5;
  amplitudeRandomness = 0.5;
  direction = 45;
  directionRandomness = 0.01;
  minColorRecognized = 200;
  maxColorRecognized = 255;
  length = 5;
  lengthRandomness = 0.5;
  liveUpdate = true;
  randomSeed = createRandomSeed();
  radius = 1.5;
  radiusRandomness = 0.75;
  resurseBehindNonMatching = false;
  recursiveAlgorithm = RECURSIVE_LINE_ALGORITHMS.PEANO_CURVE;
  renderEveryXPixels = 5;
  renderEveryYPixels = 5;
  startAtCenterOfShapes = false;
  strokeWidth = 1;
  strokeWidthRandomness = 0.5;
  svgRenderType = SVG_RENDER_TYPES.CIRCLE;
  wavelength = 3;
  wavelengthRandomness = 0.5;
  waves = 3;
  wavesRandomness = 0.5;
  applyFractalDisplacement = false;
  displacementAmount = 5;
  fractalRatioX = 0.01;
  fractalRatioY = 0.01;
  fractalRandomSeed = createRandomSeed();
  chooseSVGRenderType() {}
  downloadSVG() {}

  // General Controls
  liveUpdate = true;
}

export function updateRenderType(controller) {
  const newRenderType = controller.settings.svgRenderType;

  _.each(controller.svgChangingControls, svgRenderSettingController => {
    controller.svgFolder.remove(svgRenderSettingController);
  });
  controller.svgChangingControls = {};

  const mainController = controller.settings;

  switch (newRenderType) {
    case SVG_RENDER_TYPES.CIRCLE: {
      controller.svgChangingControls['strokeWidth'] = controller.svgFolder.add(mainController, 'strokeWidth', 0, 20);
      controller.svgChangingControls['strokeWidthRandomness'] = controller.svgFolder.add(mainController, 'strokeWidthRandomness', 0, 1);
      controller.svgChangingControls['renderEveryXPixels'] = controller.svgFolder.add(mainController, 'renderEveryXPixels', 0, 50).step(1);
      controller.svgChangingControls['renderEveryYPixels'] = controller.svgFolder.add(mainController, 'renderEveryYPixels', 0, 50).step(1);
      controller.svgChangingControls['radius'] = controller.svgFolder.add(mainController, 'radius', 0, 50);
      controller.svgChangingControls['radiusRandomness'] = controller.svgFolder.add(mainController, 'radiusRandomness', 0, 1);
      break;
    }
    case SVG_RENDER_TYPES.CURVE: {
      controller.svgChangingControls['strokeWidth'] = controller.svgFolder.add(mainController, 'strokeWidth', 0, 20);
      controller.svgChangingControls['strokeWidthRandomness'] = controller.svgFolder.add(mainController, 'strokeWidthRandomness', 0, 1);
      controller.svgChangingControls['renderEveryXPixels'] = controller.svgFolder.add(mainController, 'renderEveryXPixels', 0, 50).step(1);
      controller.svgChangingControls['renderEveryYPixels'] = controller.svgFolder.add(mainController, 'renderEveryYPixels', 0, 50).step(1);
      controller.svgChangingControls['waves'] = controller.svgFolder.add(mainController, 'waves', 0, 50);
      controller.svgChangingControls['wavesRandomness'] = controller.svgFolder.add(mainController, 'wavesRandomness', 0, 1);
      controller.svgChangingControls['direction'] = controller.svgFolder.add(mainController, 'direction', 0, 360);
      controller.svgChangingControls['directionRandomness'] = controller.svgFolder.add(mainController, 'directionRandomness', 0, 1);
      controller.svgChangingControls['amplitude'] = controller.svgFolder.add(mainController, 'amplitude', 0, 50);
      controller.svgChangingControls['amplitudeRandomness'] = controller.svgFolder.add(mainController, 'amplitudeRandomness', 0, 1);
      controller.svgChangingControls['wavelength'] = controller.svgFolder.add(mainController, 'wavelength', 0, 50);
      controller.svgChangingControls['wavelengthRandomness'] = controller.svgFolder.add(mainController, 'wavelengthRandomness', 0, 1);
      break;
    }
    case SVG_RENDER_TYPES.LINE: {
      controller.svgChangingControls['strokeWidth'] = controller.svgFolder.add(mainController, 'strokeWidth', 0, 20);
      controller.svgChangingControls['strokeWidthRandomness'] = controller.svgFolder.add(mainController, 'strokeWidthRandomness', 0, 1);
      controller.svgChangingControls['renderEveryXPixels'] = controller.svgFolder.add(mainController, 'renderEveryXPixels', 0, 50).step(1);
      controller.svgChangingControls['renderEveryYPixels'] = controller.svgFolder.add(mainController, 'renderEveryYPixels', 0, 50).step(1);
      controller.svgChangingControls['length'] = controller.svgFolder.add(mainController, 'length', 0, 50);
      controller.svgChangingControls['lengthRandomness'] = controller.svgFolder.add(mainController, 'lengthRandomness', 0, 1);
      controller.svgChangingControls['direction'] = controller.svgFolder.add(mainController, 'direction', 0, 360);
      controller.svgChangingControls['directionRandomness'] = controller.svgFolder.add(mainController, 'directionRandomness', 0, 1);
      break;
    }
    case SVG_RENDER_TYPES.RECTANGLE: {
      controller.svgChangingControls['strokeWidth'] = controller.svgFolder.add(mainController, 'strokeWidth', 0, 160);
      break;
    }
  }
}

const datConfig = {
  // load: JSON, // When we have some states.
  useLocalStorage: true
};

export function createController() {
  const gui = new dat.GUI(datConfig);

  const controller = {
    imageChangingControls: {},
    svgChangingControls: {},
    svgSettingControls: {}
  };

  const mainController = new ControllerControls();
  const imageFolder = gui.addFolder('Image Controls');

  controller.importNewImage = imageFolder.add(mainController, 'importNewImage');

  controller.imageChangingControls['grayscale'] = imageFolder.add(mainController, 'grayscale');
  controller.imageChangingControls['blur'] = imageFolder.add(mainController, 'blur', 0, 30).step(1);
  controller.imageChangingControls['invert'] = imageFolder.add(mainController, 'invert');
  const cannyFolder = imageFolder.addFolder('Canny Edge Detection');
  controller.imageChangingControls['cannyEdgeDetection'] = cannyFolder.add(mainController, 'cannyEdgeDetection');
  controller.imageChangingControls['lowThreshold'] = cannyFolder.add(mainController, 'lowThreshold', 0, 128).step(1);
  controller.imageChangingControls['highThreshold'] = cannyFolder.add(mainController, 'highThreshold', 0, 128).step(1);
  const fieldFolder = imageFolder.addFolder('Fractal Field Opacity');
  controller.imageChangingControls['applyFractalField'] = fieldFolder.add(mainController, 'applyFractalField');
  controller.imageChangingControls['fieldOpacity'] = fieldFolder.add(mainController, 'fieldOpacity', 0, 1);
  controller.imageChangingControls['fieldRatioX'] = fieldFolder.add(mainController, 'fieldRatioX', 0, 1);
  controller.imageChangingControls['fieldRatioY'] = fieldFolder.add(mainController, 'fieldRatioY', 0, 1);
  controller.imageChangingControls['fieldRandomSeed'] = fieldFolder.add(mainController, 'fieldRandomSeed', 0, MAX_SEED).step(1);

  const svgFolder = gui.addFolder('SVG Controls');
  controller.svgSettingControls['minColorRecognized'] = svgFolder.add(mainController, 'minColorRecognized', 0, 255).step(1);
  controller.svgSettingControls['maxColorRecognized'] = svgFolder.add(mainController, 'maxColorRecognized', 0, 255).step(1);
  controller.svgRenderTypeController = svgFolder.add(mainController, 'svgRenderType', _.keys(SVG_RENDER_TYPES));
  controller.svgFolder = svgFolder;
  const fractalFolder = svgFolder.addFolder('Displacement Fractal Field');
  controller.svgSettingControls['applyFractalDisplacement'] = fractalFolder.add(mainController, 'applyFractalDisplacement');
  controller.svgSettingControls['displacementAmount'] = fractalFolder.add(mainController, 'displacementAmount', 0, 200);
  controller.svgSettingControls['fractalRatioX'] = fractalFolder.add(mainController, 'fractalRatioX', 0, 1);
  controller.svgSettingControls['fractalRatioY'] = fractalFolder.add(mainController, 'fractalRatioY', 0, 1);
  controller.svgSettingControls['fractalRandomSeed'] = fractalFolder.add(mainController, 'fractalRandomSeed', 0, MAX_SEED).step(1);

  controller.downloadSvgButton = gui.add(mainController, 'downloadSVG');

  controller.liveUpdate = gui.add(mainController, 'liveUpdate');

  controller.gui = gui;
  controller.settings = mainController;

  // gui.remember(mainController);

  updateRenderType(controller);

  return controller;
}
import _ from 'lodash';
import dat from 'dat.gui';

import { createRandomSeed, MAX_SEED } from '../utils/random';

export const SVG_RENDER_TYPES = {
  CIRCLE: 'CIRCLE',
  CURVE: 'CURVE',
  LINE: 'LINE'
  // RECURSIVE_LINE: 'RECURSIVE_LINE-COMING_SOON',
  // SPIRAL: 'SPIRAL-COMING_SOON'
  // RECTANGLE: 'RECTANGLE'
};

export const RECURSIVE_LINE_ALGORITHMS = {
  DRAGON_CURVE: 'DRAGON_CURVE',
  PEANO_CURVE: 'PEANO_CURVE'
};

function openLinkInNewTab(url) {
  Object.assign(document.createElement('a'), {
    target: '_blank',
    href: url,
    rel: 'noopener noreferrer'
  }).click();
}

class ControllerControls {
  comingSoon() {}

  // Image Controls
  blur = 0;
  grayscale = true;
  invert = true;
  cannyEdgeDetection = false;
  postBlur = 0;
  posterize = false;
  posterizeLevels = 5;
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
  amountOfLines = 150;
  continuous = false;
  crossHatch = true;
  direction = 30;
  directionRandomness = 0.01;
  displaceOrigin = false;
  length = 6;
  lengthOnColor = true;
  lengthRandomness = 0.2;
  liveUpdate = true;
  minColorRecognized = 50;
  maxColorRecognized = 255;
  minLineLength = 1;
  randomSeed = createRandomSeed();
  radius = 1.5;
  radiusOnColor = false;
  radiusRandomness = 0.25;
  resurseBehindNonMatching = false;
  recursiveAlgorithm = RECURSIVE_LINE_ALGORITHMS.PEANO_CURVE;
  renderEveryXPixels = 3;
  renderEveryYPixels = 3;
  startAtCenterOfShapes = false;
  strokeColor = 'rgb(28, 32, 38)';
  strokeWidth = 1;
  strokeWidthRandomness = 0.1;
  svgRenderType = SVG_RENDER_TYPES.LINE;
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

  // About
  codeLink() {
    openLinkInNewTab('https://github.com/Anemy/svgurt');
  }
  creatorLink() {
    openLinkInNewTab('http://rhyshowell.com');
  }
}

export function updateRenderType(controller) {
  const newRenderType = controller.settings.svgRenderType;
  const svgFolder = controller.svgFolder;

  _.each(controller.svgChangingControls, svgRenderSettingController => {
    svgFolder.remove(svgRenderSettingController);
  });
  controller.svgChangingControls = {};
  _.each(controller.svgRenderChangingControls, svgRenderChangingController => {
    svgFolder.remove(svgRenderChangingController);
  });
  controller.svgRenderChangingControls = {};

  const mainController = controller.settings;

  controller.svgRenderChangingControls.svgRenderType = svgFolder.add(mainController, 'svgRenderType', _.keys(SVG_RENDER_TYPES));

  // eslint-disable-next-line default-case
  switch (newRenderType) {
    case SVG_RENDER_TYPES.CIRCLE: {
      controller.svgChangingControls['strokeWidth'] = svgFolder.add(mainController, 'strokeWidth', 0, 20);
      controller.svgChangingControls['strokeWidthRandomness'] = svgFolder.add(mainController, 'strokeWidthRandomness', 0, 1);
      controller.svgChangingControls['renderEveryXPixels'] = svgFolder.add(mainController, 'renderEveryXPixels', 1, 50).step(1);
      controller.svgChangingControls['renderEveryYPixels'] = svgFolder.add(mainController, 'renderEveryYPixels', 1, 50).step(1);
      // controller.svgChangingControls['continuous'] = svgFolder.add(mainController, 'continuous');
      controller.svgChangingControls['radius'] = svgFolder.add(mainController, 'radius', 0, 50);
      controller.svgChangingControls['radiusOnColor'] = svgFolder.add(mainController, 'radiusOnColor');
      controller.svgChangingControls['radiusRandomness'] = svgFolder.add(mainController, 'radiusRandomness', 0, 1);
      break;
    }
    case SVG_RENDER_TYPES.CURVE: {
      controller.svgChangingControls['strokeWidth'] = svgFolder.add(mainController, 'strokeWidth', 0, 20);
      controller.svgChangingControls['strokeWidthRandomness'] = svgFolder.add(mainController, 'strokeWidthRandomness', 0, 1);
      controller.svgChangingControls['renderEveryXPixels'] = svgFolder.add(mainController, 'renderEveryXPixels', 1, 50).step(1);
      controller.svgChangingControls['renderEveryYPixels'] = svgFolder.add(mainController, 'renderEveryYPixels', 1, 50).step(1);
      controller.svgChangingControls['waves'] = svgFolder.add(mainController, 'waves', 0, 50);
      controller.svgChangingControls['wavesRandomness'] = svgFolder.add(mainController, 'wavesRandomness', 0, 1);
      controller.svgChangingControls['direction'] = svgFolder.add(mainController, 'direction', 0, 180);
      controller.svgChangingControls['directionRandomness'] = svgFolder.add(mainController, 'directionRandomness', 0, 1);
      controller.svgChangingControls['amplitude'] = svgFolder.add(mainController, 'amplitude', 0, 50);
      controller.svgChangingControls['amplitudeRandomness'] = svgFolder.add(mainController, 'amplitudeRandomness', 0, 1);
      // controller.svgRenderChangingControls['continuous'] = svgFolder.add(mainController, 'continuous');
      // if (!mainController.continuous) {
        controller.svgChangingControls['wavelength'] = svgFolder.add(mainController, 'wavelength', 0, 50);
        controller.svgChangingControls['wavelengthRandomness'] = svgFolder.add(mainController, 'wavelengthRandomness', 0, 1);
      // }
      break;
    }
    case SVG_RENDER_TYPES.LINE: {
      controller.svgChangingControls['strokeWidth'] = svgFolder.add(mainController, 'strokeWidth', 0, 20);
      controller.svgChangingControls['strokeWidthRandomness'] = svgFolder.add(mainController, 'strokeWidthRandomness', 0, 1);
      controller.svgRenderChangingControls['continuous'] = svgFolder.add(mainController, 'continuous');
      if (!mainController.continuous) {
        controller.svgChangingControls['renderEveryXPixels'] = svgFolder.add(mainController, 'renderEveryXPixels', 1, 50).step(1);
        controller.svgChangingControls['renderEveryYPixels'] = svgFolder.add(mainController, 'renderEveryYPixels', 1, 50).step(1);
        controller.svgChangingControls['length'] = svgFolder.add(mainController, 'length', 0, 50);
        controller.svgChangingControls['lengthOnColor'] = svgFolder.add(mainController, 'lengthOnColor');
        controller.svgChangingControls['lengthRandomness'] = svgFolder.add(mainController, 'lengthRandomness', 0, 1);
      } else {
        controller.svgChangingControls['minLineLength'] = svgFolder.add(mainController, 'minLineLength', 1, 50).step(1);
        controller.svgChangingControls['crossHatch'] = svgFolder.add(mainController, 'crossHatch');
        controller.svgChangingControls['amountOfLines'] = svgFolder.add(mainController, 'amountOfLines', 1, 5000).step(1);
      }
      controller.svgChangingControls['direction'] = svgFolder.add(mainController, 'direction', 0, 180);
      controller.svgChangingControls['directionRandomness'] = svgFolder.add(mainController, 'directionRandomness', 0, 1);
      break;
    }
    case SVG_RENDER_TYPES.RECURSIVE_LINE: {
      controller.svgChangingControls['comingSoon'] = svgFolder.add(mainController, 'comingSoon');
      break;
    }
    case SVG_RENDER_TYPES.SPIRAL: {
      controller.svgChangingControls['comingSoon'] = svgFolder.add(mainController, 'comingSoon');
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
  const posterizeFolder = imageFolder.addFolder('Posterize');
  controller.imageChangingControls['posterize'] = posterizeFolder.add(mainController, 'posterize');
  controller.imageChangingControls['posterizeLevels'] = posterizeFolder.add(mainController, 'posterizeLevels', 1, 30).step(1);
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
  controller.imageChangingControls['postBlur'] = imageFolder.add(mainController, 'postBlur', 0, 30).step(1);

  const svgFolder = gui.addFolder('SVG Controls');
  controller.svgFolder = svgFolder;
  controller.svgSettingControls['minColorRecognized'] = svgFolder.add(mainController, 'minColorRecognized', 0, 255).step(1);
  controller.svgSettingControls['maxColorRecognized'] = svgFolder.add(mainController, 'maxColorRecognized', 0, 255).step(1);
  const fractalFolder = svgFolder.addFolder('Displacement Fractal Field');
  controller.svgSettingControls['applyFractalDisplacement'] = fractalFolder.add(mainController, 'applyFractalDisplacement');
  controller.svgSettingControls['displacementAmount'] = fractalFolder.add(mainController, 'displacementAmount', 0, 200);
  controller.svgSettingControls['displaceOrigin'] = fractalFolder.add(mainController, 'displaceOrigin');
  controller.svgSettingControls['fractalRatioX'] = fractalFolder.add(mainController, 'fractalRatioX', 0, 1);
  controller.svgSettingControls['fractalRatioY'] = fractalFolder.add(mainController, 'fractalRatioY', 0, 1);
  controller.svgSettingControls['fractalRandomSeed'] = fractalFolder.add(mainController, 'fractalRandomSeed', 0, MAX_SEED).step(1);

  controller.downloadSvgButton = gui.add(mainController, 'downloadSVG');

  controller.liveUpdate = gui.add(mainController, 'liveUpdate');

  const aboutFolder = gui.addFolder('About');
  controller.codeLink = aboutFolder.add(mainController, 'codeLink');
  controller.creatorLink = aboutFolder.add(mainController, 'creatorLink');

  controller.gui = gui;
  controller.settings = mainController;

  // gui.remember(mainController);

  updateRenderType(controller);

  return controller;
}
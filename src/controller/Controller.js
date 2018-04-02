import _ from 'lodash';
import dat from 'dat.gui';

import { SVG_RENDER_TYPES } from '../image-renderer/svg-renderer';

class ImageController {
  grayscale = false;
  invert = false;
  blur = 0;
  cannyEdgeDetection = false;
  lowThreshold = 20;
  highThreshold = 50;
  lowLightnessThreshold = 0;
  highLightnessThreshold = 100;
  liveUpdate = true;
  importNewImage() {}
}

class SvgController {
  amplitude = 5;
  direction = 45;
  minColorRecognized = 200;
  maxColorRecognized = 255;
  length = 5;
  liveUpdate = true;
  randomness = 0.5;
  randomSeed = 1;
  renderEveryXPixels = 5;
  renderEveryYPixels = 5;
  strokeWidth = 1;
  svgRenderType = SVG_RENDER_TYPES.CURVE;
  wavelength = 5;
  waves = 3;
  chooseSVGRenderType() {}
  downloadSVG() {}
}

export function updateRenderType(controller) {
  const newRenderType = controller.svgSettings.svgRenderType;

  _.each(controller.svgChangingControls, svgRenderSettingController => {
    controller.svgFolder.remove(svgRenderSettingController);
  });
  controller.svgChangingControls = {};

  const svgController = controller.svgSettings;

  switch (newRenderType) {
    case SVG_RENDER_TYPES.CURVE: {
      controller.svgChangingControls['strokeWidth'] = controller.svgFolder.add(svgController, 'strokeWidth', 0, 20);
      controller.svgChangingControls['renderEveryXPixels'] = controller.svgFolder.add(svgController, 'renderEveryXPixels', 0, 50).step(1);
      controller.svgChangingControls['renderEveryYPixels'] = controller.svgFolder.add(svgController, 'renderEveryYPixels', 0, 50).step(1);
      controller.svgChangingControls['waves'] = controller.svgFolder.add(svgController, 'waves', 0, 50);
      controller.svgChangingControls['direction'] = controller.svgFolder.add(svgController, 'direction', 0, 360);
      controller.svgChangingControls['amplitude'] = controller.svgFolder.add(svgController, 'amplitude', 0, 50);
      controller.svgChangingControls['wavelength'] = controller.svgFolder.add(svgController, 'wavelength', 0, 50);
      controller.svgChangingControls['randomness'] = controller.svgFolder.add(svgController, 'randomness', 0, 1);
      break;
    }
    case SVG_RENDER_TYPES.LINE: {
      controller.svgChangingControls['strokeWidth'] = controller.svgFolder.add(svgController, 'strokeWidth', 0, 20);
      controller.svgChangingControls['renderEveryXPixels'] = controller.svgFolder.add(svgController, 'renderEveryXPixels', 0, 50).step(1);
      controller.svgChangingControls['renderEveryYPixels'] = controller.svgFolder.add(svgController, 'renderEveryYPixels', 0, 50).step(1);
      controller.svgChangingControls['length'] = controller.svgFolder.add(svgController, 'length', 0, 50);
      controller.svgChangingControls['direction'] = controller.svgFolder.add(svgController, 'direction', 0, 360);
      controller.svgChangingControls['randomness'] = controller.svgFolder.add(svgController, 'randomness', 0, 1);
      break;
    }
    case SVG_RENDER_TYPES.RECTANGLE: {
      controller.svgChangingControls['strokeWidth'] = controller.svgFolder.add(svgController, 'strokeWidth', 0, 160);
      break;
    }
  }
}

export function createController() {
  const gui = new dat.GUI();

  const controller = {
    imageChangingControls: {},
    svgChangingControls: {},
    svgSettingControls: {}
  };

  // Add .listen() to the .add().listen to listen to changes.
  // (For when we do randomize).

  const imageController = new ImageController();
  const imageFolder = gui.addFolder('Image Controls');

  controller.importNewImage = imageFolder.add(imageController, 'importNewImage');

  controller.imageChangingControls['grayscale'] = imageFolder.add(imageController, 'grayscale');
  controller.imageChangingControls['blur'] = imageFolder.add(imageController, 'blur', 0, 30).step(1);
  controller.imageChangingControls['invert'] = imageFolder.add(imageController, 'invert');
  const cannyFolder = imageFolder.addFolder('Canny Edge Detection');
  controller.imageChangingControls['cannyEdgeDetection'] = cannyFolder.add(imageController, 'cannyEdgeDetection');
  controller.imageChangingControls['lowThreshold'] = cannyFolder.add(imageController, 'lowThreshold', 0, 128).step(1);
  controller.imageChangingControls['highThreshold'] = cannyFolder.add(imageController, 'highThreshold', 0, 128).step(1);
  controller.imageChangingControls['liveUpdate'] = cannyFolder.add(imageController, 'liveUpdate');

  const svgController = new SvgController();

  const svgFolder = gui.addFolder('SVG Controls');
  controller.downloadSvgButton = svgFolder.add(svgController, 'downloadSVG');
  controller.svgSettingControls['minColorRecognized'] = svgFolder.add(svgController, 'minColorRecognized', 0, 255).step(1);
  controller.svgSettingControls['maxColorRecognized'] = svgFolder.add(svgController, 'maxColorRecognized', 0, 255).step(1);
  controller.svgRenderTypeController = svgFolder.add(svgController, 'svgRenderType', _.keys(SVG_RENDER_TYPES));
  controller.svgFolder = svgFolder;

  controller.gui = gui;
  controller.imageSettings = imageController;
  controller.svgSettings = svgController;

  updateRenderType(controller);

  return controller;

  // TODO:
  // gui.remember();
}
import dat from 'dat.gui';

class ImageController {
  grayscale = false;
  invert = false;
  blur = 0;
  importNewImage() {}
}

class SvgController {
  strokeWidth = 1;
  downloadSVG() {}
}

export function createController() {
  const gui = new dat.GUI();

  const controller = {
    imageChangingControls: {},
    svgChangingControls: {}
  };

  // Add .listen() to the .add().listen to listen to changes.
  // (For when we do randomize).

  const imageController = new ImageController();
  const imageFolder = gui.addFolder('Image Controls');

  controller.imageChangingControls['grayscale'] = imageFolder.add(imageController, 'grayscale');
  controller.imageChangingControls['blur'] = imageFolder.add(imageController, 'blur', 0, 30).step(1);
  controller.imageChangingControls['invert'] = imageFolder.add(imageController, 'invert');
  controller.importNewImage = imageFolder.add(imageController, 'importNewImage');

  const svgController = new SvgController();

  const svgFolder = gui.addFolder('SVG Controls');
  svgFolder.add(svgController, 'strokeWidth', 0, 20);
  svgFolder.add(svgController, 'downloadSVG');

  controller.gui = gui;
  controller.imageSettings = imageController;
  controller.svgSettings = svgController;

  return controller;

  // TODO:
  // gui.remember();
}
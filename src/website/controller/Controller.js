import _ from 'lodash';
import dat from 'dat.gui';

import './Controller.css';

import {
  controllerConfig,
  RECURSIVE_LINE_ALGORITHMS,
  SVG_RENDER_TYPES
} from '../../core/ControllerConstants';

import { MAX_SEED } from '../../core/utils/random';

const CONFIG_STORAGE_KEY = 'SVGURT_CONFIG_SAVE';
const DEFAULT_CONFIG_NAME = 'Default Config';

class ControllerConfig {
  constructor() {
    this.configs = {};
    _.each(controllerConfig, (configItem, index) => {
      this[index] = configItem.default;
    });

    this.configNames = [];

    this.loadConfigFromStore();

    this.currentConfigName = DEFAULT_CONFIG_NAME;
  }

  getCurrentConfigName() {
    return this.currentConfigName;
  }

  getConfigNames() {
    return this.configNames;
  }

  loadConfigFromStore() {
    const configLoad = JSON.parse(localStorage.getItem(CONFIG_STORAGE_KEY));

    let hasDefaultKeySave = false;

    _.each(configLoad, (config, key) => {
      if (key === DEFAULT_CONFIG_NAME) {
        hasDefaultKeySave = true;
      }
      this.configs[key] = config;
      this.configNames.push(key);
    });

    if (!hasDefaultKeySave) {
      this.configNames.push(DEFAULT_CONFIG_NAME);
      this.configs[DEFAULT_CONFIG_NAME] = {};

      _.each(controllerConfig, (configItem, index) => {
        this.configs[DEFAULT_CONFIG_NAME][index] = configItem.default;
      });
    }
  }

  loadConfig(configNameToLoad) {
    if (configNameToLoad !== this.currentConfigName) {
      this.saveConfigs();

      _.each(controllerConfig, (configItem, index) => {
        this[index] = this.configs[configNameToLoad][index];
      });
      this.currentConfigName = configNameToLoad;
    }
  }

  loadConfigFromJson() {
    // console.log('loadNewConfig', newConfigName);
    // _.each(controllerConfig, (configItem, index) => {
    //   this[index] = configItem.default;
    // });
    alert('Coming soon.');
  }

  createNewConfig() {
    const newConfigName = prompt('Please enter the name of the configuration');

    if (!newConfigName || newConfigName === null) {
      return;
    }

    this.configs[newConfigName] = {};

    _.each(controllerConfig, (configItem, index) => {
      this.configs[newConfigName][index] = this[index];
    });

    this.currentConfigName = newConfigName;
    this.configNames.push(newConfigName);

    this.saveConfigs();
  }

  revertCurrentConfig() {
    _.each(controllerConfig, (configItem, index) => {
      this[index] = this.configs[this.currentConfigName][index];
    });
  }

  saveConfigs() {
    _.each(controllerConfig, (configItem, index) => {
      this.configs[this.currentConfigName][index] = this[index];
    });

    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(this.configs));
  }

  deleteConfig() {
    if (this.currentConfigName !== DEFAULT_CONFIG_NAME) {
      if (window.confirm('Are you sure you want delete this config?')) {
        this.configs[this.currentConfigName] = null;
        delete this.configs[this.currentConfigName];
        this.configNames = _.filter(
          this.configNames,
          name => name !== this.currentConfigName
        );
        this.currentConfigName = DEFAULT_CONFIG_NAME;
        _.each(controllerConfig, (configItem, index) => {
          this[index] = this.configs[DEFAULT_CONFIG_NAME][index];
        });
        this.saveConfigs();
      }
    } else {
      alert('You cannot delete the default config. Sorry :)');
    }
  }
}

export function updateRenderType(controller) {
  const newRenderType = controller.config.svgRenderType;
  const svgFolder = controller.svgFolder;
  const fractalFolder = controller.svgFolder.fractalFolder;

  if (controller.svgFolder.fractalFolder) {
    svgFolder.removeFolder(fractalFolder);
  }
  controller.svgFractalControls = {};
  _.each(controller.svgChangingControls, svgRenderSettingController => {
    svgFolder.remove(svgRenderSettingController);
  });
  controller.svgChangingControls = {};
  _.each(controller.svgRenderChangingControls, svgRenderChangingController => {
    svgFolder.remove(svgRenderChangingController);
  });
  controller.svgRenderChangingControls = {};

  const mainController = controller.config;

  controller.svgRenderChangingControls.svgRenderType = svgFolder.add(
    mainController,
    'svgRenderType',
    _.keys(SVG_RENDER_TYPES)
  );

  // eslint-disable-next-line default-case
  switch (newRenderType) {
    case SVG_RENDER_TYPES.TRACE: {
      controller.svgChangingControls['noiseSize'] = svgFolder.add(
        mainController,
        'noiseSize',
        0,
        200
      );
      controller.svgRenderChangingControls['fill'] = svgFolder.add(
        mainController,
        'fill'
      );
      if (mainController.fill) {
        controller.svgChangingControls['fillColor'] = svgFolder.addColor(
          mainController,
          'fillColor'
        );
      }

      controller.svgRenderChangingControls['stroke'] = svgFolder.add(
        mainController,
        'stroke'
      );
      if (mainController.stroke) {
        controller.svgChangingControls['strokeColor'] = svgFolder.addColor(
          mainController,
          'strokeColor'
        );
        controller.svgChangingControls['strokeWidth'] = svgFolder.add(
          mainController,
          'strokeWidth',
          0,
          100
        );
        controller.svgChangingControls['strokeWidthRandomness'] = svgFolder.add(
          mainController,
          'strokeWidthRandomness',
          0,
          1
        );
      }
      break;
    }
    case SVG_RENDER_TYPES.CIRCLE: {
      controller.svgChangingControls['minColorRecognized'] = svgFolder
        .add(mainController, 'minColorRecognized', 0, 255)
        .step(1);
      controller.svgChangingControls['maxColorRecognized'] = svgFolder
        .add(mainController, 'maxColorRecognized', 0, 255)
        .step(1);
      controller.svgChangingControls['renderEveryXPixels'] = svgFolder
        .add(mainController, 'renderEveryXPixels', 1, 50)
        .step(1);
      controller.svgChangingControls['renderEveryYPixels'] = svgFolder
        .add(mainController, 'renderEveryYPixels', 1, 50)
        .step(1);
      controller.svgRenderChangingControls['fill'] = svgFolder.add(
        mainController,
        'fill'
      );
      if (mainController.fill) {
        controller.svgChangingControls['fillColor'] = svgFolder.addColor(
          mainController,
          'fillColor'
        );
      }

      controller.svgRenderChangingControls['stroke'] = svgFolder.add(
        mainController,
        'stroke'
      );
      if (mainController.stroke) {
        controller.svgRenderChangingControls['autoColor'] = svgFolder.add(
          mainController,
          'autoColor'
        );
        if (!mainController.autoColor) {
          controller.svgChangingControls['strokeColor'] = svgFolder.addColor(
            mainController,
            'strokeColor'
          );
        }
        controller.svgChangingControls['strokeWidth'] = svgFolder.add(
          mainController,
          'strokeWidth',
          0,
          100
        );
        controller.svgChangingControls['strokeWidthRandomness'] = svgFolder.add(
          mainController,
          'strokeWidthRandomness',
          0,
          1
        );
      }

      controller.svgChangingControls['radius'] = svgFolder.add(
        mainController,
        'radius',
        0,
        50
      );
      controller.svgChangingControls['radiusOnColor'] = svgFolder.add(
        mainController,
        'radiusOnColor'
      );
      controller.svgChangingControls['radiusRandomness'] = svgFolder.add(
        mainController,
        'radiusRandomness',
        0,
        1
      );
      break;
    }
    case SVG_RENDER_TYPES.CURVE: {
      controller.svgChangingControls['minColorRecognized'] = svgFolder
        .add(mainController, 'minColorRecognized', 0, 255)
        .step(1);
      controller.svgChangingControls['maxColorRecognized'] = svgFolder
        .add(mainController, 'maxColorRecognized', 0, 255)
        .step(1);
      controller.svgChangingControls['renderEveryXPixels'] = svgFolder
        .add(mainController, 'renderEveryXPixels', 1, 50)
        .step(1);
      controller.svgChangingControls['renderEveryYPixels'] = svgFolder
        .add(mainController, 'renderEveryYPixels', 1, 50)
        .step(1);

      controller.svgRenderChangingControls['autoColor'] = svgFolder.add(
        mainController,
        'autoColor'
      );
      if (!mainController.autoColor) {
        controller.svgChangingControls['strokeColor'] = svgFolder.addColor(
          mainController,
          'strokeColor'
        );
      }
      controller.svgChangingControls['strokeWidth'] = svgFolder.add(
        mainController,
        'strokeWidth',
        0,
        100
      );
      controller.svgChangingControls['strokeWidthRandomness'] = svgFolder.add(
        mainController,
        'strokeWidthRandomness',
        0,
        1
      );
      controller.svgChangingControls['waves'] = svgFolder.add(
        mainController,
        'waves',
        0,
        50
      );
      controller.svgChangingControls['wavesRandomness'] = svgFolder.add(
        mainController,
        'wavesRandomness',
        0,
        1
      );
      controller.svgChangingControls['direction'] = svgFolder.add(
        mainController,
        'direction',
        0,
        360
      );
      controller.svgChangingControls['directionRandomness'] = svgFolder.add(
        mainController,
        'directionRandomness',
        0,
        1
      );
      controller.svgChangingControls['amplitude'] = svgFolder.add(
        mainController,
        'amplitude',
        0,
        100
      );
      controller.svgChangingControls['amplitudeRandomness'] = svgFolder.add(
        mainController,
        'amplitudeRandomness',
        0,
        1
      );
      // controller.svgRenderChangingControls['continuous'] = svgFolder.add(mainController, 'continuous');
      // if (!mainController.continuous) {
      controller.svgChangingControls['wavelength'] = svgFolder.add(
        mainController,
        'wavelength',
        0,
        100
      );
      controller.svgChangingControls['wavelengthRandomness'] = svgFolder.add(
        mainController,
        'wavelengthRandomness',
        0,
        1
      );
      // }
      break;
    }
    case SVG_RENDER_TYPES.LINE: {
      controller.svgChangingControls['minColorRecognized'] = svgFolder
        .add(mainController, 'minColorRecognized', 0, 255)
        .step(1);
      controller.svgChangingControls['maxColorRecognized'] = svgFolder
        .add(mainController, 'maxColorRecognized', 0, 255)
        .step(1);

      controller.svgRenderChangingControls['stroke'] = svgFolder.add(
        mainController,
        'stroke'
      );
      if (mainController.stroke) {
        controller.svgRenderChangingControls['autoColor'] = svgFolder.add(
          mainController,
          'autoColor'
        );
        if (!mainController.autoColor) {
          controller.svgChangingControls['strokeColor'] = svgFolder.addColor(
            mainController,
            'strokeColor'
          );
        }
        controller.svgChangingControls['strokeWidth'] = svgFolder.add(
          mainController,
          'strokeWidth',
          0,
          100
        );
        controller.svgChangingControls['strokeWidthRandomness'] = svgFolder.add(
          mainController,
          'strokeWidthRandomness',
          0,
          1
        );
      }
      controller.svgRenderChangingControls['continuous'] = svgFolder.add(
        mainController,
        'continuous'
      );
      if (!mainController.continuous) {
        controller.svgChangingControls['renderEveryXPixels'] = svgFolder
          .add(mainController, 'renderEveryXPixels', 1, 50)
          .step(1);
        controller.svgChangingControls['renderEveryYPixels'] = svgFolder
          .add(mainController, 'renderEveryYPixels', 1, 50)
          .step(1);
        controller.svgChangingControls['lineLength'] = svgFolder.add(
          mainController,
          'lineLength',
          0,
          300
        );
        controller.svgChangingControls['lengthOnColor'] = svgFolder.add(
          mainController,
          'lengthOnColor'
        );
        controller.svgChangingControls['lengthRandomness'] = svgFolder.add(
          mainController,
          'lengthRandomness',
          0,
          1
        );
        controller.svgChangingControls['direction'] = svgFolder.add(
          mainController,
          'direction',
          0,
          360
        );
      } else {
        controller.svgChangingControls['minLineLength'] = svgFolder
          .add(mainController, 'minLineLength', 1, 50)
          .step(1);
        controller.svgChangingControls['crossHatch'] = svgFolder.add(
          mainController,
          'crossHatch'
        );
        controller.svgChangingControls['amountOfLines'] = svgFolder
          .add(mainController, 'amountOfLines', 1, 5000)
          .step(1);

        // Ensure the direction isn't already out of bounds.
        if (mainController.direction > 180) {
          mainController.direction = 180;
        }

        controller.svgChangingControls['direction'] = svgFolder.add(
          mainController,
          'direction',
          0,
          180
        );
      }
      controller.svgChangingControls['directionRandomness'] = svgFolder.add(
        mainController,
        'directionRandomness',
        0,
        1
      );
      break;
    }
    case SVG_RENDER_TYPES.RECURSIVE: {
      controller.svgChangingControls['renderEveryXPixels'] = svgFolder
        .add(mainController, 'renderEveryXPixels', 1, 50)
        .step(1);
      controller.svgChangingControls['renderEveryYPixels'] = svgFolder
        .add(mainController, 'renderEveryYPixels', 1, 50)
        .step(1);
      controller.svgChangingControls['strokeColor'] = svgFolder.addColor(
        mainController,
        'strokeColor'
      );
      controller.svgChangingControls['strokeWidth'] = svgFolder.add(
        mainController,
        'strokeWidth',
        0,
        100
      );
      controller.svgChangingControls['strokeWidthRandomness'] = svgFolder.add(
        mainController,
        'strokeWidthRandomness',
        0,
        1
      );
      controller.svgChangingControls['recursiveAlgorithm'] = svgFolder.add(
        mainController,
        'recursiveAlgorithm',
        _.keys(RECURSIVE_LINE_ALGORITHMS)
      );
      controller.svgChangingControls['maxRecursiveDepth'] = svgFolder
        .add(mainController, 'maxRecursiveDepth', 1, 1000)
        .step(1);
      break;
    }
    case SVG_RENDER_TYPES.CONCENTRIC: {
      controller.svgChangingControls['strokeColor'] = svgFolder.addColor(
        mainController,
        'strokeColor'
      );
      controller.svgChangingControls['strokeWidth'] = svgFolder.add(
        mainController,
        'strokeWidth',
        0,
        100
      );
      controller.svgChangingControls['strokeWidthRandomness'] = svgFolder.add(
        mainController,
        'strokeWidthRandomness',
        0,
        1
      );
      controller.svgChangingControls['circleArcs'] = svgFolder
        .add(mainController, 'circleArcs', 2, 400)
        .step(1);
      controller.svgChangingControls['intensityWeight'] = svgFolder.add(
        mainController,
        'intensityWeight',
        500,
        1000000
      );
      controller.svgChangingControls['radiusStep'] = svgFolder
        .add(mainController, 'radiusStep', 1, 100)
        .step(1);
    }
  }
  // Add Displacement Fractal Field settings to to the end of SVG controls
  const newFractalFolder = svgFolder.addFolder('Displacement Fractal Field');
  controller.svgFolder.fractalFolder = newFractalFolder;
  controller.svgFractalControls[
    'applyFractalDisplacement'
  ] = newFractalFolder.add(mainController, 'applyFractalDisplacement');
  controller.svgFractalControls['displacementAmount'] = newFractalFolder.add(
    mainController,
    'displacementAmount',
    0,
    200
  );
  controller.svgFractalControls['displaceOrigin'] = newFractalFolder.add(
    mainController,
    'displaceOrigin'
  );
  controller.svgFractalControls['fractalRatioX'] = newFractalFolder.add(
    mainController,
    'fractalRatioX',
    0,
    1
  );
  controller.svgFractalControls['fractalRatioY'] = newFractalFolder.add(
    mainController,
    'fractalRatioY',
    0,
    1
  );
  controller.svgFractalControls['fractalRandomSeed'] = newFractalFolder
    .add(mainController, 'fractalRandomSeed', 0, MAX_SEED)
    .step(1);
}

const datConfig = {
  autoPlace: false
};

// This is a bit of a hack to force an update of dat gui.
export function updateGuiDisplay(gui) {
  // eslint-disable-next-line
  for (let i in gui.__controllers) {
    gui.__controllers[i].updateDisplay();
  }

  // eslint-disable-next-line
  for (let f in gui.__folders) {
    updateGuiDisplay(gui.__folders[f]);
  }
}

export function createController() {
  const gui = new dat.GUI(datConfig);

  const guiContainer = document.getElementById('js-dat-gui-container');
  guiContainer.appendChild(gui.domElement);

  const controller = {
    imageChangingControls: {},
    svgChangingControls: {},
    svgSettingControls: {}
  };

  const mainController = new ControllerConfig();

  controller['Live Update'] = gui.add(mainController, 'Live Update');

  const imageFolder = gui.addFolder('Image Controls');

  controller.imageChangingControls['grayscale'] = imageFolder.add(
    mainController,
    'grayscale'
  );
  controller.imageChangingControls['invert'] = imageFolder.add(
    mainController,
    'invert'
  );
  controller.imageChangingControls['blur'] = imageFolder
    .add(mainController, 'blur', 0, 30)
    .step(1);
  const posterizeFolder = imageFolder.addFolder('Posterize');
  controller.imageChangingControls['posterize'] = posterizeFolder.add(
    mainController,
    'posterize'
  );
  controller.imageChangingControls['posterizeLevels'] = posterizeFolder
    .add(mainController, 'posterizeLevels', 1, 30)
    .step(1);
  const edgeDetectionFolder = imageFolder.addFolder('Edge Detection');
  controller.imageChangingControls['Edge Detection'] = edgeDetectionFolder.add(
    mainController,
    'Edge Detection'
  );
  controller.imageChangingControls['lowThreshold'] = edgeDetectionFolder
    .add(mainController, 'lowThreshold', 0, 128)
    .step(1);
  controller.imageChangingControls['highThreshold'] = edgeDetectionFolder
    .add(mainController, 'highThreshold', 0, 128)
    .step(1);
  const fieldFolder = imageFolder.addFolder('Fractal Field Opacity');
  controller.imageChangingControls['applyFractalField'] = fieldFolder.add(
    mainController,
    'applyFractalField'
  );
  controller.imageChangingControls['fieldOpacity'] = fieldFolder.add(
    mainController,
    'fieldOpacity',
    0,
    1
  );
  controller.imageChangingControls['fieldRatioX'] = fieldFolder.add(
    mainController,
    'fieldRatioX',
    0,
    1
  );
  controller.imageChangingControls['fieldRatioY'] = fieldFolder.add(
    mainController,
    'fieldRatioY',
    0,
    1
  );
  controller.imageChangingControls['fieldRandomSeed'] = fieldFolder
    .add(mainController, 'fieldRandomSeed', 0, MAX_SEED)
    .step(1);
  controller.imageChangingControls['postBlur'] = imageFolder
    .add(mainController, 'postBlur', 0, 30)
    .step(1);

  const svgFolder = gui.addFolder('SVG Controls');
  controller.svgFolder = svgFolder;
  controller.svgSettingControls['outputScale'] = svgFolder.add(
    mainController,
    'outputScale',
    0,
    5
  );

  controller.gui = gui;
  controller.config = mainController;

  updateRenderType(controller);

  return controller;
}

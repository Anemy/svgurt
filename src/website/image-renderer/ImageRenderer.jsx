import React, { Component } from 'react';
import _ from 'lodash';

import './ImageRenderer.css';

import { ControlBar } from './control-bar/ControlBar';

import { updateGuiDisplay, updateRenderType } from '../controller/Controller';

import { manipulateImageData } from '../../core/image-manipulator';
import { renderSvgString } from '../../core/svg-renderer/svg-renderer';
import { downloadSVGString } from './downloader';
import { ResizableArea } from '../components/ResizeableArea';

const minLeftPanelWidth = 100;

class ImageRenderer extends Component {
  constructor(props) {
    super(props);

    this.imageURI = this.props.imageURI;

    this.state = {
      configNames: props.controller.config.getConfigNames(),
      currentConfigName: props.controller.config.getCurrentConfigName(),
      imageLoadingError: false,
      isRendered: false,
      isRendering: false,
      loadingImage: true,
      svgString: ''
    };
  }

  componentDidMount() {
    this.listenToSvgControls();

    // Listen for changes on all of the image changing controls.
    _.each(
      this.props.controller.imageChangingControls,
      imageChangingControl => {
        imageChangingControl.onFinishChange(() => {
          this.updateCanvasRender();
        });
      }
    );

    this.props.controller['Live Update'].onFinishChange(() => {
      if (this.props.controller.config['Live Update']) {
        // TODO: We can make this smarter and not force an update on both if both didn't change.
        this.updateCanvasRender();
      }
    });

    this.renderFirstTimeImage();
  }

  // These are controls which change on each change of a control.
  // Because they change often, we have to re-apply listeners on each change.
  updateSvgControlListeners = () => {
    const { controller } = this.props;
    _.each(controller.svgRenderChangingControls, svgRenderChangingControl => {
      svgRenderChangingControl.onChange(() => {
        updateRenderType(this.props.controller);

        this.updateSvgRender();

        this.updateSvgControlListeners();
      });
    });

    _.each(this.props.controller.svgChangingControls, svgSettingControl => {
      svgSettingControl.onFinishChange(() => {
        this.updateSvgRender();
      });
    });

    _.each(this.props.controller.svgFractalControls, svgFractalControl => {
      svgFractalControl.onFinishChange(() => {
        this.updateSvgRender();
      });
    });
  };

  listenToSvgControls = () => {
    this.updateSvgControlListeners();

    _.each(this.props.controller.svgSettingControls, svgSettingControl => {
      svgSettingControl.onFinishChange(() => {
        this.updateSvgRender();
      });
    });
  };

  onConfigChange = () => {
    this.setState({
      currentConfigName: this.props.controller.config.getCurrentConfigName(),
      configNames: this.props.controller.config.getConfigNames()
    });

    updateGuiDisplay(this.props.controller.gui);

    this.updateCanvasRender();
  };

  onImportNewImageClicked = () => {
    this.hiddenImageChooser.focus();
    this.hiddenImageChooser.click();
  };

  onDownloadSVGClicked = () => {
    downloadSVGString(this.state.svgString);
  };

  canvasRef = null;
  imageURI = null;
  renderedImage = null;

  handleImageChange = () => {
    if (
      !this.state.loadingImage &&
      this.hiddenImageChooser.files &&
      this.hiddenImageChooser.files[0]
    ) {
      this.setState({
        imageLoadingError: false,
        loadingImage: true
      });

      const reader = new FileReader();

      reader.onloadend = () => {
        this.imageURI = reader.result;

        this.setState({
          loadingImage: false,
          imageLoaded: true
        });

        setTimeout(() => this.renderFirstTimeImage());
      };

      reader.onerror = () => {
        this.setState({
          loadingImage: false,
          imageLoadingError: true
        });
      };

      setTimeout(() => {
        reader.readAsDataURL(this.hiddenImageChooser.files[0]);
      });
    }
  };

  renderFirstTimeImage() {
    // TODO: Offload hard things to web workers.
    if (this.imageURI) {
      this.setState({
        isRendering: true,
        isRendered: false
      });

      const htmlRenderedImage = new Image();

      htmlRenderedImage.onload = () => {
        this.canvasRef.width = htmlRenderedImage.width;
        this.canvasRef.height = htmlRenderedImage.height;

        this.height = htmlRenderedImage.height;
        this.width = htmlRenderedImage.width;

        const ctx = this.canvasRef.getContext('2d');
        this.renderedImage = htmlRenderedImage;
        ctx.drawImage(htmlRenderedImage, 0, 0, this.width, this.height);

        this.imageData = ctx.getImageData(0, 0, this.width, this.height);

        manipulateImageData(
          this.imageData,
          this.props.controller.config,
          this.width,
          this.height
        );

        ctx.putImageData(this.imageData, 0, 0);

        // Check if no updates here.
        this.setState({
          isRendered: true,
          isRendering: false,
          loadingImage: false
        });

        this.updateSvgRender();
      };

      htmlRenderedImage.src = this.imageURI;
    }
  }

  updateSvgRender() {
    if (
      this.state.isRendered &&
      this.imageData &&
      this.props.controller.config['Live Update']
    ) {
      renderSvgString(
        this.imageData.data,
        this.canvasRef,
        this.props.controller.config,
        this.canvasRef.width,
        this.canvasRef.height,
        svgString => {
          // TODO: Version/cancel this.
          this.setState({
            svgString
          });
        }
      );
    }
  }

  updateCanvasRender() {
    // TODO: Offload hard things to web workers.
    // TODO: Version of render management.
    if (
      this.renderedImage &&
      !this.state.isRendering &&
      this.props.controller.config['Live Update']
    ) {
      this.setState({
        isRendering: true,
        isRendered: false
      });

      const ctx = this.canvasRef.getContext('2d');
      this.canvasRef.width = this.width;
      this.canvasRef.height = this.height;
      ctx.drawImage(this.renderedImage, 0, 0, this.width, this.height);

      this.imageData = ctx.getImageData(0, 0, this.width, this.height);

      manipulateImageData(
        this.imageData,
        this.props.controller.config,
        this.width,
        this.height
      );

      ctx.putImageData(this.imageData, 0, 0);

      // Check if no updates here.
      this.setState({
        isRendered: true,
        isRendering: false
      });

      this.updateSvgRender();
    }
  }

  render() {
    const {
      configNames,
      currentConfigName,
      isRendered,
      isRendering,
      loadingImage,
      svgString
    } = this.state;

    return (
      <div className="svgee-image-renderer">
        <div className="svgee-demo-toolbar-area">
          <ControlBar
            currentConfigName={currentConfigName}
            configNames={configNames}
            onConfigChange={newConfigName => {
              this.props.controller.config.loadConfig(newConfigName);
              this.onConfigChange();
            }}
            onDownloadSVGClicked={this.onDownloadSVGClicked}
            onImportNewImageClicked={this.onImportNewImageClicked}
            onRevertClicked={() => {
              this.props.controller.config.revertCurrentConfig();
              this.onConfigChange();
            }}
            onLoadConfigClicked={() => {
              this.props.controller.config.loadConfigFromJson();
              this.onConfigChange();
            }}
            onCreateNewConfigClicked={() => {
              this.props.controller.config.createNewConfig();
              this.onConfigChange();
            }}
            onDeleteConfigClicked={() => {
              this.props.controller.config.deleteConfig();
              this.onConfigChange();
            }}
            onSaveConfigClicked={() => {
              this.props.controller.config.saveConfigs();
              this.onConfigChange();
            }}
          />
          <input
            accept="image/*"
            onChange={() => this.handleImageChange()}
            ref={ref => {
              this.hiddenImageChooser = ref;
            }}
            type="file"
          />
          {loadingImage && <p>Loading Image...</p>}
          {isRendering && <p>Building Image...</p>}
        </div>
        <div className="svgee-demo-main-render-area">
          <ResizableArea
            minWidth={minLeftPanelWidth}
            initialWidth={window.innerWidth / 2}
          >
            <div className="svgee-demo-panel">
              <canvas
                style={{
                  height: isRendered && !isRendering ? this.height * this.props.controller.config.scale : 0,
                  visibility: isRendered && !isRendering ? 'visible' : 'hidden',
                  width: isRendered && !isRendering ? this.width * this.props.controller.config.scale : 0
                }}
                ref={ref => {
                  this.canvasRef = ref;
                }}
              />
            </div>
          </ResizableArea>
          <div className="svgee-demo-panel-container">
            <div className="svgee-demo-panel">
              <div dangerouslySetInnerHTML={{ __html: svgString }} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export { ImageRenderer };

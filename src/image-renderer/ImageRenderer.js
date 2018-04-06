import _ from 'lodash';
import React, { Component } from 'react';

import { updateRenderType } from '../controller/Controller';

import { manipulateImageData } from './image-manipulator';
import { renderSvgString } from './svg-renderer';
import { downloadSVGString } from './downloader';

export default class ImageRenderer extends Component {
  constructor(props) {
    super(props);

    this.imageURI = this.props.imageURI;
  }

  state = {
    imageLoadingError: false,
    isRendered: false,
    isRendering: false,
    loadingImage: true,
    svgString: ''
  }

  componentDidMount() {
    this.props.controller.importNewImage.onChange(() => {
      this.hiddenImageChooser.focus();
      this.hiddenImageChooser.click();
    });

    this.props.controller.downloadSvgButton.onChange(() => {
      downloadSVGString(this.state.svgString);
    });

    this.props.controller.svgRenderTypeController.onChange(() => {
      updateRenderType(this.props.controller);

      this.updateSvgRender();
      
      _.each(this.props.controller.svgChangingControls, svgSettingControl => {
        svgSettingControl.onFinishChange(() => {
          this.updateSvgRender();
        });
      });
    });

    _.each(this.props.controller.svgChangingControls, svgSettingControl => {
      svgSettingControl.onFinishChange(() => {
        this.updateSvgRender();
      });
    });

    _.each(this.props.controller.svgSettingControls, svgSettingControl => {
      svgSettingControl.onFinishChange(() => {
        this.updateSvgRender();
      });
    });

    // Listen for changes on all of the image changing controls.
    _.each(this.props.controller.imageChangingControls, imageChangingControl => {
      imageChangingControl.onFinishChange(() => {
        this.updateCanvasRender();
      });
    });

    this.props.controller.liveUpdate.onFinishChange(() => {
      if (this.props.controller.settings.liveUpdate) {
        // TODO: We can make this smarter and not force an update on both if both didn't change.
        this.updateCanvasRender();
      }
    });

    this.renderFirstTimeImage();
  }

  canvasRef = null;
  imageURI = null;
  renderedImage = null;

  handleImageChange = () => {
    if (!this.state.loadingImage && this.hiddenImageChooser.files &&
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

        setImmediate(() => this.renderFirstTimeImage());
      };

      reader.onerror = () => {
        this.setState({
          loadingImage: false,
          imageLoadingError: true
        });
      };

      setImmediate(() => {
        reader.readAsDataURL(this.hiddenImageChooser.files[0]);
      });
    }
  }

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

        console.log('Loaded image with resolution', this.width, this.height);

        const ctx =  this.canvasRef.getContext('2d');
        this.renderedImage = htmlRenderedImage;
        ctx.drawImage(htmlRenderedImage, 0, 0, this.width, this.height);
        this.imageData = ctx.getImageData(0, 0, this.width, this.height);

        manipulateImageData(this.imageData, this.props.controller.settings, this.width, this.height);

        ctx.putImageData(this.imageData, 0, 0);

        // Check if no updates here.
        this.setState({
          isRendered: true,
          isRendering: false,
          loadingImage: false
        });

        this.updateSvgRender();

        console.log('Done rendering new image.');
      };

      htmlRenderedImage.src = this.imageURI;
    }
  }

  updateSvgRender() {
    if (this.state.isRendered && this.imageData && this.props.controller.settings.liveUpdate) {
      renderSvgString(this.imageData.data, this.props.controller.settings, this.width, this.height, svgString => {
        // TODO: Version/cancel this.
        this.setState({
          svgString
        });
      });
    }
  }

  updateCanvasRender() {
    // TODO: Offload hard things to web workers.
    // TODO: Version of render management.
    if (this.renderedImage && !this.state.isRendering && this.props.controller.settings.liveUpdate) {
      this.setState({
        isRendering: true,
        isRendered: false
      });

      const ctx =  this.canvasRef.getContext('2d');
      ctx.drawImage(this.renderedImage, 0, 0, this.width, this.height);
      this.imageData = ctx.getImageData(0, 0, this.width, this.height);

      manipulateImageData(this.imageData, this.props.controller.settings, this.width, this.height);

      ctx.putImageData(this.imageData, 0, 0);

      // Check if no updates here.
      this.setState({
        isRendered: true,
        isRendering: false
      });

      console.log('Done rendering the updated image.');

      this.updateSvgRender();
    }
  }

  render() {
    const { isRendered, isRendering, loadingImage, svgString } = this.state;

    return (
      <div className="svgee-image-renderer">
        {/* {!isRendered && !isRendering} We should do something... */}
        <input
          accept="image/*"
          onChange={() => this.handleImageChange()}
          ref={ref => { this.hiddenImageChooser = ref; }}
          type="file"
        />
        {loadingImage && <p>Loading Image...</p>}
        {isRendering && <p>Building Image...</p>}
        <div className="grid no-gutters">
          <div className="unit half">
            <div className="svgee-home-item">
              <canvas
                style={{
                  visibility: isRendered && !isRendering ? 'visible' : 'hidden'
                }}
                ref={ref => { this.canvasRef = ref; }}
              />
            </div>
          </div>
          <div className="unit half">
            <div className="svgee-home-item">
              <div dangerouslySetInnerHTML={{__html: svgString}} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

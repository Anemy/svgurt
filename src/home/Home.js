import React, { Component } from 'react';

import './Home.css';

import ImageRenderer from '../image-renderer/ImageRenderer';

import { createController } from '../controller/Controller';

export default class Home extends Component {
  state = {
    imageLoaded: false,
    imageLoadingError: false,
    loadingImage: false
  }

  controller = null;
  originalImageURI = null;

  invertImageClicked = () => {
    if (this.state.imageLoaded) {
      this.image.invertImage();

      this.image.setNeedsRender();

      this.setState({
        imageLoaded: true
      });
    }
  }

  handleImageChange = () => {
    if (!this.state.loadingImage && this.imageInputRef.files &&
      this.imageInputRef.files[0]
    ) {
      this.setState({
        loadingImage: true,
        imageLoadingError: false
      });

      const reader = new FileReader();

      reader.onloadend = () => {
        this.controller = createController();
        this.originalImageURI = reader.result;

        this.setState({
          loadingImage: false,
          imageLoaded: true
        });
      };

      reader.onerror = () => {
        this.setState({
          loadingImage: false,
          imageLoadingError: true
        });
      };

      setImmediate(() => {
        reader.readAsDataURL(this.imageInputRef.files[0]);
      });
    }
  }

  render() {
    const { imageLoaded, imageLoadingError, loadingImage } = this.state;

    return (
      <div className="svgee-home">
        {!imageLoaded &&
          <div className="import-image-prompt">
            <label
              htmlFor="image-upload"
              className={`svgee svgee-image-upload ${loadingImage && 'svgee-image-upload-disabled'}`}
            >
              Import Image
            </label>
            <input
              accept="image/*"
              disabled={loadingImage}
              id="image-upload"
              onChange={this.handleImageChange}
              ref={ref => { this.imageInputRef = ref; }}
              type="file"
            />
          </div>
        }
        {loadingImage && <p>Importing Image...</p>}
        {imageLoadingError && <p>Failed to load image. Please try again.</p>}
        {imageLoaded && <ImageRenderer controller={this.controller} imageURI={this.originalImageURI}/>}
      </div>
    );
  }
}

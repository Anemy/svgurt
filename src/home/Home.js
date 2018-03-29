import React, { Component } from 'react';

import './Home.css';

import ImageController from '../image-controller/ImageController';
import ImageRenderer from '../image-renderer/ImageRenderer';
import SvgRenderer from '../svg-renderer/SvgRenderer';
import SvgController from '../image-controller/SvgController';

export default class Home extends Component {
  state = {
    imageLoaded: false,
    imageLoadingError: false,
    loadingImage: false
  }

  image = null;
  svgController = null;

  invertImageClicked = () => {
    if (this.state.imageLoaded) {
      this.image.invertImage();

      console.log('done');

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
        loadingImage: true
      });

      const reader = new FileReader();

      reader.onloadend = () => {
        this.image = new ImageController();

        this.image.loadImageFromURI(reader.result, err => {
          this.svgController = new SvgController();
          this.svgController.setImage(this.image);
          this.svgController.setNeedsRender();

          this.setState({
            loadingImage: false,
            imageLoadingError: err,
            imageLoaded: !err
          });
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
        {imageLoadingError && <p>Failed to load image. Please try again</p>}
        {imageLoaded && <div className="grid no-gutters">
          <div className="unit two-fifths">
            <div className="svgee-home-item">
              <ImageRenderer image={this.image}/>
            </div>
          </div>
          <div className="unit two-fifths">
            <div className="svgee-home-item">
              <SvgRenderer svgController={this.svgController}/>
            </div>
          </div>
          <div className="unit one-fifth">
            <div className="svgee-home-item">
              <p>Controls</p>
              <button
                onClick={this.invertImageClicked}
              >
                Invert Image
              </button>
            </div>
          </div>
        </div>}
      </div>
    );
  }
}

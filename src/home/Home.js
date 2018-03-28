import React, { Component } from 'react';

import './Home.css';

import ImageController from '../image-controller/ImageController';
import ImageRenderer from '../image-renderer/ImageRenderer';

export default class Home extends Component {
  state = {
    imageLoaded: false,
    imageLoadingError: false,
    loadingImage: false
  }

  image = null;

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
          this.setState({
            loadingImage: false,
            imageLoadingError: err,
            imageLoaded: !err
          });

          if (!err) {
            setTimeout(() => {
              // Invert the image in a few seconds just for example - remove later.
              const imageData = [...this.image.getData()];

              for (let i = 0; i < imageData.length; i++) {
                if (i % 4 === 0) { // Skip alpha channel.
                  imageData[i] = 255 - imageData[i];
                }
              }

              this.image.setData(imageData);
              this.image.setNeedsRender();
              this.setState({
                // Force a re-render.
                imageLoaded: true
              });
            }, 3000);
          }
        });
      };

      reader.readAsDataURL(this.imageInputRef.files[0]);
    }
  }

  render() {
    const { imageLoaded, imageLoadingError, loadingImage } = this.state;

    return (
      <div className="svgee-home">
        <label
          htmlFor="image-upload"
          className="svgee svgee-image-upload"
        >
          Import Image
        </label>
        <input
          accept="image/*"
          className="svgee"
          disabled={loadingImage}
          id="image-upload"
          onChange={this.handleImageChange}
          ref={ref => { this.imageInputRef = ref; }}
          type="file"
        />
        {imageLoaded && <p>Loaded!</p>}
        {imageLoaded && <ImageRenderer image={this.image}/>}
        {imageLoadingError && <p>Failed to load image. Please try again</p>}
      </div>
    );
  }
}

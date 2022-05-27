import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './LiveApp.css';

import ImageRenderer from '../image-renderer/ImageRenderer';

import { createController } from '../controller/Controller';
import exampleImage from '../fixtures/example-image';
import SvgurtTextLogo from '../home/SvgurtTextLogo';
import LandingInfo from '../landing-info/LandingInfo';

export default class LiveApp extends Component {
  state = {
    showLandingInfo: true,
    loadingImage: true,
    imageLoaded: false,
    imageLoadingError: false
  };

  controller = null;
  originalImageURI = null;

  componentDidMount() {
    this.loadExampleImage();
  }

  componentWillUnmount() {
    if (this.controller) {
      this.controller.gui.destroy();
      this.controller = null;
    }
  }

  invertImageClicked = () => {
    if (this.state.imageLoaded) {
      this.image.invertImage();

      this.image.setNeedsRender();

      this.setState({
        imageLoaded: true
      });
    }
  };

  loadExampleImage = () => {
    this.originalImageURI = exampleImage;

    this.controller = createController();

    this.setState({
      imageLoaded: true,
      loadingImage: false
    });
  };

  handleImageChange = () => {
    if (
      !this.state.loadingImage &&
      this.imageInputRef.files &&
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

      setTimeout(() => {
        reader.readAsDataURL(this.imageInputRef.files[0]);
      });
    }
  };

  render() {
    const { showLandingInfo, imageLoaded, imageLoadingError, loadingImage } = this.state;

    return (
      <div className="svgee-full-page">
        <div className="svgee-top-nav-bar">
          <SvgurtTextLogo />
          <button
            className="svgee-top-nav-link"
            onClick={() => {
              this.setState({
                showLandingInfo: true
              });
            }}
          >
            Home
          </button>
          <Link className="svgee-top-nav-link" to="/cli">
            Cli Docs
          </Link>
          <a
            className="svgee-top-nav-link"
            href="https://github.com/Anemy/svgurt"
            rel="noopener noreferrer"
            target="_blank"
          >
            Github
          </a>
        </div>
        {loadingImage && <p>Importing Image...</p>}
        {imageLoadingError && <p>Failed to load image. Please try again.</p>}
        {imageLoaded && (
          <ImageRenderer
            controller={this.controller}
            imageURI={this.originalImageURI}
          />
        )}
        <div id="js-dat-gui-container" className="svgee-dat-gui-container" />
        {showLandingInfo && (
          <LandingInfo
            closeLandingInfo={() => {
              this.setState({
                showLandingInfo: false
              });
            }}
          />
        )}
      </div>
    );
  }
}

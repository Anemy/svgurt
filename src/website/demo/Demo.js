import React, { Component } from "react";
import { Link } from "react-router-dom";

import "./Demo.css";

import ImageRenderer from "../image-renderer/ImageRenderer";

import { createController } from "../controller/Controller";
import exampleImage from "../fixtures/example-image";
import SvgurtTextLogo from "../home/SvgurtTextLogo";

export default class Demo extends Component {
  constructor(props) {
    super(props);
  }

  state = {
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

      setImmediate(() => {
        reader.readAsDataURL(this.imageInputRef.files[0]);
      });
    }
  };

  render() {
    const { imageLoaded, imageLoadingError, loadingImage } = this.state;

    return (
      <React.Fragment>
        <div className="svgee-top-nav-bar">
          <SvgurtTextLogo />
          <Link className="svgee-top-nav-link" to="/">
            Home
          </Link>
          <Link className="svgee-top-nav-link" to="cli">
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
      </React.Fragment>
    );
  }
}

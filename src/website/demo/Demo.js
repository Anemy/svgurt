import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './Demo.css';

import ImageRenderer from '../image-renderer/ImageRenderer';

import { createController } from '../controller/Controller';
import exampleImage from '../fixtures/example-image';
import SvgurtTextLogo from '../home/SvgurtTextLogo';

export default class Demo extends Component {
  state = {
    imageLoaded: false,
    imageLoadingError: false,
    loadingImage: false
  }

  controller = null;
  originalImageURI = null;

  constructor(props){super(props);console.log('demooo const');}

  componentWillUnmount() {
    if (this.controller) {
      this.controller.gui.destroy();
      this.controller = null;
    }
  }

  componentWillMount() {
    console.log('test');
  }

  invertImageClicked = () => {
    if (this.state.imageLoaded) {
      this.image.invertImage();

      this.image.setNeedsRender();

      this.setState({
        imageLoaded: true
      });
    }
  }

  handleExampleImageClicked = () => {
    if (!this.loadingImage && !this.imageLoaded) {
      this.controller = createController();
      this.originalImageURI = exampleImage;

      this.setState({
        loadingImage: false,
        imageLoaded: true,
        imageLoadingError: false
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
    const {
      imageLoaded,
      imageLoadingError,
      loadingImage
    } = this.state;

    console.log('demo');

    return (
      <React.Fragment>
        <div className="svgee-top-nav-bar">
          <SvgurtTextLogo />
          <Link
            className="svgee-top-nav-link"
            to="/"
          >
            Home
          </Link>
          <Link
            className="svgee-top-nav-link"
            to="cli"
          >
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
        {!imageLoaded &&
          <div className="svgee-demo-image-prompt-container">
            <button
              onClick={this.handleExampleImageClicked}
              className={`svgee svgee-image-upload ${loadingImage && 'svgee-image-upload-disabled'}`}
            >Use Example Image</button>
            <br />
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
        <div id="js-dat-gui-container" className="svgee-dat-gui-container" />
      </React.Fragment>
    );
  }
}

import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './Home.css';

import ImageRenderer from '../image-renderer/ImageRenderer';

import { createController } from '../controller/Controller';
import exampleImage from '../fixtures/example-image';
import SvgurtExampleSvg from './SvgurtExampleSvg';
import SvgurtTextLogo from './SvgurtTextLogo';

export default class Home extends Component {
  state = {
    imageLoaded: false,
    imageLoadingError: false,
    loadingImage: false
  }

  controller = null;
  originalImageURI = null;

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

    return (
      <div className="svgee-home">
        {!imageLoaded &&
          <React.Fragment>
            <div className="svgee-top-nav-bar">
              <SvgurtTextLogo />
              <Link
                className="svgee-top-nav-link"
                to="cli"
              >
                CLI Docs
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
            <div className="svgee-import-image-prompt">
              {/* <a
                href="https://github.com/Anemy/svgurt"
                rel="noopener noreferrer"
                target="_blank"
              >
                <img
                  className="svgee-github-banner"
                  src="https://s3.amazonaws.com/github/ribbons/forkme_right_green_007200.png"
                  alt="Fork me on GitHub"
                />
              </a> */}
              <img
                className="svgee-logo-image"
                src="/images/svgurt_logo.png"
                alt="svgurt logo"
              />
              <h1>Svgurt</h1>
              <h2>Image -&gt; SVG Vectorizing Tool</h2>
              <h3>Free &amp;&nbsp;
                <a
                  href="https://github.com/Anemy/svgurt"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Open Source
                </a>
              </h3>
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
              <div className="svgee-import-image-example">
                <img
                  className="svgee-example-image"
                  src="/images/palm.png"
                  alt="palm tree"
                />
                <div className="svgee-example-text">
                  --&gt;
                </div>
                <SvgurtExampleSvg />
              </div>
            </div>
          </React.Fragment>
        }
        {loadingImage && <p>Importing Image...</p>}
        {imageLoadingError && <p>Failed to load image. Please try again.</p>}
        {imageLoaded && <ImageRenderer controller={this.controller} imageURI={this.originalImageURI}/>}
        <div id="js-dat-gui-container" className="svgee-dat-gui-container" />
      </div>
    );
  }
}

import React, { Component } from 'react';

import './LandingInfo.css';

export default class LandingInfo extends Component {
  render() {
    const {
      closeLandingInfo
    } = this.props;

    return (
      <React.Fragment>
        <div
          className="svgee-landing-page-background"
          onClick={closeLandingInfo}
        />
        <div className="svgee-landing-page">
          <img
            className="svgee-logo-image"
            src="/images/svgurt_logo.png"
            alt="svgurt logo"
          />
          <div className="svgee-home-desc">
            Svgurt is an{' '}
            <strong>
              <a
                href="https://github.com/Anemy/svgurt"
                rel="noopener noreferrer"
                target="_blank"
              >
                open source
              </a>
            </strong>{' '}
            image to <strong>SVG</strong> transformation tool with a lot of
            knobs and controls.
          </div>
          <div className="svgee-demo-link-container">
            <button
              className="svgee-demo-link"
              onClick={closeLandingInfo}
            >
              Ok, let me use it already
            </button>
          </div>
          <table className="svgee-example-table">
            <tr>
              <th>Input</th>
              <th>Output</th>
            </tr>
            <tr>
              <td>
                <img
                  className="svgee-image-example-input"
                  src="/images/palm.png"
                  alt="palm tree input"
                />
              </td>
              <td>
                <img
                  className="svgee-svg-example-output"
                  src="/images/palm-1.svg"
                  alt="palm tree svg output"
                />
              </td>
            </tr>
            <tr>
              <td>
                <img
                  className="svgee-image-example-input"
                  src="/images/palm.png"
                  alt="palm tree"
                />
              </td>
              <td>
                <img
                  className="svgee-svg-example-output"
                  src="/images/palm-2.svg"
                  alt="palm tree svg output"
                />
              </td>
            </tr>
            <tr>
              <td>
                <img
                  className="svgee-image-example-input"
                  src="/images/palm.png"
                  alt="palm tree"
                />
              </td>
              <td>
                <img
                  className="svgee-svg-example-output"
                  src="/images/palm-3.svg"
                  alt="palm tree svg output"
                />
              </td>
            </tr>
          </table>
        </div>
      </React.Fragment>
    );
  }
}

import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './Home.css';

import SvgurtTextLogo from './SvgurtTextLogo';

export default class Home extends Component {
  render() {
    return (
      <div className="svgee-home">
        <div className="svgee-top-nav-bar">
          <SvgurtTextLogo />
          <Link className="svgee-top-nav-link" to="/#/cli">
            CLI Docs
          </Link>
          <Link className="svgee-top-nav-link" to="/#/">
            Live App
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
        <div className="svgee-home-page">
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
            <Link className="svgee-demo-link" to="app">
              Use Now
            </Link>
          </div>
          <table className="svgee-example-table">
            <thead>
              <tr>
                <th>Input</th>
                <th>Output</th>
              </tr>
            </thead>
            <tbody>
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
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

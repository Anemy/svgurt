import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './Home.css';

import SvgurtExampleSvg from './SvgurtExampleSvg';
import SvgurtTextLogo from './SvgurtTextLogo';

export default class Home extends Component {
  render() {
    return (
      <div className="svgee-home">
        <div className="svgee-top-nav-bar">
          <SvgurtTextLogo />
          <Link
            className="svgee-top-nav-link"
            to="cli"
          >
            CLI Docs
          </Link>
          <Link
            className="svgee-top-nav-link"
            to="demo"
          >
            Demo
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
          <h1 className="svgee-svgurt-title">Svgurt</h1>
          <h2 className="svgee-tool-desc">Image -&gt; SVG Vectorizing Tool</h2>
          <h3 className="svgee-open-source-desc">Free &amp;&nbsp;
            <a
              href="https://github.com/Anemy/svgurt"
              rel="noopener noreferrer"
              target="_blank"
            >
              Open Source
            </a>
          </h3>
          <div className="svgee-demo-link-container">
            <Link
              className="svgee-demo-link"
              to="demo"
            >
              Live Demo
            </Link>
          </div>
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
      </div>
    );
  }
}

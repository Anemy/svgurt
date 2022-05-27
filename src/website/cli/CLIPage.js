import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';

import './CLIPage.css';

import cliDocsMarkdown from './cli-wiki.md';

import SvgurtTextLogo from '../home/SvgurtTextLogo';

export default class CLIPage extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="svgee-top-nav-bar">
          <SvgurtTextLogo />
          <Link className="svgee-top-nav-link" to="/#/">
            Home
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
        <div className="svgee-docs-container">
          <ReactMarkdown source={cliDocsMarkdown} />
        </div>
      </React.Fragment>
    );
  }
}

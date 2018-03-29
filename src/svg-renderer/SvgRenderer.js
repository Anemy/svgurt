import React, { Component } from 'react';

export default class SvgRenderer extends Component {
  constructor(props) {
    super(props);

    // Hella coupled but w/e.
    const { svgController } = this.props;

    this.state = {
      isRendering: svgController.getIsRendering(),
      isRendered: svgController.getIsRendered()
    };
  }

  componentDidMount() {
    this.updateSvgRender();
  }

  componentDidUpdate() {
    this.updateSvgRender();
  }

  updateSvgRender() {
    const { svgController } = this.props;

    if (svgController.getNeedsRender()) {
      this.setState({
        isRendering: true,
        isRendered: false
      });

      svgController.renderSvgString(() => {
        this.setState({
          isRendering: false,
          isRendered: true
        });
      });
    }
  }

  render() {
    const { svgController } = this.props;
    const { isRendered } = this.state;

    return (
      <div className="svgee-svg-renderer">
        {isRendered && <div dangerouslySetInnerHTML={{__html: svgController.getSvgString()}}/>}
        {!isRendered && <p>Svg Rendering...</p>}
      </div>
    );
  }
}

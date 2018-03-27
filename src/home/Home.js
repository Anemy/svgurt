import React, { Component } from 'react';

import './Home.css';

export default class Home extends Component {
  state = {
    imagePreviewSrc: null
  }

  handleImageChange = () => {
    if (this.imageInputRef.files && this.imageInputRef.files[0]) {
      const reader = new FileReader();

      reader.onloadend = () => {
        this.setState({
          imagePreviewSrc: [reader.result]
        });
      };

      reader.readAsDataURL(this.imageInputRef.files[0]);
    }
  }

  render() {
    const { imagePreviewSrc } = this.state;
    
    return (
      <div className="svgee-home">
        <input
          accept="image/*"
          type="file"
          id="input"
          onChange={this.handleImageChange}
          ref={ref => { this.imageInputRef = ref; }}
        />
        {imagePreviewSrc && <img alt="Preview" src={imagePreviewSrc}/>}
      </div>
    );
  }
}

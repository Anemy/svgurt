import _ from 'lodash';
import React from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

import './ControlBar.css';

export default function ControlBar(props) {
  const { onConfigChange, onImportNewImageClicked, onDownloadSVGClicked, currentConfigName, configNames } = props;

  const selectOptions = _.map(configNames, name => {
    return { value: name, label: name, className: 'svgee-control-bar-config-item' };
  });

  return (
    <div className="svgee-image-renderer">
      <div className="svgee-top-control-bar">
        <div className="svgee-control-bar-left">
          <div className="svgee-control-bar-config-selector-container">
            <Select
              className="svgee-control-bar-config-selector"
              clearable={false}
              name="form-field-name"
              value={currentConfigName}
              onChange={newConfig => onConfigChange(newConfig.value)}
              options={selectOptions}
            />
          </div>
          <div
            className="svgee-control-bar-button"
            onClick={onImportNewImageClicked}
          >
            New
          </div>
          <div
            className="svgee-control-bar-button"
            onClick={onImportNewImageClicked}
          >
            Save
          </div>
          <div
            className="svgee-control-bar-button"
            onClick={onImportNewImageClicked}
          >
            Revert
          </div>
          <div
            className="svgee-control-bar-button"
            onClick={onImportNewImageClicked}
          >
            Load
          </div>
        </div>
        <div className="svgee-control-bar-right">
          <div
            className="svgee-control-bar-button"
            onClick={onImportNewImageClicked}
          >
            Import New Image
          </div>
          <div
            className="svgee-control-bar-button"
            onClick={onDownloadSVGClicked}
          >
            Download SVG
          </div>
        </div>
      </div>
    </div>
  );
}

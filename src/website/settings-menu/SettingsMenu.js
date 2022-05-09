// import _ from 'lodash';
import React, { useState } from 'react';
// import Select from 'react-select';
import { Menu, Button, MenuItem } from '@material-ui/core';

// import 'react-select/dist/react-select.css';

import './SettingsMenu.css';

export default function SettingsMenu(props) {

  // constructor() {
  //   this.configs = {};
  //   _.each(controllerConfig, (configItem, index) => {
  //     this[index] = configItem.default;
  //   });

  //   this.configNames = [];

  //   this.loadConfigFromStore();

  //   this.currentConfigName = DEFAULT_CONFIG_NAME;
  // }

  const {
    // onConfigChange,
    // onCreateNewConfigClicked,
    // onDeleteConfigClicked,
    onDownloadSVGClicked,
    onImportNewImageClicked
  } = props;

  // const selectOptions = _.map(configNames, name => {
  //   return {
  //     value: name,
  //     label: name,
  //     className: 'svgee-control-bar-config-item'
  //   };
  // });

  const [menuAnchorEl, setAnchorEl] = useState(null);

  // const handleOpenMenu = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <div className="svgee-top-control-bar">
      <div className="svgee-control-bar-left">
        <Button
          // variant="outlined"
          // color="primary"
          // color=""
          variant="contained"
          size="small"
          onClick={() => {
            onImportNewImageClicked();
          }}
        >
          Import New Image
        </Button>
        {/* <Button
          // variant="outlined"
          // color="primary"
          variant="contained"
          size="small"
          // color="primary"
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleOpenMenu}
        >
          File
        </Button> */}
        <Menu
          id="simple-menu"
          anchorEl={menuAnchorEl}
          keepMounted
          open={Boolean(menuAnchorEl)}
          onClose={handleCloseMenu}
        >
          <MenuItem
            onClick={() => {
              handleCloseMenu();
              onImportNewImageClicked();
            }}
          >Import New Image</MenuItem>
          {/* <MenuItem onClick={() => {
            handleCloseMenu();
            onImportNewImageClicked();
          }}>Load config</MenuItem>
          <MenuItem onClick={() => {
            handleCloseMenu();
            onSaveConfigClicked();
          }}>Save config</MenuItem> */}
          <MenuItem onClick={() => {
            handleCloseMenu();
            onDownloadSVGClicked();
          }}>Download SVG</MenuItem>
        </Menu>
        {/* <div
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
        </div> */}
      </div>
      {/* <div className="svgee-control-bar-right">
        <div className="svgee-control-bar-config-selector-container">
          <Select
            className="svgee-control-bar-config-selector"
            clearable={false}
            name="form-field-name"
            value={currentConfigName}
            onChange={newConfig => {
              if (newConfig) {
                onConfigChange(newConfig.value);
              }
            }}
            options={selectOptions}
          />
        </div>
        <div
          className="svgee-control-bar-button"
          onClick={onCreateNewConfigClicked}
        >
          New
        </div>
        <div className="svgee-control-bar-button" onClick={onSaveConfigClicked}>
          Save
        </div>
        <div className="svgee-control-bar-button" onClick={onRevertClicked}>
          Revert
        </div>
        <div
          className="svgee-control-bar-button"
          onClick={onDeleteConfigClicked}
        >
          Delete
        </div>
      </div> */}
      <div className="svgee-control-bar-right">
        <Button
          // variant="outlined"
          // color="primary"
          variant="contained"
          size="small"
          onClick={() => {
            onDownloadSVGClicked();
          }}
        >
          Download SVG
        </Button>
      </div>
    </div>
  );
}

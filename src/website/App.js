import React from 'react';
// import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';

import CLIPage from './cli/CLIPage';
import LiveApp from './live-app/LiveApp';

import './App.css';

const App = () => (
  <main>
    {/* <Router> */}
      <Routes>
      {/* <Switch> */}
        <Route path="/cli" element={<CLIPage />} />
        <Route exact path="/" element={<LiveApp />} />
      {/* </Switch> */}
      </Routes>
    {/* </Router> */}
  </main>
);

export default App;

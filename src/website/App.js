import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';

import CLIPage from './cli/CLIPage';
import LiveApp from './live-app/LiveApp';

import './App.css';

const App = () => (
  <main>
    <Router>
      <React.Fragment>
        <Route path="/cli" component={CLIPage} />
        <Route exact path="/" component={LiveApp} />
      </React.Fragment>
    </Router>
  </main>
);

export default App;

import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';

import CLIPage from './cli/CLIPage';
import Demo from './demo/Demo';
import Home from './home/Home';

import './App.css';

const App = () => (
  <main>
    <Router>
      <React.Fragment>
        <Route path="/cli" component={CLIPage} />
        <Route path="/demo" component={Demo} />
        <Route exact path="/" component={Home} />
      </React.Fragment>
    </Router>
  </main>
);

export default App;

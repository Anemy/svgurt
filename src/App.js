import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import Home from './home/Home';
import CLIPage from './cli/CLIPage';

import './App.css';

const App = () => (
  <main>
    <Router>
      <React.Fragment>
        <Route path="/cli" component={CLIPage} />
        <Route exact path="/" component={Home} />
      </React.Fragment>
    </Router>
  </main>
);

export default App;

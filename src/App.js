import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './home/Home';

const App = () => (
  <main>
    <Router>
      <Route path="/" component={Home} />
    </Router>
  </main>
);

export default App;

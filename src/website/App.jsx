import React from 'react';
// import { HashRouter as Router, Route, Routes } from 'react-router-dom';
// import { HashRouter as Router, Route, Switch } from 'react-router-dom';
// import { Router, Route, Switch } from 'react-router-dom';
// import { Route, Routes } from 'react-router-dom';

import {
  createHashRouter,
  RouterProvider
} from 'react-router-dom';

import { CLIPage } from './cli/CLIPage';
import { LiveApp } from './live-app/LiveApp';

import './App.css';

const router = createHashRouter([
  {
    path: '/',
    element: <LiveApp />
    // loader: rootLoader,
    // children: [
    //   {
    //     path: 'cli',
    //     element: <CLIPage />
    //     // loader: teamLoader,
    //   }
    // ]
  },
  {
    path: 'cli',
    element: <CLIPage />
  }
]);


{/* <Router>
  <Switch>
    <Route path="/cli" element={<CLIPage />} />
    <Route exact path="/" element={<LiveApp />} />
  </Switch>
</Router> */}

function App() {
  return (
    <main>
      <RouterProvider router={router} />
    </main>
  );
}

export { App };

import React from 'react';

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
  },
  {
    path: 'cli',
    element: <CLIPage />
  }
]);

function App() {
  return (
    <main>
      <RouterProvider router={router} />
    </main>
  );
}

export { App };

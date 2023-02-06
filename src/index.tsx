import React from 'react';
import { createRoot } from 'react-dom/client';

import './website/index.css';

import { App } from './website/App';
import registerServiceWorker from './website/registerServiceWorker';

const htmlRoot = document.getElementById('root');

if (!htmlRoot) {
  throw new Error('No html root for react.');
}

createRoot(
  htmlRoot
).render(<App />);
registerServiceWorker();

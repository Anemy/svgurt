import React from 'react';
import { createRoot } from 'react-dom/client';

import './website/index.css';

import { App } from './website/App';
import registerServiceWorker from './website/registerServiceWorker';

createRoot(
  document.getElementById('root')
).render(<App />);
registerServiceWorker();

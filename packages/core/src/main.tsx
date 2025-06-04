import React from 'react';
import ReactDOM from 'react-dom/client';

import { appConfigService } from '@openzeppelin/transaction-form-utils';

import App from './App';
import './index.css';

// declare global {
//   interface Window {
//     reactCoreInstance: typeof React;
//     adapterEvmRainbowKitInstance: typeof React;
//     appMainInstance: typeof React;
//   }
// }

// window.appMainInstance = React;
// console.log(
//   '[DEBUG] React instance in main app entry (core/main.tsx):',
//   React.version,
//   window.appMainInstance === React
// );

// if (window.reactCoreInstance) {
//   console.log(
//     '[DEBUG] Is main app React === react-core React?:             ',
//     window.appMainInstance === window.reactCoreInstance
//   );
// }

// if (window.adapterEvmRainbowKitInstance) {
//   console.log(
//     '[DEBUG] Is main app React === adapter-evm React?:           ',
//     window.appMainInstance === window.adapterEvmRainbowKitInstance
//   );
// }

async function main() {
  // Initialize the AppConfigService before rendering the application
  // For the core app, we primarily rely on Vite environment variables.
  // We could also add a { type: 'json', path: '/app.config.local.json' } for local dev overrides.
  await appConfigService.initialize([
    { type: 'viteEnv', env: import.meta.env },
    { type: 'json', path: '/app.config.local.json' },
  ]);

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// ---
// Stagewise Toolbar Integration (Development Only)
// To enable the Stagewise AI toolbar, set VITE_ENABLE_STAGEWISE_TOOLBAR=true in your .env or .env.local file.
// The toolbar will only load in development mode and will never be included in production builds.
// ---
if (
  import.meta.env.MODE === 'development' &&
  import.meta.env.VITE_ENABLE_STAGEWISE_TOOLBAR === 'true'
) {
  void import('@stagewise/toolbar-react').then(({ StagewiseToolbar }) => {
    const config = { plugins: [] };
    const toolbarRoot = document.createElement('div');
    toolbarRoot.id = 'stagewise-toolbar-root';
    document.body.appendChild(toolbarRoot);
    void import('react-dom/client').then(({ createRoot }) => {
      createRoot(toolbarRoot).render(<StagewiseToolbar config={config} />);
    });
  });
}

void main(); // Explicitly ignore the promise returned by main()

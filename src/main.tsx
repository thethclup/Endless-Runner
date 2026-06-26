import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Suppress Coinbase Wallet Analytics SDK fetch errors logged to console
const originalConsoleError = console.error;
console.error = (...args) => {
  const msg = args.map(String).join(' ');
  if (msg.includes('Analytics SDK') || msg.includes('Failed to fetch')) {
    return;
  }
  originalConsoleError(...args);
};

window.addEventListener('unhandledrejection', (event) => {
  const msg = event.reason?.message || String(event.reason);
  if (msg.includes('Analytics SDK') || msg.includes('Failed to fetch')) {
    event.preventDefault();
  }
});

window.addEventListener('error', (event) => {
  const msg = event.message || String(event.error);
  if (msg.includes('Analytics SDK') || msg.includes('Failed to fetch')) {
    event.preventDefault();
  }
});

import { OnchainProvider } from './lib/onchain/providers.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <OnchainProvider>
      <App />
    </OnchainProvider>
  </StrictMode>,
);

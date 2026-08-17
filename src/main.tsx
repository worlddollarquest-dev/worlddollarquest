// Ensure window.fetch is safely assignable in iframe and polyfill environments
if (typeof window !== 'undefined') {
  try {
    const rawFetch = window.fetch;
    if (rawFetch) {
      let customFetch = function (...args: any[]) {
        return rawFetch.apply(window, args as [any, any]);
      };
      const desc =
        Object.getOwnPropertyDescriptor(window, 'fetch') ||
        Object.getOwnPropertyDescriptor(Object.getPrototypeOf(window) || {}, 'fetch');
      if (!desc || !desc.set) {
        Object.defineProperty(window, 'fetch', {
          get: () => customFetch,
          set: (fn) => {
            customFetch = fn;
          },
          configurable: true,
          enumerable: true,
        });
      }
    }
  } catch {
    // Ignore if unconfigurable
  }
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { MockApiService } from './mocking/index.ts';
import './index.css';
import '@/assets/fonts/stylesheet.css';

if (import.meta.env.VITE_ENV === 'mock') {
  new MockApiService().register();
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

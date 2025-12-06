import React from 'react';
import { createRoot } from 'react-dom/client';
import UsersPage from './components/admin/UsersPage';
import './index.css';

// Add background styles to document
document.documentElement.style.backgroundColor = '#0f172a';
document.body.style.backgroundColor = '#0f172a';
document.body.style.margin = '0';
document.body.style.padding = '0';
document.body.style.fontFamily = 'system-ui, -apple-system, sans-serif';

const container = document.getElementById('root');
if (!container) throw new Error('Root element not found');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <UsersPage />
  </React.StrictMode>
);

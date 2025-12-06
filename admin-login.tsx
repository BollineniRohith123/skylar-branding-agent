import React from 'react';
import { createRoot } from 'react-dom/client';
import AdminLogin from './components/admin/AdminLogin';
import './index.css';

const container = document.getElementById('root');
if (!container) throw new Error('Root element not found');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <AdminLogin />
  </React.StrictMode>
);

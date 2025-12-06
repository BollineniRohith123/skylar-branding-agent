import React from 'react';
import { createRoot } from 'react-dom/client';
import UsersPage from './components/admin/UsersPage';
import UserImagesPage from './components/admin/UserImagesPage';
import './index.css';

// Add background styles to document
document.documentElement.style.backgroundColor = '#0f172a';
document.body.style.backgroundColor = '#0f172a';
document.body.style.margin = '0';
document.body.style.padding = '0';
document.body.style.fontFamily = 'system-ui, -apple-system, sans-serif';

// Parse URL to determine which page to show
const path = window.location.pathname;
let currentPage: React.ReactNode;

if (path.startsWith('/admin/user/')) {
  // Extract user ID and email from URL
  const parts = path.split('/');
  const userId = parseInt(parts[3]);
  const userEmail = decodeURIComponent(parts[4] || '');
  
  currentPage = <UserImagesPage userId={userId} userEmail={userEmail} />;
} else {
  // Default to users page
  currentPage = <UsersPage />;
}

const container = document.getElementById('root');
if (!container) throw new Error('Root element not found');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    {currentPage}
  </React.StrictMode>
);

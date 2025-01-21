import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

localStorage.setItem('firstname', 'jean');
localStorage.setItem('lastname', 'neymar');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <App />
  </StrictMode>
);

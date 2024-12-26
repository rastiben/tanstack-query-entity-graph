import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { QueryClientProvider } from '@tanstack/react-query';
import { QueryClient } from '@tanstack/react-query';
import { createMutationMiddleware } from './lib/middleware.ts';

const queryClient = new QueryClient();
createMutationMiddleware(queryClient, {
  Name: { name: 'name', invalidate: ['firstname', 'lastname'] },
});

localStorage.setItem('firstname', 'jean');
localStorage.setItem('lastname', 'neymar');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);

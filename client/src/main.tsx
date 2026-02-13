import './index.css';
import { router } from '@/routes/routes';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { ContextApp } from '@/contexts/Context';
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')!).render(
  <ContextApp>
    <RouterProvider router={router} />
    <Toaster position="top-right" reverseOrder={false} />
  </ContextApp>
)
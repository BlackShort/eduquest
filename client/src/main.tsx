import { Suspense } from "react";
import '@/index.css';
import { router } from '@/routes/routes';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { ContextApp } from '@/contexts/Context';
import { Toaster } from 'react-hot-toast';
import { Loader } from '@/components/site/loader';

createRoot(document.getElementById('root')!).render(
  <ContextApp>
    <Suspense fallback={<Loader />}>
      <RouterProvider router={router} />
    </Suspense>
    <Toaster position="top-right" reverseOrder={false} />
  </ContextApp>
)
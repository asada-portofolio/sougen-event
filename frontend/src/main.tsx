import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import './index.css'

// Defer non-critical font weights so they do not bloat the critical initial CSS bundle
const loadSecondaryFonts = () => {
  import('@fontsource/inter/latin-500.css');
  import('@fontsource/inter/latin-600.css');
  import('@fontsource/inter/latin-700.css');
  import('@fontsource/poppins/latin-600.css');
  import('@fontsource/poppins/latin-800.css');
};

if (typeof window !== 'undefined') {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(loadSecondaryFonts, { timeout: 2000 });
  } else {
    setTimeout(loadSecondaryFonts, 100);
  }
}

import { HelmetProvider } from 'react-helmet-async'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>,
)
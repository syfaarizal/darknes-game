import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { configureAssetBaseUrl } from '@darknes/assets';
import { App } from './app/App';
import './styles/index.css';

// Real art/audio files live in `public/assets/**` and are served from `/assets`.
configureAssetBaseUrl('/assets');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

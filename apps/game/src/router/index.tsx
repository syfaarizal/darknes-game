import { createHashRouter } from 'react-router-dom';
import { Splash } from '../pages/Splash';
import { MainMenu } from '../pages/MainMenu';
import { Intro } from '../pages/Intro';
import { IdentitySetup } from '../pages/IdentitySetup';
import { Game } from '../pages/Game';
import { Pause } from '../pages/Pause';
import { Settings } from '../pages/Settings';
import { Load } from '../pages/Load';
import { Save } from '../pages/Save';
import { Ending } from '../pages/Ending';
import { Credits } from '../pages/Credits';

/**
 * Hash router — DARKNES is a desktop-first, potentially file:// or static-host
 * deployed app, so avoiding server-side route config keeps deploy trivial.
 */
export const router = createHashRouter([
  { path: '/', element: <Splash /> },
  { path: '/menu', element: <MainMenu /> },
  { path: '/intro', element: <Intro /> },
  { path: '/identity', element: <IdentitySetup /> },
  { path: '/game', element: <Game /> },
  { path: '/pause', element: <Pause /> },
  { path: '/settings', element: <Settings /> },
  { path: '/load', element: <Load /> },
  { path: '/save', element: <Save /> },
  { path: '/ending', element: <Ending /> },
  { path: '/credits', element: <Credits /> },
]);

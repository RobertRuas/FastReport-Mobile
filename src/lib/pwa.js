import { app } from './state.svelte.js';

// Modo offline: só existe em HTTPS (ou localhost).
let waiting = null;
export function applyUpdate() {
  waiting?.postMessage('skipWaiting');
}
export function registerServiceWorker() {
  if (!('serviceWorker' in navigator) || !import.meta.env.PROD) return;
  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('./sw.js');
      const track = (w) => {
        if (!w) return;
        w.addEventListener('statechange', () => {
          if (w.state === 'installed' && navigator.serviceWorker.controller) { waiting = w; app.updateReady = true; }
        });
      };
      if (reg.waiting && navigator.serviceWorker.controller) { waiting = reg.waiting; app.updateReady = true; }
      track(reg.installing);
      reg.addEventListener('updatefound', () => track(reg.installing));
      let reloaded = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!reloaded) { reloaded = true; location.reload(); }
      });
      document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') reg.update().catch(() => {}); });
    } catch (e) {
      console.warn('sw', e);
    }
  });
}

export const offlineCapable = () => 'serviceWorker' in navigator && window.isSecureContext;

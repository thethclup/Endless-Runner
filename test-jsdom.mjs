import { JSDOM } from 'jsdom';

(async () => {
  const dom = await JSDOM.fromURL('http://localhost:3000/', {
    runScripts: 'dangerously',
    resources: 'usable'
  });

  dom.window.document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded');
  });

  dom.window.addEventListener('error', (event) => {
    console.error('Window error:', event.message, event.error);
  });
  
  dom.window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled rejection:', event.reason);
  });

  setTimeout(() => {
    console.log('Done waiting');
    process.exit(0);
  }, 3000);
})();

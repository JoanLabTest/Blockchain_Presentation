/* Legacy entry point kept for pages that still include search-engine.js.
 * The site search now lives in /js/dcm-search-engine.js (full-site index);
 * this shim only loads it, so there is a single search UI and a single Ctrl+K handler. */
(function () {
    if (window.dcmSearchEngineLoaded || document.querySelector('script[src="/js/dcm-search-engine.js"]')) return;
    var s = document.createElement('script');
    s.src = '/js/dcm-search-engine.js';
    s.async = true;
    document.head.appendChild(s);
})();

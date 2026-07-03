// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// @ts-nocheck
import {EXPORT_HTML_MAP_MODES, KEPLER_GL_VERSION} from '@kepler.gl/constants';

// Default location of html-guard.min.js.
// TESTING: relative path — place html-guard.min.js in the same folder as the
// exported HTML file (or adjust the path below to match your local layout).
// PRODUCTION: swap this to your CDN URL once you've uploaded the file, e.g.
//   'https://cdn.yourdomain.com/vendor/html-guard.min.js'
// Either way, you can always override per-export via options.htmlGuardUrl
// without touching this constant.
const DEFAULT_HTML_GUARD_URL = 'https://assets.allpings.com/html-guard.js';

export const exportMapToHTML = (options, version = KEPLER_GL_VERSION) => {
  const isReadMode = options.mode === EXPORT_HTML_MAP_MODES.READ;

  // Set options.protect = false to ship an export with no anti-copy layer
  // (e.g. for internal/debug builds).
  const protectEnabled = options.protect !== false;
  const htmlGuardUrl = options.htmlGuardUrl || DEFAULT_HTML_GUARD_URL;

  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8"/>
    <title>Geosense</title>

    ${
      protectEnabled
        ? `<!-- HTML Guard: obfuscation + anti-copy annoyance tactics. Load first, before anything else. -->
    <script src="${htmlGuardUrl}"></script>
    <script>
      (function () {
        if (typeof HtmlGuard === 'undefined') return; // fail open if CDN blocked/offline

        // Reload the page if DevTools is opened
        HtmlGuard.protections.antiDevTools();

        // Disable right-click context menu
        HtmlGuard.protections.blockContextMenu();

        // Disable dragging elements (images, map tiles, etc.) out of the page
        HtmlGuard.protections.blockDrag();

        // Disable text/element selection
        HtmlGuard.protections.blockSelection();

        // Silence console.log/debug/warn/error/dir/etc.
        HtmlGuard.protections.blockConsoleOutput();
      })();
    </script>
    <!-- Shortcut-key blocker: HtmlGuard doesn't ship one, so this is custom. -->
    <!-- Covers Windows/Linux (Ctrl) and macOS (Cmd/Meta) across Chrome/Edge/Firefox/Safari. -->
    <script>
      (function () {
        document.addEventListener('keydown', function (e) {
          var k = (e.key || '').toLowerCase();
          var ctrlOrCmd = e.ctrlKey || e.metaKey;
          var block = Boolean(
            e.key === 'F12' ||
            // DevTools / console / network panel:
            // Win-Linux Chrome & Firefox = Ctrl+Shift+I/J/C/K/E/M, Mac = Cmd+Opt+I/J/C
            (e.shiftKey && ctrlOrCmd && ['i', 'j', 'c', 'k', 'e', 'm'].indexOf(k) !== -1) ||
            (e.altKey && e.metaKey && ['i', 'j', 'c', 'u'].indexOf(k) !== -1) ||
            // View-source / Save page / Print
            (ctrlOrCmd && !e.shiftKey && ['u', 's', 'p'].indexOf(k) !== -1)
          );
          if (block) {
            e.preventDefault();
            e.stopPropagation();
            return false;
          }
        }, { capture: true });
      })();
    </script>`
        : ''
    }

    <!--Uber Font-->
    <link rel="stylesheet" href="https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/uber-fonts/4.0.0/superfine.css">

    <!--Kepler css-->
    <link href="https://unpkg.com/kepler.gl@${version}/umd/keplergl.min.css" rel="stylesheet">

    <!--MapBox css-->
    <link href="https://api.tiles.mapbox.com/mapbox-gl-js/v1.1.1/mapbox-gl.css" rel="stylesheet">
    <link href="https://unpkg.com/maplibre-gl@^3/dist/maplibre-gl.css" rel="stylesheet">

    <!-- Load React/Redux -->
    <script src="https://unpkg.com/react@18.3.1/umd/react.production.min.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js" crossorigin></script>
    <script src="https://unpkg.com/redux@4.2.1/dist/redux.js" crossorigin></script>
    <script src="https://unpkg.com/react-redux@8.1.2/dist/react-redux.min.js" crossorigin></script>
    <script src="https://unpkg.com/styled-components@6.1.8/dist/styled-components.min.js" crossorigin></script>

    <!-- Load Kepler.gl -->
    <script src="https://unpkg.com/kepler.gl@${version}/umd/keplergl.min.js" crossorigin></script>

    <style type="text/css">
      body {margin: 0; padding: 0; overflow: hidden;}

      /* ===== REMOVE KEPLER + MAPLIBRE ATTRIBUTION COMPLETELY ===== */

      /* Kepler wrapper */
      [class*="maplibre-attribution-container"] {
        display: none !important;
      }

      [class*="mapbox-attribution-container"] {
        display: none !important;
      }

      /* Backup: MapLibre native */
      .maplibregl-ctrl-attrib,
      .mapboxgl-ctrl-attrib {
        display: none !important;
      }

      /* Remove bottom-right control container */
      .maplibregl-ctrl-bottom-right,
      .mapboxgl-ctrl-bottom-right {
        display: none !important;
      }

      /* ================= MAP LOADER ================= */

      #geosense-loader {
        position: fixed;
        inset: 0;
        background: #0b0f14;
        z-index: 10000000;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: opacity .45s ease, visibility .45s ease;
      }

      #geosense-loader.hidden {
        opacity: 0;
        visibility: hidden;
      }

      .geosense-loader-box {
        text-align: center;
        color: #ffffff;
        font-family: "Uber Move","Helvetica Neue",Arial,sans-serif;
      }

      .geosense-spinner {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        border: 6px solid rgba(255,255,255,0.15);
        border-top: 6px solid #1FBAD6;
        animation: geosenseSpin 1s linear infinite;
        margin: auto;
      }

      .geosense-loader-text {
        margin-top: 18px;
        font-size: 18px;
        letter-spacing: .5px;
        color: #cfd8dc;
      }

      @keyframes geosenseSpin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      /* Ensure our svg uses same sizing as kepler logo */
      .side-panel-logo svg {
        width: 20px !important;
        height: 20px !important;
        display: block;
      }

      /* Keep kepler alignment, but make our link look same */
      .side-panel-logo .logo__link {
        cursor: pointer;
        text-decoration: none;
      }

      /* Hide share/export/save icon */
      #save-action,
      .save-export-dropdown,
      .side-panel__top__actions {
        display: none !important;
      }

      ${
        isReadMode
          ? `
      /* ===== READ MODE ONLY: Geosense top-left brand (match screenshot) ===== */
      #geosense-brand {
        position: fixed;
        top: 8px;
        left: 8px;
        z-index: 999999;

        display: inline-flex;
        align-items: flex-start;
        gap: 8px;

        padding: 8px 12px;
        border-radius: 6px;

        /* prevent hyperlink look */
        text-decoration: none !important;
        outline: none;
        border: none;
        cursor: pointer;
        user-select: none;
      }

      #geosense-brand:hover,
      #geosense-brand:focus,
      #geosense-brand:active {
        text-decoration: none !important;
        outline: none;
      }

      #geosense-brand svg {
        width: 20px;
        height: 20px;
        display: block;
        margin-top: 2px;
        flex: 0 0 auto;
      }

      #geosense-brand .brand-text {
        display: flex;
        flex-direction: column;
        gap: 4px;
        line-height: 1;
      }

      #geosense-brand .brand-name {
        font-family: "Uber Move", "Helvetica Neue", Arial, sans-serif;
        font-size: 14px;
        font-weight: 700;
        line-height: 1;
        color: #1FBAD6; /* teal like screenshot */
      }

      #geosense-brand .brand-version {
        font-family: "Uber Move", "Helvetica Neue", Arial, sans-serif;
        font-size: 11px;
        font-weight: 500;
        line-height: 1;
        color: #7A8A95; /* gray like screenshot */
      }
      `
          : ''
      }
    </style>

    <script>
      const MAPBOX_TOKEN = '${options.mapboxApiAccessToken || 'PROVIDE_MAPBOX_TOKEN'}';
      const WARNING_MESSAGE =
        'Please Provide a Mapbox Token in order to use Kepler.gl. Edit this file and fill out MAPBOX_TOKEN with your access key';

      /**
       * Replace existing kepler logo (WRITE MODE ONLY)
       * - Keep original DOM container: .side-panel-logo
       * - Replace SVG only (keep kepler style colors)
       * - Replace label + version text
       * - Keep clickable <a> tag
       *
       * IMPORTANT: This should NOT run in READ mode
       */
      function replaceKeplerLogoWriteModeOnly() {
        if (${isReadMode}) return false;

        const logoRoot =
          document.querySelector('.side-panel-logo') ||
          document.querySelector('[class*="side-panel-logo"]');

        if (!logoRoot) return false;

        const linkEl =
          logoRoot.querySelector('a.logo__link') ||
          logoRoot.querySelector('a');

        const versionEl = logoRoot.querySelector('.logo__version');

        // Replace SVG (only if not already replaced)
        const svgEl = logoRoot.querySelector('svg');
        if (svgEl && svgEl.getAttribute('data-geosense-icon') !== 'true') {
          // Keep kepler original color if possible
          let strokeColor = '#1FBAD6';
          try {
            if (linkEl) {
              const c = window.getComputedStyle(linkEl).color;
              if (c && c !== 'rgba(0, 0, 0, 0)') strokeColor = c;
            }
          } catch (e) {}

          svgEl.outerHTML = \`
            <svg
              data-geosense-icon="true"
              width="20px"
              height="20px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="\${strokeColor}"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <ellipse
                cx="12"
                cy="12"
                rx="10"
                ry="4"
                transform="rotate(90 12 12)"
                stroke="\${strokeColor}"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M2 12H22"
                stroke="\${strokeColor}"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          \`;
        }

        // Replace text + make clickable
        if (linkEl) {
          linkEl.textContent = 'Geosense';
          linkEl.setAttribute('href', 'https://geosense.allpings.com');
          linkEl.setAttribute('target', '_blank');
          linkEl.setAttribute('rel', 'noopener noreferrer');
        }

        // Replace version
        if (versionEl) {
          versionEl.textContent = '3.2.0';
        }

        return true;
      }

      /**
       * READ MODE ONLY: Create fixed top-left brand like screenshot
       * (No dependency on side panel DOM)
       */
      function ensureReadModeBrand() {
        if (!${isReadMode}) return false;

        if (document.getElementById('geosense-brand')) return true;

        const a = document.createElement('a');
        a.id = 'geosense-brand';
        a.href = 'https://geosense.allpings.com';
        a.target = '_blank';
        a.rel = 'noopener noreferrer';

        a.innerHTML = \`
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="#1FBAD6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(90 12 12)" stroke="#1FBAD6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 12H22" stroke="#1FBAD6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <div class="brand-text">
            <div class="brand-name">Geosense</div>
            <div class="brand-version">3.2.0</div>
          </div>
        \`;

        document.body.appendChild(a);
        return true;
      }

      /**
       * Watcher (safe for both modes)
       * - Read mode: keeps brand always present
       * - Write mode: replaces kepler side-panel logo and keeps it stable
       */
      function startBrandWatcher() {
        let lastRun = 0;

        const tick = () => {
          const now = Date.now();
          if (now - lastRun < 200) return; // throttle
          lastRun = now;

          // READ mode brand (fixed top-left)
          ensureReadModeBrand();

          // WRITE mode logo replacement (side-panel)
          replaceKeplerLogoWriteModeOnly();
        };

        // initial run
        tick();

        // observe DOM forever (panel open/close recreates logo)
        const observer = new MutationObserver(tick);
        observer.observe(document.body, {childList: true, subtree: true});

        // fallback retry for initial load
        let tries = 0;
        const timer = setInterval(() => {
          tries++;
          tick();
          if (tries > 50) clearInterval(timer);
        }, 200);
      }

      window.addEventListener('load', startBrandWatcher);
    </script>
  </head>

  <body style="position:fixed">
    <!-- Geosense Loader -->
    <div id="geosense-loader">
      <div class="geosense-loader-box">
        <div class="geosense-spinner"></div>
        <div class="geosense-loader-text">Preparing Interactive Map…</div>
      </div>
    </div>
    <div id="app"></div>

    <script>
      if ((MAPBOX_TOKEN || '') === '' || MAPBOX_TOKEN === 'PROVIDE_MAPBOX_TOKEN') {
        alert(WARNING_MESSAGE);
      }

      /** STORE **/
      const reducers = (function createReducers(redux, keplerGl) {
        return redux.combineReducers({
          keplerGl: keplerGl.keplerGlReducer.initialState({
            uiState: {
              readOnly: ${isReadMode},
              currentModal: null
            }
          })
        });
      }(Redux, KeplerGl));

      const middleWares = (function createMiddlewares(keplerGl) {
        return keplerGl.enhanceReduxMiddleware([]);
      }(KeplerGl));

      const enhancers = (function createEnhancers(redux, middles) {
        return redux.applyMiddleware(...middles);
      }(Redux, middleWares));

      const store = (function createStore(redux, enhancers) {
        const initialState = {};
        return redux.createStore(
          reducers,
          initialState,
          redux.compose(enhancers)
        );
      }(Redux, enhancers));
      /** END STORE **/

      /** COMPONENT **/
      var KeplerElement = (function makeKeplerElement(react, keplerGl, mapboxToken) {
        return function App() {
          var _useState = react.useState({
            width: window.innerWidth,
            height: window.innerHeight
          });
          var windowDimension = _useState[0];
          var setDimension = _useState[1];

          react.useEffect(function sideEffect(){
            function handleResize() {
              setDimension({width: window.innerWidth, height: window.innerHeight});
            }
            window.addEventListener('resize', handleResize);
            return function() {window.removeEventListener('resize', handleResize);};
          }, []);

          return react.createElement(
            'div',
            {style: {position: 'absolute', left: 0, width: '100vw', height: '100vh'}},
            react.createElement(keplerGl.KeplerGl, {
              mapboxApiAccessToken: mapboxToken,
              id: "map",
              width: windowDimension.width,
              height: windowDimension.height
            })
          );
        };
      }(React, KeplerGl, MAPBOX_TOKEN));

      const app = (function createReactReduxProvider(react, reactRedux, KeplerElement) {
        return react.createElement(
          reactRedux.Provider,
          {store: store},
          react.createElement(KeplerElement, null)
        );
      }(React, ReactRedux, KeplerElement));

      /** Render **/
      (function render(reactDOM, app) {
        const container = document.getElementById('app');
        const root = reactDOM.createRoot(container);
        root.render(app);
      }(ReactDOM, app));
    </script>

    <!-- Loader -->
    <script>
(function () {

  function hideLoaderWhenKeplerReady() {

    // Kepler UI root (always appears even with empty data)
    const keplerRoot =
      document.querySelector('#app .kepler-gl') ||
      document.querySelector('#app > div > div');

    if (keplerRoot) {

      const loader = document.getElementById("geosense-loader");
      if (loader) {
        loader.classList.add("hidden");
        setTimeout(() => loader.remove(), 500);
      }
      return;
    }

    requestAnimationFrame(hideLoaderWhenKeplerReady);
  }

  // start after render
  window.addEventListener("load", function () {
    setTimeout(hideLoaderWhenKeplerReady, 300);
  });

})();
</script>
    

    <!-- Load data + config -->
    <script>
      (function customize(keplerGl, store) {
        const datasets = ${JSON.stringify(options.datasets)};
        const config = ${JSON.stringify(options.config)};

        const loadedData = keplerGl.KeplerGlSchema.load(datasets, config);

        window.setTimeout(() => {
          store.dispatch(
            keplerGl.addDataToMap({
              datasets: loadedData.datasets,
              config: loadedData.config,
              options: {centerMap: false}
            })
          );
        }, 100);
      }(KeplerGl, store));
    </script>
  </body>
</html>
`;
};
// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// @ts-nocheck
import {EXPORT_HTML_MAP_MODES, KEPLER_GL_VERSION} from '@kepler.gl/constants';

export const exportMapToHTML = (options, version = KEPLER_GL_VERSION) => {
  const isReadMode = options.mode === EXPORT_HTML_MAP_MODES.READ;

  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8"/>
    <title>Geosense</title>

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

  <body>
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
        }, 500);
      }(KeplerGl, store));
    </script>
  </body>
</html>
`;
};

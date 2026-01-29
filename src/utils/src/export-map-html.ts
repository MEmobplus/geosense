// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

// @ts-nocheck
import {EXPORT_HTML_MAP_MODES, KEPLER_GL_VERSION} from '@kepler.gl/constants';

/**
 * This method is used to create an html file which will inlcude kepler and map data
 * @param {Object} options Object that collects all necessary data to  create the html file
 * @param {string} options.mapboxApiAccessToken Mapbox token used to fetch mapbox tiles
 * @param {Array<Object>} options.datasets Data to include in the map
 * @param {Object} options.config this object will contain the full kepler.gl instance configuration {mapState, mapStyle, visState}
 * @param {string} version which version of Kepler.gl to load.
 */
export const exportMapToHTML = (options, version = KEPLER_GL_VERSION) => {
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

        <!-— facebook open graph tags -->
        <meta property="og:url" content="http://kepler.gl/" />
        <meta property="og:title" content="Large-scale WebGL-powered Geospatial Data Visualization Tool" />
        <meta property="og:description" content="Kepler.gl is a powerful web-based geospatial data analysis tool. Built on a high performance rendering engine and designed for large-scale data sets." />
        <meta property="og:site_name" content="kepler.gl" />
        <meta property="og:image" content="https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/kepler.gl-meta-tag.png" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="800" />
        <meta property="og:image:height" content="800" />

        <!-— twitter card tags -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:site" content="@openjsf">
        <meta name="twitter:creator" content="@openjsf">
        <meta name="twitter:title" content="Large-scale WebGL-powered Geospatial Data Visualization Tool">
        <meta name="twitter:description" content="Kepler.gl is a powerful web-based geospatial data analysis tool. Built on a high performance rendering engine and designed for large-scale data sets.">
        <meta name="twitter:image" content="https://d1a3f4spazzrp4.cloudfront.net/kepler.gl/kepler.gl-meta-tag.png" />

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
        </style>

        <!--MapBox token-->
        <script>
          /**
           * Provide your MapBox Token
           **/
          const MAPBOX_TOKEN = '${options.mapboxApiAccessToken || 'PROVIDE_MAPBOX_TOKEN'}';
          const WARNING_MESSAGE = 'Please Provide a Mapbox Token in order to use Kepler.gl. Edit this file and fill out MAPBOX_TOKEN with your access key';
        </script>

        <!-- GA: Delete this as you wish, However to pat ourselves on the back, we only track anonymous pageview to understand how many people are using kepler.gl. -->
        <script>
          (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
          (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
          m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
          })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
          ga('create', 'UA-64694404-19', {
            'storage': 'none',
            'clientId': localStorage.getItem('ga:clientId')
          });
          ga(function(tracker) {
              localStorage.setItem('ga:clientId', tracker.get('clientId'));
          });
          ga('set', 'checkProtocolTask', null); // Disable file protocol checking.
          ga('set', 'checkStorageTask', null); // Disable cookie storage checking.
          ga('set', 'historyImportTask', null); // Disable history checking (requires reading from cookies).
          ga('set', 'page', 'keplergl-html');
          ga('send', 'pageview');
        </script>
      </head>
      <body>
        <!-- We will put our React component inside this div. -->
        <div id="app">
          <!-- Kepler.gl map will be placed here-->
        </div>

        <!-- Load our React component. -->
        <script>
          /* Validate Mapbox Token */
          if ((MAPBOX_TOKEN || '') === '' || MAPBOX_TOKEN === 'PROVIDE_MAPBOX_TOKEN') {
            alert(WARNING_MESSAGE);
          }

          /** STORE **/
          const reducers = (function createReducers(redux, keplerGl) {
            return redux.combineReducers({
              // mount keplerGl reducer
              keplerGl: keplerGl.keplerGlReducer.initialState({
                uiState: {
                  readOnly: ${options.mode === EXPORT_HTML_MAP_MODES.READ},
                  currentModal: null
                }
              })
            });
          }(Redux, KeplerGl));

          const middleWares = (function createMiddlewares(keplerGl) {
            return keplerGl.enhanceReduxMiddleware([
              // Add other middlewares here
            ]);
          }(KeplerGl));

          const enhancers = (function craeteEnhancers(redux, middles) {
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

          /** COMPONENTS **/
          var KeplerElement = (function makeKeplerElement(react, keplerGl, mapboxToken) {
            const LogoSvg = () =>
            react.createElement(
              "div",
              {
                className: "logo-container",
                style: { position: "fixed", zIndex: 10000, padding: "4px" }
              },
              react.createElement(
                "svg",
                {
                  width: "20px",
                  height: "20px",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  xmlns: "http://www.w3.org/2000/svg"
                },
                react.createElement("circle", {
                  cx: "12",
                  cy: "12",
                  r: "10",
                  stroke: "#ffffff",
                  strokeWidth: "2",
                  strokeLinecap: "round",
                  strokeLinejoin: "round"
                }),
                react.createElement("ellipse", {
                  cx: "12",
                  cy: "12",
                  rx: "10",
                  ry: "4",
                  transform: "rotate(90 12 12)",
                  stroke: "#ffffff",
                  strokeWidth: "2",
                  strokeLinecap: "round",
                  strokeLinejoin: "round"
                }),
                react.createElement("path", {
                  d: "M2 12H22",
                  stroke: "#ffffff",
                  strokeWidth: "2",
                  strokeLinecap: "round",
                  strokeLinejoin: "round"
                })
              )
            );

            return function App() {
              var rootElm = react.useRef(null);
              var _useState = react.useState({
                width: window.innerWidth,
                height: window.innerHeight
              });
              var windowDimension = _useState[0];
              var setDimension = _useState[1];
              react.useEffect(function sideEffect(){
                function handleResize() {
                  setDimension({width: window.innerWidth, height: window.innerHeight});
                };
                window.addEventListener('resize', handleResize);
                return function() {window.removeEventListener('resize', handleResize);};
              }, []);
              return react.createElement(
                'div',
                {style: {position: 'absolute', left: 0, width: '100vw', height: '100vh'}},
                ${options.mode === EXPORT_HTML_MAP_MODES.READ ? 'LogoSvg(),' : ''}
                react.createElement(keplerGl.KeplerGl, {
                  mapboxApiAccessToken: mapboxToken,
                  id: "map",
                  width: windowDimension.width,
                  height: windowDimension.height
                })
              )
            }
          }(React, KeplerGl, MAPBOX_TOKEN));

          const app = (function createReactReduxProvider(react, reactRedux, KeplerElement) {
            return react.createElement(
              reactRedux.Provider,
              {store},
              react.createElement(KeplerElement, null)
            )
          }(React, ReactRedux, KeplerElement));
          /** END COMPONENTS **/

          /** Render **/
          (function render(react, reactDOM, app) {
            const container = document.getElementById('app');
            const root = reactDOM.createRoot(container);
            root.render(app);
          }(React, ReactDOM, app));
        </script>
        <!-- The next script will show how to interact directly with Kepler map store -->
        <script>
          /**
           * Customize map.
           * In the following section you can use the store object to dispatch Kepler.gl actions
           * to add new data and customize behavior
           */
          (function customize(keplerGl, store) {
            const datasets = ${JSON.stringify(options.datasets)};
            const config = ${JSON.stringify(options.config)};

            const loadedData = keplerGl.KeplerGlSchema.load(
              datasets,
              config
            );

            // For some reason Kepler overwrites the config without extra wait time
            window.setTimeout(() => {
              store.dispatch(
                keplerGl.addDataToMap({
                  datasets: loadedData.datasets,
                  config: loadedData.config,
                  options: {
                    centerMap: false,
                  },
                })
              );
            }, 500);
          }(KeplerGl, store))
        </script>
      </body>
    </html>
  `;
};

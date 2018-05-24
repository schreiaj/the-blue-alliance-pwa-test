const path = require('path');
const React = require('react');
const { Provider } = require('react-redux');
const { StaticRouter } = require('react-router');
const ReactDOMServer = require('react-dom/server');
import { Map } from 'immutable'
import JssProvider from 'react-jss/lib/JssProvider';
import { SheetsRegistry } from 'react-jss/lib/jss';
import { createGenerateClassName } from '@material-ui/core/styles';
import Helmet from 'react-helmet';

const { createStore, applyMiddleware } = require('redux');

import thunk from 'redux-thunk'
import { createReactAppExpress } from '@cra-express/core';
import { getInitialData } from '@cra-express/redux-prefetcher'
import stringRenderer from '@cra-express/universal-loader/lib/renderer/string-renderer';

const {default: TBAApp} = require('../../src/TBAApp');
const {default: reducer} = require('../../src/reducers');
const clientBuildPath = path.resolve(__dirname, 'client');

const sheetsRegistry = new SheetsRegistry();
const generateClassName = createGenerateClassName();
const app = createReactAppExpress({
  clientBuildPath,
  handleRender: stringRenderer,
  universalRender: handleUniversalRender,
  onFinish(req, res, html) {
    const helmet = Helmet.renderStatic();
    const css = sheetsRegistry.toString()
    const tags = helmet.title.toString() +
        helmet.meta.toString() +
        helmet.link.toString()
    res.send(html.replace(
      '<!--{{SERVER_STYLES}}-->', `<style id="jss-server-side">${css}</style>`).replace(
      '<!--{{HELMET_TAGS}}-->', tags)
    );
  },
});

function handleUniversalRender(req, res) {
  const context = {};
  const initialState = Map()
  const store = createStore(
    reducer,
    initialState,
    applyMiddleware(thunk),
  )
  const expressCtx = { req, res };
  return getInitialData(expressCtx, store, [])  // TODO
    .then(result => {
      const app = (
        <Provider store={store}>
          <StaticRouter location={req.url} context={context}>
            <JssProvider registry={sheetsRegistry} generateClassName={generateClassName}>
              <TBAApp />
            </JssProvider>
          </StaticRouter>
        </Provider>
      );
      // return getLoadableState(app).then(loadableState => {
      //   tag = loadableState.getScriptTag();
      //   return ReactDOMServer.renderToNodeStream(app);
      // });
      return ReactDOMServer.renderToString(app);
    })
    .catch(err => {
      console.error(err);
      res.send(500);
    });
}

module.exports = app;

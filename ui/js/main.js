import React from "react";
import ReactDOM from "react-dom";
import lbry from "./lbry.js";
import App from "component/app/index.js";
import SnackBar from "component/snackBar";
import { Provider } from "react-redux";
import store from "store.js";
import SplashScreen from "component/splash.js";
import AuthOverlay from "component/authOverlay";
import { doChangePath, doNavigate, doDaemonReady } from "actions/app";
import { toQueryString } from "util/query_params";

const env = ENV;
const { remote, ipcRenderer, shell } = require("electron");
const contextMenu = remote.require("./menu/context-menu");
const app = require("./app");

lbry.showMenuIfNeeded();

window.addEventListener("contextmenu", event => {
  contextMenu.showContextMenu(
    remote.getCurrentWindow(),
    event.x,
    event.y,
    lbry.getClientSetting("showDeveloperMenu")
  );
  event.preventDefault();
});

window.addEventListener("popstate", (event, param) => {
  const params = event.state;
  const pathParts = document.location.pathname.split("/");
  const route = "/" + pathParts[pathParts.length - 1];
  const queryString = toQueryString(params);

  let action;
  if (route.match(/html$/)) {
    action = doChangePath("/discover");
  } else {
    action = doChangePath(`${route}?${queryString}`);
  }

  app.store.dispatch(action);
});

ipcRenderer.on("open-uri-requested", (event, uri) => {
  if (uri && uri.startsWith("lbry://")) {
    app.store.dispatch(doNavigate("/show", { uri }));
  }
});

document.addEventListener("click", event => {
  var target = event.target;
  while (target && target !== document) {
    if (
      target.matches('a[href^="http"]') ||
      target.matches('a[href^="mailto"]')
    ) {
      event.preventDefault();
      shell.openExternal(target.href);
      return;
    }
    target = target.parentNode;
  }
});

const initialState = app.store.getState();

// import whyDidYouUpdate from "why-did-you-update";
// if (env === "development") {
//   /*
// 		https://github.com/garbles/why-did-you-update
// 		"A function that monkey patches React and notifies you in the console when
// 		potentially unnecessary re-renders occur."
//
// 		Just checks if props change between updates. Can be fixed by manually
// 		adding a check in shouldComponentUpdate or using React.PureComponent
// 	*/
//   whyDidYouUpdate(React);
// }

var init = function() {
  function onDaemonReady() {
    window.sessionStorage.setItem("loaded", "y"); //once we've made it here once per session, we don't need to show splash again
    app.store.dispatch(doDaemonReady());

    ReactDOM.render(
      <Provider store={store}>
        <div><AuthOverlay /><App /><SnackBar /></div>
      </Provider>,
      canvas
    );
  }

  if (window.sessionStorage.getItem("loaded") == "y") {
    onDaemonReady();
  } else {
    ReactDOM.render(<SplashScreen onLoadDone={onDaemonReady} />, canvas);
  }
};

init();

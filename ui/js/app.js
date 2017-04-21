import store from 'store';

const env = process.env.NODE_ENV || 'development';
const logs = [];
const app = {
  env: env,
  store: store,
  logs: logs,
  log: function(message) {
    console.log(message);
    logs.push(message);
  }
}
global.app = app;
module.exports = app;

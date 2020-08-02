const files = require.context(".", true, /\.js$/);
const modules = {};
files.keys().forEach(key => {
  if (key !== "./index.js") {
    const moduleName = key.split("/")[1].split(".")[0];
    modules[moduleName] = files(key).default;
  }
});

export default modules;

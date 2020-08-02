import Vue from "vue";
const files = require.context(".", true, /\.vue$/);

files.keys().forEach(key => {
  if (key.includes("Etf")) {
    const componentConfig = files(key);
    const name =
      key.name || key.replace(/^\.\/(.*\/)?/, "").replace(/\.vue$/, "");
    if (/^Etf/.test(name)) {
      Vue.component(name, componentConfig.default || componentConfig);
    }
  }
});

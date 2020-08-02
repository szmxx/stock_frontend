import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "@/components";
import PerfectScrollbar from "vue2-perfect-scrollbar";
import "vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css";
import ViewUI from "view-design/dist/iview";
// import style
import "view-design/dist/styles/iview.css";
// import ol style
import "ol/ol.css";
import initAppConfig from "./initConfig";
import "./permission";
// Vue.config.productionTip = false;
Vue.use(PerfectScrollbar);
Vue.use(ViewUI);

(async function() {
  await initAppConfig();
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount("#app");
})();

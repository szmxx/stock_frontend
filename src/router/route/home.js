export default {
  path: "/home",
  name: "Home",
  component: () => import(/* webpackChunkName:"Home" */ "@/views/Home")
};

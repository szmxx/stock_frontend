export default {
  path: "/exponentlist",
  name: "ExponentList",
  component: () =>
    import(/*webpackChunkName:"ExponentList" */ "@/views/ExponentList"),
  meta: {}
};

export default {
  path: "/boardlist",
  name: "BoardList",
  component: () =>
    import(/* webpackChunkName:"BoardList" */ "@/views/BoardList"),
  meta: {}
};

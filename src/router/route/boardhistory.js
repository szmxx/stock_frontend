export default {
  path: "/boardhistory",
  name: "BoardHistory",
  component: () =>
    import(/*webpackChunkName:"BoardHistory"*/ "@/views/BoardHistory")
};

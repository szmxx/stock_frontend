const routes = {
  path: "/realtimeband",
  name: "RealTimeBand",
  component: () =>
    import(/* webpackChunkName: "RealTimeBand" */ "@/views/RealTimeBand"),
  children: []
};

export default routes;

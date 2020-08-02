const routes = {
  path: "/example",
  name: "Example",
  component: () => import(/* webpackChunkName: "Example" */ "@/views/Example"),
  children: []
};

export default routes;

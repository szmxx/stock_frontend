import example from "./example";
import home from "./home";
import Login from "@/views/Login";
import Portal from "@/views/Portal";
import Registry from "@/views/Registry";
import NotFound from "@/views/NotFound";
import boardlist from "./boardlist";
import boardhistory from "./boardhistory";
import exponentlist from "./exponentlist";
import realtimeband from "./realtimeband";
const routes = [
  {
    path: "/",
    redirect: "/portal",
    name: "Base"
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/portal",
    name: "Portal",
    component: Portal
  },
  {
    path: "/registry",
    name: "Registry",
    component: Registry
  },
  {
    ...example
  },
  {
    ...home
  },
  {
    ...boardlist
  },
  {
    ...boardhistory
  },
  {
    ...exponentlist
  },
  {
    ...realtimeband
  },
  { path: "*", component: NotFound }
];

export default routes;

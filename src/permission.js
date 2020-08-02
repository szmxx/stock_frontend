import router from "./router";
import { getSession } from "@/utils/auth";
import store from "./store";
// 免校检白名单
const whiteList = ["/login", "/registry"];
const hasUserInfo = () => {
  const { userInfo } = store.getters;
  return userInfo && Object.keys(userInfo).length;
};
router.beforeEach(async (to, from, next) => {
  if (getSession()) {
    if (String(to.path).toLowerCase() === "/login") {
      next({ path: "/" });
    } else {
      if (hasUserInfo()) {
        next();
      } else {
        await store.dispatch("getUserInfo");
        next({ path: to.path });
      }
    }
  } else {
    if (whiteList.indexOf(String(to.path.toLowerCase())) > -1) {
      next();
    } else {
      next(`/login`);
    }
  }
});

import { SET_USERINFO } from "../types";
import { login, getUserInfo, layout } from "@/api/user";
import { addCookies, removeCookies } from "@/utils/auth";
const user = {
  state: {
    userInfo: {}
  },
  mutations: {
    [SET_USERINFO](state, userInfo) {
      state.userInfo = userInfo;
    }
  },
  actions: {
    async userLogin({ commit }, { username, password }) {
      const res = await login({
        name: username || "",
        password: password || ""
      });
      if (res && res.userInfo) {
        commit(SET_USERINFO, res.userInfo);
        addCookies(res.userInfo.code);
        return {
          status: res.status,
          message: res.message
        };
      } else {
        return {
          status: res.status,
          message: res.message
        };
      }
    },
    async getUserInfo({ commit }) {
      let res = await getUserInfo();
      if (res.status === "success") {
        commit(SET_USERINFO, res.userInfo);
      }
    },
    async userLayout({ commit }) {
      await layout();
      commit(SET_USERINFO, {});
      removeCookies();
    }
  },
  getters: {
    userInfo: state => {
      return state.userInfo;
    }
  }
};
export default user;

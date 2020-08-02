import { SET_SYSNAME } from "../types";
const system = {
  state: {
    sysname: ""
  },
  mutations: {
    [SET_SYSNAME](state, name) {
      state.sysname = name;
    }
  },
  actions: {
    async setSysName({ commit }, { name }) {
      commit(SET_SYSNAME, name);
    }
  },
  getters: {
    sysname: state => {
      return state.sysname;
    }
  }
};
export default system;

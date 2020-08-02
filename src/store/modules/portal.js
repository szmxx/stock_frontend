import { SET_PORTAL_LIST } from "../types";
import { getPortalListByUserID } from "@/api/portal";
const portal = {
  state: {
    portalList: []
  },
  mutations: {
    [SET_PORTAL_LIST](state, portalList) {
      state.portalList = portalList;
    }
  },
  actions: {
    async getPortalList({ commit }, { list }) {
      let res = await getPortalListByUserID();
      let result = res.list.concat(list);
      commit(SET_PORTAL_LIST, result);
      return result;
    }
  },
  getters: {
    portalList: state => {
      return state.portalList;
    }
  }
};
export default portal;

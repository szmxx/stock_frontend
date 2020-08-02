import { JGET } from "@/plugins";
export const getPortalListByUserID = () => {
  return JGET("static/portal/config.json", "获取portal页配置文件");
};

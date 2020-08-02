import { JGET } from "@/plugins";

export const getAppConfig = () => {
  return JGET("static/appConfig.json", "获取系统配置文件");
};

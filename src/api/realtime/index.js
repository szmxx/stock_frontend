import { JGET } from "@/plugins";

export const getRealTimeInfo = url => {
  return JGET(url, "获取实时股票信息");
};

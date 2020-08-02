import { getAppConfig } from "@/api/public";
import { initInstance as initAxiosInstance } from "@/plugins";
import store from "./store";
export default async () => {
  const config = await getAppConfig();
  const { BASE_URL, SYSNAME } = config;
  store.dispatch("setSysName", { name: SYSNAME });
  initAxiosInstance(BASE_URL);
};

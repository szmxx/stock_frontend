import { POST, GET } from "@/plugins";

export const login = data => {
  return POST("userLogin", "用户登录验证", data);
};

export const getUserInfo = () => {
  return GET("userInfo", "获取用户信息");
};

export const addFundOrStock = data => {
  return POST("addFundOrStock", "根据类型添加自选股票或基金", data);
};

export const layout = () => {
  return POST("userLayout", "用户登出系统");
};

export const registryAcc = data => {
  return POST("userRegistry", "注册用户", data);
};
export const registrySys = data => {
  return POST("/addPortal", "注册子系统", data);
};

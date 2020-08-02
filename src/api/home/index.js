import { GET, JGET } from "@/plugins";
export const getStockList = params => {
  return GET("/stocklist", "获取股票数据通过名称", params);
};
export const getStockTableNames = () => {
  return GET("/stocktables", "获取所有股票名称");
};
export const getFundTableNames = () => {
  return GET("/fundtables", "获取所有基金名称");
};
export const getHomeConfig = () => {
  return JGET("static/home/config.json", "获取主页配置文件");
};

export const getFundList = data => {
  return JGET("http://api.fund.eastmoney.com/f10/lsjz", data);
};

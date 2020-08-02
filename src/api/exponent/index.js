import { GET } from "@/plugins";

export const getExpontTable50 = () => {
  return GET("stocktables50", "获取所有上证50股票名称");
};
export const getExpontTable300 = () => {
  return GET("stocktables300", "获取所有沪深300股票名称");
};
export const getExpontTableHK = () => {
  return GET("stocktableshk", "获取所有港市股票名称");
};
export const getExpontTableChina = () => {
  return GET("stocktableschina", "获取所有中概股股票名称");
};

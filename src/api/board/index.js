import { GET } from "@/plugins";

export const getConceptList = () => {
  return GET("conceptlist", "获取所有概念板块的每日优质股");
};

export const getIndustryList = () => {
  return GET("industrylist", "获取所有行业板块的每日优质股");
};
export const getConceptRankList = () => {
  return GET("conceptListByDate", "获取概念板块的每日涨停股");
};
export const getIndustryRankList = () => {
  return GET("industryListByDate", "获取行业板块的每日涨停股");
};
export const getIndustryByName = data => {
  return GET("industryListByName", "根据名称获取行业股票信息", data);
};
export const getConceptByName = data => {
  return GET("conceptListByName", "根据名称获取概念股票信息", data);
};

export const getIndustryNameList = () => {
  return GET("getBankIndustryName", "获取所有行业板块名称");
};

export const getConceptNameList = () => {
  return GET("getBankConceptName", "获取所有概念板块名称");
};

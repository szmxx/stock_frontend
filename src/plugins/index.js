import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.crossDomain = true;
const instanceMap = {
  base: null
};
export const initInstance = (BASE_URL = "") => {
  const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 60000 * 3,
    withCredentials: true
  });
  instanceMap.base = instance;
};

const get = (instance, url, serviceName = "未知服务", params, headers = {}) => {
  return new Promise((resolve, reject) => {
    instance({
      url,
      method: "get",
      params,
      headers: headers
    })
      .then(res => {
        resolve(res.data);
      })
      .catch(e => {
        reject(e);
        throw new Error("请求接口" + serviceName + "失败");
      });
  });
};

const post = (
  instance,
  url,
  serviceName = "未知服务",
  params = {},
  headers = {},
  withCredentials = true
) => {
  return new Promise((resolve, reject) => {
    instance({
      url,
      method: "post",
      data: params,
      headers: headers,
      withCredentials
    })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err);
        throw new Error("请求接口---" + serviceName + "---失败");
      });
  });
};

const put = (instance, url, serviceName, params, headers = {}) => {
  return new Promise((resolve, reject) => {
    instance({
      url,
      method: "put",
      data: params,
      headers
    })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err);
        throw new Error("请求接口---" + serviceName + "---失败");
      });
  });
};

const del = (instance, url, serviceName, params, headers = {}) => {
  return new Promise((resolve, reject) => {
    instance({
      url,
      method: "delete",
      data: params,
      headers
    })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err);
        throw new Error("请求接口---" + serviceName + "---失败");
      });
  });
};

export const GET = (path, serviceName = "未知服务", params, headers = {}) => {
  return get(instanceMap.base, path, serviceName, params, headers);
};
export const POST = (
  path,
  serviceName = "未知服务",
  params = {},
  headers = {}
) => {
  return post(instanceMap.base, path, serviceName, params, headers);
};
export const PUT = (path, serviceName = "未知服务", params, headers = {}) => {
  return put(instanceMap.base, path, serviceName, params, headers);
};
export const DELETE = (
  path,
  serviceName = "未知服务",
  params,
  headers = {}
) => {
  return del(instanceMap.base, path, serviceName, params, headers);
};

export const JGET = async (path, serviceName = "未知服务") => {
  try {
    const res = await axios.get(path, {
      headers: {
        "Cache-Control": "no-cache,no-store,must-revalidate"
      }
    });
    return res.data;
  } catch (e) {
    throw new Error("请求接口---" + serviceName + "---失败");
  }
};

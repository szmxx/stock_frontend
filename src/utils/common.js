export const getRandomColor = () => {
  let r = Math.floor(Math.random() * 256),
    g = Math.floor(Math.random() * 256),
    b = Math.floor(Math.random() * 256);
  return "rgb(" + [r, g, b].join(",") + ")";
};

export const isObject = obj => {
  let type = typeof obj;
  return type === "function" || (type === "object" && !!obj);
};
// 判断是否是电脑
export const isPC = () => {
  let userAgentInfo = navigator.userAgent;
  let Agents = new Array(
    "Android",
    "iPhone",
    "SymbianOS",
    "Windows Phone",
    "iPad",
    "iPod"
  );
  let flag = true;
  for (var v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false;
      break;
    }
  }
  return flag;
};
// 过滤带有指定key的数组
export const filterList = (data, key) => {
  if (Array.isArray(data) && data.length > 0) {
    let res = data.reduce((prev, cur) => {
      if (isObject(cur)) {
        let name = cur.name;
        if (name.indexOf(key) > -1) {
          prev.push(cur);
        }
        return prev;
      }
    }, []);
    return res;
  }
  return [];
};
// 设置dom的样式
export const setDomStyle = (dom, attrs) => {
  // attrs = ["position:relative","width:90px"]
  if (Array.isArray(attrs)) {
    dom.style.cssText = attrs.join(";") + ";";
  }
};
// 只复制source自身非继承属性到target上
export const extend = (target, source) => {
  for (let key in source) {
    // eslint-disable-next-line
    if (source.hasOwnProperty(key)) {
      target[key] = source[key];
    }
  }
  return target;
};

export const isArrayLike = data => {
  if (!data) {
    return;
  }
  if (typeof data === "string") {
    return;
  }
  return typeof data.length === "number" ? true : false;
};

// 函数柯里化，curry(func,"firstParams")
export const curry = function(func) {
  let nativeSlice = Array.prototype.slice;
  let args = nativeSlice(arguments, 1);
  return function() {
    return func.apply(this, args.concat(nativeSlice(arguments)));
  };
};

export const isOuterContainer = (container, x, y) => {
  const width = window.getComputeStyle(container).getPropertyValue("width");
  const height = window.getComputedStyle(container).getPropertyValue("height");
  return (
    x < 0 ||
    x > (container.getWidth() || width) ||
    y < 0 ||
    y > (container.getHeight() || height)
  );
};
// 导出第一个有效的参数
export const retrieveValidArgument = function() {
  for (let i = 0; i < arguments.length; i++) {
    if (arguments[i] !== null) {
      return arguments[i];
    }
  }
};
// 获取对象属性,返回函数常用于回调,作为迭代器的回调
export const getShallowProperty = key => {
  return function(obj) {
    // void 0 执行并返回undefined,防止undefined被覆写
    return obj === null ? void 0 : obj[key];
  };
};
// 根据指定路径获取对象值
// {"name":{"age":{"name":{"height":34}}}} [name,age,name,height]
export const deepGet = (obj, path) => {
  let len = path.length;
  for (let i = 0; i < len; i++) {
    if (obj === null) return void 0;
    obj = obj[path[i]];
  }
  return len ? obj : void 0;
};

export const calucateWeek = data => {
  let week = new Date(data).getDay();
  return week;
};

import echarts from "echarts";
import { isObject } from "@/utils/common";

function Echart() {
  this._chart = null;
  this._handlers = {};
}

Echart.prototype = {
  constructor: Echart,
  init: function(dom) {
    this._chart = echarts.init(dom);
    return this._chart;
  },
  // isMerge：false ->和之前的配置项进行合并
  // lazyUpdate:false -> 设置完配置项立即更新
  // 不采取重新设置整个配置项，而是设置部分配置项，因为部分配置项会合并到配置项中，并覆盖原来的
  setOption: function(option, isMerge = false, lazyUpdate = false) {
    if (isObject(option)) {
      this._chart.setOption(option, isMerge, lazyUpdate);
    }
  },
  getWidth: function() {
    // number
    return this._chart.getWidth();
  },
  getHeight: function() {
    // number
    return this._chart.getHeight();
  },
  getDom: function() {
    return this._chart.getDom();
  },
  getOption: function() {
    this._chart.getOption();
  },
  // 在容器大小发生改变时需要手动调用
  resize: function(opts) {
    this._chart.resize(opts);
  },
  dispatchAction: function(type, opts) {
    // let defaultOpts = {
    //   可选，系列 index，可以是一个数组指定多个系列
    //   seriesIndex: number | Array,
    //   可选，系列名称，可以是一个数组指定多个系列
    //   seriesName: string | Array,
    //   可选，数据的 index
    //   dataIndex: number,
    //   可选，数据的 名称
    //   name: string
    // };
    let params = {
      type: type,
      ...opts
    };
    this._chart.dispatchAction(params);
  },
  // query可以为string和obejct
  // query格式可以是 'mainType' 或者 'mainType.subType'
  onEvent: function(type, query, handler, context) {
    // 支持三四参数混用效果
    // if (typeof query === "function") {
    //   handler = query;
    //   handler = context;
    // }
    this._chart.on(type, query, handler, context);
    this.handler[type].push(handler);
  },
  offEvent: function(eventName, handler) {
    this._chart.off(eventName, handler);
    let handlers = this.handlers[eventName];
    if (handlers.indexOf(handler) > -1) {
      let index = handlers.indexOf(handler);
      this.handlers[eventName].splice(index, 1);
    }
  },
  offAllEvent: function() {
    // 卸载所有事件
    let types = Object.keys(this.handlers);
    if (types && types.length > 0) {
      for (let i = 0; i < types.length; i++) {
        let handlers = this.handlers[types[i]];
        if (handlers && handlers.length) {
          let _i = 0;
          while (_i < handlers.length) {
            this.offEvent(types[i], handlers[_i]);
            _i++;
          }
        }
      }
    }
  },
  convertToPixel: function(coorType, values) {
    return this._chart.convertToPixel(coorType, values);
  },
  convertFromPixel: function(coorType, values) {
    return this._chart.convertFromPixel(coorType, values);
  },
  containPixel: function(coorType, values) {
    return this._chart.containPixel(coorType, values);
  },
  showLoading: function(opts) {
    let defaultOpts = {
      text: "loading",
      color: "#c23531",
      textColor: "#000",
      maskColor: "rgba(255, 255, 255, 0.8)",
      zlevel: 0
    };
    this._chart.showLoading("default", opts || defaultOpts);
  },
  hideLoading: function() {
    this._chart.hideLoading();
  },
  getDataURL: function(opts) {
    let defaultOpts = {
      type: "png",
      pixelRatio: 2,
      backgroundColor: "#fff",
      excludeComponents: []
    };
    return this._chart.getDataURL(opts || defaultOpts);
  },
  getConnectedDataURL: function(opts) {
    let defaultOpts = {
      type: "png",
      pixelRatio: 2,
      backgroundColor: "#fff",
      excludeComponents: []
    };
    return this._chart.getConnectedDataURL(opts || defaultOpts);
  },
  // 清空当前实例,包括实例中所有组件和图表
  clear: function() {
    this._chart.clear();
  },
  isDisposed: function() {
    return this._chart.isDisposed();
  },
  // 销毁实例，销毁后实例不能在使用
  dispose: function() {
    this.offAllEvent();
    this._chart.dispose();
  },
  // **api中没有列出方法**
  // 获取zrender实例
  // zr.on() // 这个是canvas全局事件
  // zr.add(el) // 画布添加元素
  // zr.addHover(el,style) // 高亮层添加元素
  // zr.findHover() //
  // zr.flush() // 刷新高亮层(refreshHover)和刷新画布(refresh)
  // zr.setBackgroundColor() // 设置背景颜色
  // zr.configLayer(zlevel,config) // 配置某一层
  // zr.clearAnimation() // 清除动画
  getZr: function() {
    return this._chart.getZr();
  },
  // 设置主题
  // echarts 3.0废弃
  setTheme: function() {
    return this._chart.setTheme();
  },
  // 得到一个svg的url
  getSvgDataUrl: function() {
    return this._chart.getSvgDataUrl();
  },
  // 得到画布canvas
  getRenderedCanvas: function(opts) {
    let defaultOpts = {
      pixelRatio: 2,
      backgroundColor: "#fff"
    };
    return this._chart.getRenderedCanvas(opts || defaultOpts);
  },
  // 得到配置项option的model，model可以看作是操作option的实体类，类似curl
  // model.mergeOption()
  // model.setOption()
  // model.resetOption()
  // model.getOption()
  // model.getComponent(mainType,idx)  获取组件配置,每一个组件都有一个defaultOption,组件默认的配置，geo组件里面有一个setZoom和setCenter函数
  // model.queryComponents(condition) 根据条件查询组件
  // model.findComponents(condition) 查找组件
  // model.eachComponent(callback) 遍历每一个组件
  // model.getSeriesByName(name)
  // model.getSeriesByIndex(Index)
  // model.getSeriesByType(type)
  // model.getSeries()
  // model.eachSeries()
  // model.eachRawSeries()
  // model.eachSeriesByType(callback)
  // model.filterSeries()
  getModel: function() {
    return this._chart.getModel();
  },
  // 只执行一次事件
  one: function(type, query, handler, context) {
    this._chart.one(type, query, handler, context);
    // this.handlers[type].push(handler);
  },
  // 触发事件
  trigger: function(eventName) {
    this._chart.trigger(eventName);
  },
  // 触发事件,多了一个上下文绑定
  triggerWithContext: function(eventName) {
    this._chart.triggerWithContext(eventName);
  },
  // 是否绑定了事件,false代表有绑定事件
  isSilent: function(eventName) {
    return this._chart.isSilent(eventName);
  },
  // 根据组件model得到组件的view
  // view.render()
  getViewOfComponentModel: function(componentModel) {
    return this._chart.getViewOfComponentModel(componentModel);
  },
  // 根据系列model得到系列的view
  getViewOfSeriesModel: function(seriesModel) {
    return this._chart.getViewOfSeriesModel(seriesModel);
  },
  /**
   * Get visual from series or data.
   * @param {string|Object} finder
   *        If string, e.g., 'series', means {seriesIndex: 0}.
   *        If Object, could contain some of these properties below:
   *        {
   *            seriesIndex / seriesId / seriesName,
   *            dataIndex / dataIndexInside
   *        }
   *        If dataIndex is not specified, series visual will be fetched,
   *        but not data item visual.
   *        If all of seriesIndex, seriesId, seriesName are not specified,
   *        visual will be fetched from first series.
   * @param {string} visualType 'color', 'symbol', 'symbolSize'
   */
  getVisual: function(finder, visualType) {
    return this._chart.getVisual(finder, visualType);
  },
  getDevicePixelRatio: function() {
    return this._chart.getDevicePixelRatio();
  }
};
Echart.dispose = function(chart) {
  echarts.dispose(chart);
};
// map:地图(现在内部api使用arcgis地图)
// coordinateSystemName：采用和series中的一样
// dimensions:series每个系列中的data中的value的维度
// spatialReference：转换到地图的地图坐标参考
Echart.registerCoordinateSystem = function(
  map,
  coordinateSystemName,
  dimensions,
  spatialReference
) {
  let CoordinateSystem = this.createCoordinateSystem(
    map,
    coordinateSystemName,
    dimensions,
    spatialReference
  );
  echarts.registerCoordinateSystem(coordinateSystemName, CoordinateSystem);
};
Echart.registryMap = function(mapName = "world", geoJson, specialAreas = {}) {
  return echarts.registerMap(mapName, geoJson, specialAreas);
};
Echart.getInstanceByDom = function() {
  return echarts.getInstanceByDom();
};
Echart.getMap = function(mapName) {
  return echarts.getMap(mapName);
};
Echart.registerTheme = function(themeName, theme) {
  return echarts.registerTheme(themeName, theme);
};
// 使用矩形裁剪点集,得到一个新的点集合
Echart.clipPointsByRect = function(points, rect) {
  return echarts.graphic.clipPointsByRect(points, rect);
};
Echart.clipRectByRect = function(targetRect, clipRect) {
  return echarts.graphic.clipRectByRect(targetRect, clipRect);
};
Echart.LinearGradientColor = function(
  right,
  bottom,
  left,
  top,
  colorStops,
  globalCoord
) {
  return echarts.graphic.LinearGradient(
    right,
    bottom,
    left,
    top,
    colorStops,
    globalCoord
  );
};
Echart.RadialGradientColor = function(
  right,
  bottom,
  left,
  top,
  colorStops,
  globalCoord
) {
  return echarts.graphic.RadialGradient(
    right,
    bottom,
    left,
    top,
    colorStops,
    globalCoord
  );
};
Echart.connect = function(...charts) {
  return echarts.connect(charts);
};
Echart.disconnect = function(groupid) {
  return echarts.disconnect(groupid);
};
Echart.createCoordinateSystem = function(
  map,
  coordinateSystemName = "arcgis",
  dimensions = ["x", "y"],
  spatialReference
) {
  let CoordSystem = function CoordSystem(map) {
    this._map = map;
    this._mapOffset = [0, 0];
  };
  // 当系列声明的坐标系为acrgis时，进行创建坐标系
  CoordSystem.create = function(ecModel) {
    ecModel.eachSeries(function(seriesModel) {
      if (seriesModel.get("coordinateSystem") === coordinateSystemName) {
        seriesModel.coordinateSystem = new CoordSystem(map);
      }
    });
  };
  CoordSystem.getDimensionsInfo = function() {
    return dimensions;
  };
  CoordSystem.dimensions = dimensions;
  CoordSystem.prototype.dimensions = dimensions;
  CoordSystem.prototype.setMapOffset = function setMapOffset(mapOffset) {
    this._mapOffset = mapOffset;
  };
  // 地图点转屏幕点
  CoordSystem.prototype.dataToPoint = function dataToPoint(data) {
    let point = {
      type: "point",
      x: data[0],
      y: data[1],
      spatialReference: spatialReference
    };
    let px = map.toScreen(point);
    let mapOffset = this._mapOffset;
    return [px.x - mapOffset[0], px.y - mapOffset[1]];
  };
  // 屏幕点转地图点
  CoordSystem.prototype.pointToData = function pointToData(pt) {
    let mapOffset = this._mapOffset;
    let screentPoint = {
      x: pt[0] + mapOffset[0],
      y: pt[1] + mapOffset[1]
    };
    let data = map.toMap(screentPoint);
    return [data.x, data.y];
  };
  CoordSystem.prototype.getViewRect = function getViewRect() {
    return new echarts.graphic.BoundingRect(
      0,
      0,
      this._map.width,
      this._map.height
    );
  };
  // 获取转换矩阵
  CoordSystem.prototype.getRoamTransform = function getRoamTransform() {
    return echarts.matrix.create();
  };
  return CoordSystem;
};
export default Echart;

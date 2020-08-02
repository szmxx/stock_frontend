import { fromLonLat, toLonLat } from "ol/proj";
import echarts from "echarts";
class EchartsLayer {
  // 建议coordName取值 ol_geo,arcgis_geo,ol,arcgis
  constructor(coordName = "arcgis", map, option, type = "3X") {
    this._map = map;
    this._ec = null;
    this._option = JSON.parse(JSON.stringify(option));
    this._type = type;
    this.visible = true;
    this._mapOffset = [0, 0];
    this._outer_set_option = true;
    this._clone_option = {}; // 外部第一次加载的的数据
    this._coordName = coordName;
    // 给每一个系列注册坐标系
    if (option.series) {
      option.series.forEach(() => {
        if (coordName.indexOf("geo") > -1) {
          echarts.registerCoordinateSystem(
            coordName,
            this.getGeoCoordinateSystem(coordName)
          );
        } else {
          echarts.registerCoordinateSystem(
            coordName,
            this.getXYCoordinateSystem(coordName)
          );
        }
      });
    }
    // 给每一个系列注册坐标系
    if (option.baseOption) {
      option.baseOption.series.forEach(() => {
        if (coordName.indexOf("geo") > -1) {
          echarts.registerCoordinateSystem(
            coordName,
            this.getGeoCoordinateSystem(coordName)
          );
        } else {
          echarts.registerCoordinateSystem(
            coordName,
            this.getXYCoordinateSystem(coordName)
          );
        }
      });
    }
    this._init(echarts);
  }
  // 创建echarts容器并绑定事件 3.x
  _create3XLayer(o, tn) {
    let n = (o._echartsContainer = document.createElement("div"));
    (n.style.position = "absolute"),
      (n.style.height = o._map.height + "px"),
      (n.style.width = o._map.width + "px"),
      (n.style.top = 0),
      (n.style.left = 0),
      o._map.__container.appendChild(n);
    o._ec = tn.init(n);
    o._bind3XEvent(o);
  }
  // 创建echarts容器并绑定事件 4.x
  _create4XLayer(o, tn) {
    let n = (o._echartsContainer = document.createElement("div"));
    n.setAttribute("id", Math.random());
    n.style.width = o._map.width + "px";
    n.style.height = o._map.height + "px";
    n.style.position = "absolute";
    n.style.top = 0;
    n.style.left = 0;
    const parent = o._map.container.getElementsByClassName(
      "esri-view-surface"
    )[0];
    parent.appendChild(n);
    o._ec = tn.init(n);
    o._bind4XEvent(o);
  }
  _createOLLayer(o, tn) {
    let n = (o._echartsContainer = document.createElement("div"));
    n.setAttribute("id", Math.random());
    n.style.width = o._map.getSize()[0] + "px";
    n.style.height = o._map.getSize()[1] + "px";
    n.style.position = "absolute";
    n.style.top = 0;
    n.style.left = 0;
    const parent = o._map
      .getTargetElement()
      .getElementsByClassName("ol-viewport")[0];
    parent.insertBefore(n, parent.lastElementChild);
    o._ec = tn.init(n);
    o._bindOLEvent(o);
  }
  // 针对3.x绑定地图事件
  _bind3XEvent(o) {
    o._initCommonEvent(o);
    o._map.on("zoom-end", function() {
      o._ec.resize(), (o._echartsContainer.style.visibility = "visible");
    }),
      o._map.on("zoom-start", function() {
        o._echartsContainer.style.visibility = "hidden";
      }),
      o._map.on("pan", function() {
        o._echartsContainer.style.visibility = "hidden";
      }),
      o._map.on("pan-end", function() {
        o._ec.resize(), (o._echartsContainer.style.visibility = "visible");
      }),
      o._map.on("resize", function() {
        let e = o._echartsContainer.parentNode.parentNode.parentNode;
        (o._mapOffset = [
          -parseInt(e.style.left) || 0,
          -parseInt(e.style.top) || 0
        ]),
          (o._echartsContainer.style.left = o._mapOffset[0] + "px"),
          (o._echartsContainer.style.top = o._mapOffset[1] + "px"),
          setTimeout(function() {
            o._map.resize(), o._map.reposition(), o._ec.resize();
          }, 200),
          (o._echartsContainer.style.visibility = "visible");
      });
    o._ec.getZr().on("mousewheel", function(e) {
      let t = e.wheelDelta,
        n = o._map,
        a = n.getZoom();
      (t = t > 0 ? Math.ceil(t) : Math.floor(t)),
        (t = Math.max(Math.min(t, 4), -4)),
        (t = Math.max(n.getMinZoom(), Math.min(n.getMaxZoom(), a + t)) - a),
        (o._delta = 0),
        (o._startTime = null),
        t && n.setZoom(a + t);
    });
  }
  // 针对4.x绑定地图事件
  _bind4XEvent(o) {
    o._initCommonEvent(o);
    o._map.watch("extent", function() {
      if (!o.visible) return;
      o.setOption(o._option, false, false, false, false);
      o._ec.resize();
      o._echartsContainer.hidden = false;
    });
    o._map.watch("rotation", function() {
      if (!o.visible) return;
      o.setOption(o._option, false, false, false, false);
      o._ec.resize();
      o._echartsContainer.hidden = false;
    });
  }
  _bindOLEvent(o) {
    // 初始化公共事件
    o._initCommonEvent(o);
    // 可当作地范围改变
    o._map.getView().on("change", function() {
      // 这个是设置display=none
      // o._echartsContainer.hidden = true;
      o._option.series.forEach(item => {
        item.animation = false;
      });
      o._dealLevelTextStyleByZoom(o, o._option);
      o._echartsContainer.style.opacity = 0;
      o.setOption(o._option, false, false, false, false);
      o._ec.resize();
      o._echartsContainer.style.opacity = 1;
      o._option.series.forEach(item => {
        item.animation = true;
      });
    });
    // o._map.on("pointermove", function(e) {
    //   // console.log(e);
    //   // console.log("map move");
    // }),
    // o._map.on("moveend", function(e) {
    //   // console.log(e);
    //   // console.log("map move end");
    // }),
    // o._map.on("movestart", function(e) {
    //   console.log(e);
    //   console.log("map move start");
    // });
  }
  // 计算zoom影响的resize
  // zoom的话在setOption的option基础上进行zoom计算
  _dealLevelTextStyleByZoom(o, option) {
    let includelist = [
      "title",
      "legend",
      "tooltip",
      "xAxis",
      "yAxis",
      "textStyle"
    ];
    function computedFontSize(size) {
      if (zoom <= 5) {
        return size;
      } else if (zoom <= 10) {
        return ((size * zoom) / 5).toFixed(2);
      } else {
        return (size * 2).toFixed(2);
      }
    }
    // 一般处理0-N层级
    let zoom = -1;
    if (!(option && option.grid)) {
      return;
    }

    if (o._coordName.indexOf("arcgis") > -1) {
      zoom = o._map.getZoom();
    } else {
      try {
        zoom = o._map.getView().getZoom();
      } catch {
        zoom = -1;
      }
    }
    if (zoom !== -1) {
      let keys = Object.keys(option);
      for (let i = 0; i < keys.length; i++) {
        if (includelist.indexOf(keys[i]) > -1) {
          if (keys[i] !== "textStyle") {
            if (
              option[keys[i]].textStyle &&
              option[keys[i]].textStyle.fontSize
            ) {
              option[keys[i]].textStyle.fontSize = computedFontSize(
                o._clone_option[keys[i]].textStyle.fontSize
              );
            } else {
              option[keys[i]].textStyle = {
                fontSize: computedFontSize(12)
              };
            }
            if (
              option[keys[i]].nameTextStyle &&
              option[keys[i]].nameTextStyle.fontSize
            ) {
              option[keys[i]].nameTextStyle.fontSize = computedFontSize(
                o._clone_option[keys[i]].nameTextStyle.fontSize
              );
            } else {
              option[keys[i]].nameTextStyle = {
                fontSize: computedFontSize(12)
              };
            }
          } else {
            if (option[keys[i]].fontSize) {
              option[keys[i]].fontSize = computedFontSize(
                o._clone_option[keys[i]].fontSize
              );
            } else {
              option[keys[i]].fontSize = computedFontSize(12);
            }
          }
        }
      }
      if (option.grid) {
        let grid = option.grid;
        for (let i = 0; i < grid.length; i++) {
          grid[i].width =
            o._clone_option.grid[i].width *
            (zoom <= 3 ? 0.5 : zoom / 5).toFixed(2);
          grid[i].height =
            o._clone_option.grid[i].height *
            (zoom <= 3 ? 0.5 : zoom / 5).toFixed(2);
        }
      }
      if (o._outer_set_option) {
        o._clone_option = JSON.parse(JSON.stringify(option));
        o._outer_set_option = false;
      }
    }
  }
  _initCommonEvent(o) {
    o._map.on("click", function(e) {
      const old = e.native || e.originalEvent;
      let evt = new MouseEvent("click", {
        altKey: old.altKey,
        button: old.button,
        buttons: old.buttons,
        clientX: old.clientX,
        clientY: old.clientY,
        ctrlKey: old.ctrlKey,
        metaKey: old.metaKey,
        movementX: old.movementX,
        movementY: old.movementY,
        offsetX: old.offsetX,
        offsetY: old.offsetY,
        pageX: old.pageX,
        pageY: old.pageY,
        region: old.region,
        screenX: old.screenX,
        screenY: old.screenY,
        shiftKey: old.shiftKey,
        which: old.which,
        x: old.x,
        y: old.y
      });
      o._ec
        .getDom()
        .getElementsByTagName("div")[0]
        .dispatchEvent(evt);
    });
    o._ec.getZr().on("dragstart", function() {}),
      o._ec.getZr().on("dragend", function() {});
  }
  // 移除并销毁echarts图层
  removeLayer() {
    this._echartsContainer.outerHTML = "";
    this._map = null;
    this._echartsContainer = null;
    this._ec = null;
    this._option = null;
  }
  // 入口，设置echarts的Option
  _init(tn) {
    let o = this;
    if (o._type === "3X") {
      o._create3XLayer(o, tn);
    } else if (o._type === "4X") {
      o._create4XLayer(o, tn);
    } else {
      o._createOLLayer(o, tn);
    }
    o._option && o.setOption(o._option);
  }
  // 获取echarts容器
  getEchartsContainer() {
    return this._echartsContainer;
  }
  // 获取地图
  getMap() {
    return this._map;
  }
  // 获取echarts实例
  getECharts() {
    return this._ec;
  }
  // 获取echarts中的canvas
  getEchartCanvas() {
    return this._ec.getRenderedCanvas({
      pixelRatio: 2,
      backgroundColor: "#fff"
    });
  }
  // 获取echarts的图片
  getEchartImage() {
    return this._ec.getDataURL({
      pixelRatio: 2,
      backgroundColor: "#fff"
    });
  }
  // 获取图表的偏移值
  getMapOffset() {
    return this._mapOffset;
  }
  // 设置图表的option
  setOption(e, t = false, lazyUpdate = false, silent = false, outer = true) {
    // e.series.forEach(item => {
    //   item.animation = false;
    // });
    this._outer_set_option = outer;
    if (this._outer_set_option) {
      this._clone_option = JSON.parse(JSON.stringify(e));
      this._dealLevelTextStyleByZoom(this, e);
    }
    let grid = e.grid;
    if (!grid || typeof grid !== "object") {
      grid = [];
    } else if (!Array.isArray(grid)) {
      grid = [grid];
    }
    // 重新计算grid的坐标
    for (let i = 0; i < grid.length; i++) {
      let { lng, lat } = grid[i];
      if (lng && lat) {
        if (this._coordName.indexOf("arcgis") > -1) {
          let point = {
            type: "point",
            x: lng,
            y: lat,
            spatialReference: this._map.spatialReference
          };
          let screenPoint = this._map.toScreen(point);
          let { x, y } = screenPoint;
          if (x && y) {
            grid[i].x = x - (grid[i].width / 2).toFixed(2) + "px";
            grid[i].y = y - (grid[i].height / 2).toFixed(2) + "px";
          }
        } else {
          let coords = [lng, lat];
          if (this._coordName.indexOf("geo") > -1) {
            if (
              this._map
                .getView()
                .getProjection()
                .getCode() === "EPSG:3857"
            ) {
              coords = fromLonLat(coords);
            }
          } else {
            if (
              this._map
                .getView()
                .getProjection()
                .getCode() === "EPSG:4326"
            ) {
              coords = toLonLat(coords);
            }
          }
          let screenPoint = this._map.getPixelFromCoordinate(coords);
          if (screenPoint && Array.isArray(screenPoint) && screenPoint.length) {
            grid[i].x = screenPoint[0] - (grid[i].width / 2).toFixed(2) + "px";
            grid[i].y = screenPoint[1] - (grid[i].height / 2).toFixed(2) + "px";
          }
        }
      }
    }
    (this._option = e), this._ec.setOption(e, t, lazyUpdate, silent);
  }
  // 这个是echarts投影坐标系
  getXYCoordinateSystem(coordName) {
    let _map = this._map;
    let CoordSystem = function CoordSystem(map) {
      this._map = map;
      this._mapOffset = [0, 0];
    };
    // 当系列声明的坐标系为acrgis时，进行创建坐标系
    CoordSystem.create = function(ecModel) {
      ecModel.eachSeries(function(seriesModel) {
        if (seriesModel.get("coordinateSystem") === coordName) {
          seriesModel.coordinateSystem = new CoordSystem(_map);
        }
      });
    };
    CoordSystem.getDimensionsInfo = function() {
      return ["x", "y"];
    };
    CoordSystem.dimensions = ["x", "y"];
    CoordSystem.prototype.dimensions = ["x", "y"];
    CoordSystem.prototype.setMapOffset = function setMapOffset(mapOffset) {
      this._mapOffset = mapOffset;
    };
    if (coordName.indexOf("arcgis") > -1) {
      // 地图点转屏幕点
      CoordSystem.prototype.dataToPoint = function dataToPoint(data) {
        let point = {
          type: "point",
          x: data[0],
          y: data[1],
          spatialReference: _map.spatialReference // 继承了一些方法 isWebMercator()
        };
        let px = _map.toScreen(point);
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
        let data = _map.toMap(screentPoint);
        return [data.x, data.y];
      };
    } else {
      // 地图点转屏幕点
      CoordSystem.prototype.dataToPoint = function dataToPoint(data) {
        let coords = [data[0], data[1]];
        if (
          _map
            .getView()
            .getProjection()
            .getCode() === "EPSG:4326"
        ) {
          coords = toLonLat(coords);
        }
        let px = _map.getPixelFromCoordinate(coords);
        let mapOffset = this._mapOffset;
        return [px[0] - mapOffset[0], px[1] - mapOffset[1]];
      };
      // 屏幕点转地图点
      CoordSystem.prototype.pointToData = function pointToData(pt) {
        let mapOffset = this._mapOffset;
        let screenPoint = [pt[0] + mapOffset[0], pt[1] + mapOffset[1]];
        let data = _map.getCoordinateFromPixel(screenPoint);
        return [data[0], data[1]];
      };
    }
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
  }
  // 这个是地理坐标系
  getGeoCoordinateSystem(coordName) {
    let _map = this._map;
    let CoordSystem = function CoordSystem(map) {
      this._map = map;
      this._mapOffset = [0, 0];
    };
    CoordSystem.create = function(ecModel) {
      ecModel.eachSeries(function(seriesModel) {
        if (seriesModel.get("coordinateSystem") === coordName) {
          seriesModel.coordinateSystem = new CoordSystem(_map);
        }
      });
    };
    CoordSystem.getDimensionsInfo = function() {
      return ["lng", "lat"];
    };
    CoordSystem.dimensions = ["lng", "lat"];
    CoordSystem.prototype.dimensions = ["lng", "lat"];
    CoordSystem.prototype.setMapOffset = function setMapOffset(mapOffset) {
      this._mapOffset = mapOffset;
    };
    if (coordName.indexOf("arcgis") > -1) {
      // 地图点转屏幕点
      CoordSystem.prototype.dataToPoint = function dataToPoint(data) {
        let point = {
          type: "point",
          x: data[0],
          y: data[1],
          spatialReference: _map.spatialReference // 继承了一些方法 isWebMercator()
        };
        let px = _map.toScreen(point);
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
        let data = _map.toMap(screentPoint);
        return [data.x, data.y];
      };
    } else {
      // 地图点转屏幕点
      CoordSystem.prototype.dataToPoint = function dataToPoint(data) {
        let coords = [data[0], data[1]];
        // 当前地图的坐标系是投影，但是这个是经纬度坐标系
        if (
          _map
            .getView()
            .getProjection()
            .getCode() === "EPSG:3857"
        ) {
          coords = fromLonLat(coords);
        }
        let px = _map.getPixelFromCoordinate(coords);
        let mapOffset = this._mapOffset;
        return [px[0] - mapOffset[0], px[1] - mapOffset[1]];
      };
      // 屏幕点转地图点
      CoordSystem.prototype.pointToData = function pointToData(pt) {
        let mapOffset = this._mapOffset;
        let screenPoint = [pt[0] + mapOffset[0], pt[1] + mapOffset[1]];
        let data = _map.getCoordinateFromPixel(screenPoint);
        return [data[0], data[1]];
      };
    }
    CoordSystem.prototype.getViewRect = function getViewRect() {
      return new echarts.graphic.BoundingRect(
        0,
        0,
        this._map.width,
        this._map.height
      );
    };
    CoordSystem.prototype.getRoamTransform = function getRoamTransform() {
      return echarts.matrix.create();
    };
    return CoordSystem;
  }
}
export default EchartsLayer;

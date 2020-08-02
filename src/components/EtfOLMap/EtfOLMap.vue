<template>
  <div id="map"></div>
</template>

<script>
import { View, Map } from "ol";
import { TileArcGISRest } from "ol/source";
import { Tile as TileLayer } from "ol/layer";
import { fromLonLat } from "ol/proj";
import EchartLayer from "@/utils/EchartLayer";

export default {
  name: "EtfOLMap",
  props: {
    center: {
      type: Array,
      default: () => [105, 34]
    },
    zoom: {
      type: Number,
      default: 5
    }
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      let view = {
        center: fromLonLat(this.center),
        zoom: this.zoom
      };
      let map = new Map({
        controls: [],
        view: new View(view),
        target: "map"
      });
      this.addLayer(map);
      setTimeout(() => {
        this.addEchartLayer(map);
        map.dispatchEvent("change");
      }, 0);
    },
    addLayer(map) {
      let url =
        "http://cache1.arcgisonline.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer";
      let tileLayer = new TileLayer({
        source: new TileArcGISRest({
          url: url
        })
      });
      map.addLayer(tileLayer);
    },
    addEchartLayer(map) {
      let colorlist = ["#ffff00", "#ff0000", "#00ff00", "#0000ff", "#ff00ff"];
      let citys = [
          [121.29, 31.14],
          [116.405289, 39.904987],
          [115.12, 21.23],
          [121.3, 25.03],
          [91.08, 29.39],
          [114.17, 30.35],
          [112.59, 28.12],
          [114.16546, 22.27534],
          [87.61688, 43.82663],
          [104.065735, 30.659462],
          [110.19989, 20.04422],
          [119.306236, 26.075302],
          [115.892151, 28.676493],
          [117.283043, 31.861191],
          [118.76741, 32.041546],
          [108.948021, 34.263161],
          [114.502464, 38.045475],
          [106.23248, 38.48644],
          [111.75199, 40.84149],
          [126.642464, 45.756966],
          [125.324501, 43.886841],
          [108.320007, 22.82402],
          [106.504959, 29.533155],
          [102.71225, 25.040609],
          [106.713478, 26.578342],
          [101.77782, 36.61729],
          [113.665413, 34.757977],
          [123.429092, 41.796768],
          [103.83417, 36.06138],
          [117.000923, 36.675808],
          [112.549248, 37.857014],
          [117.190186, 39.125595],
          [113.28064, 23.125177],
          [120.15358, 30.287458]
        ],
        series = [],
        datas1 = [],
        datas2 = [];
      for (let i = 1; i < citys.length; i++) {
        datas1.push({
          coords: [citys[0], citys[i]]
        });
      }
      for (let i = 1; i < citys.length; i++) {
        datas2.push({
          lineStyle: {
            normal: {
              color: colorlist[(i % colorlist.length) - 1],
              width: 1,
              curveness: 0.2
            }
          },
          coords: [citys[0], citys[i]]
        });
      }
      let series1 = {
        name: "line1",
        type: "lines",
        coordinateSystem: "ol_geo",
        zlevel: 1,
        effect: {
          show: true,
          period: 6,
          trailLength: 0.7,
          color: "#fff",
          symbolSize: 3,
          shadowBlur: 4.4
        },
        lineStyle: {
          normal: {
            width: 0,
            curveness: 0.2
          }
        },
        data: datas1
      };
      let series2 = {
        name: "line1",
        type: "lines",
        zlevel: 2,
        coordinateSystem: "ol_geo",
        symbol: ["none"],
        symbolSize: 10,
        effect: {
          show: true,
          period: 6,
          trailLength: 0,
          symbolSize: 6
        },
        data: datas2
      };
      series.push(series1, series2);
      let option = {
        series: series
      };
      new EchartLayer("ol_geo", map, option, "ol");
    }
  }
};
</script>
<style scoped>
#map {
  height: 100%;
}
</style>

<template>
  <div class="home">
    <div class="home__left">
      <div class="search search__container">
        <input
          type="text"
          placeholder="查询点什么..."
          v-model="queryVal"
          @input="query"
        />
        <select v-model="curSelectType">
          <option value="基金">基金</option>
          <option value="股票">股票</option>
        </select>
        <div @click="queryName">
          <span>当前所选：</span>
          <strong>{{ curSelectItem }}</strong>
        </div>
      </div>
      <div class="catalog catalog__container">
        <div
          v-for="(item, i) in catalogs"
          :key="i"
          class="item item__container"
        >
          <span>{{ item.name }}</span>
          <div class="item__container--operation">
            <input type="button" value="添加" @click="addItem(item.type)" />
            <input type="button" value="删除" @click="removeItem(item.type)" />
          </div>
          <div class="item__container--item">
            <perfect-scrollbar>
              <div
                v-for="(cell, j) in item.list"
                :key="j"
                @click="select(cell)"
                class="cell"
                :class="{ isActive: curSelectItem === cell.name }"
                :style="{ background: cell.color }"
              >
                {{ cell.name }}
              </div>
            </perfect-scrollbar>
          </div>
        </div>
      </div>
      <div class="chart chart__container">
        <div class="chart__container--title" v-if="curSelectItem">
          {{ curSelectItem }}--{{ curSelectChart }}走势图
        </div>
        <div ref="chart"></div>
        <div class="chart__legend">
          <div
            v-for="(item, i) in chartConfig.series"
            :key="i"
            @click="toggleChart(item)"
            :class="{ isActive: item.name === curSelectChart }"
          >
            <span>{{ item.name }}</span>
            <div :style="{ background: item.color }"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="home__right">
      <div class="table table__container" ref="table">
        <Table
          stripe
          highlight-row
          :height="tableHeight"
          :columns="columns"
          :loading="loading"
          :data="tabelData"
        ></Table>
      </div>
    </div>
    <div class="home__modal" v-if="showModal">
      <EtfModal
        @close="closeModal"
        @submit="submitInfo"
        :type="curSelectType"
      ></EtfModal>
    </div>
  </div>
</template>

<script>
import { Chart } from "@antv/g2";
import { Table } from "view-design";
import { getRandomColor, filterList } from "@/utils/common";
import { getHomeConfig, getStockList, getFundList } from "@/api/home";
import { addFundOrStock } from "@/api/user";
import EchartUtil from "@/utils/EchartUtil";
export default {
  data() {
    return {
      tabelData: [],
      columns: [],
      chartConfig: {},
      queryVal: "",
      loading: true,
      tableHeight: 0,
      catalogs: [
        {
          name: "基金所选列表",
          type: "基金",
          list: []
        },
        {
          name: "股票所选列表",
          type: "股票",
          list: []
        }
      ],
      curSelectItem: "",
      curSelectChart: "",
      curSelectType: "基金",
      chart: null,
      showModal: false,
      modalinfo: {},
      originFundList: [], // 原始基金列表数据
      originStockList: [] // 原始股票列表数据
    };
  },
  components: {
    Table
  },
  beforeMount() {
    let { fundlist, stocklist } = this.$store.getters.userInfo;
    const data = this.$route.params;
    if (data && data.type === "fund") {
      this.init(stocklist, data.value, "fund");
    } else if (data && data.type === "stock") {
      this.init(data.value, fundlist, "stock");
    } else {
      this.init(stocklist, fundlist);
    }
  },
  watch: {
    modalinfo(newVal) {
      let params = {
        type: this.curSelectType,
        value: newVal
      };
      addFundOrStock(params).then(res => {
        if (res && res.status === "success") {
          this.$Message.success(res.message);
        } else {
          this.$Message.error((res && res.message) || "添加失败");
        }
      });
    }
  },
  methods: {
    async test() {
      let params = {
        callback: "jQuery18306759089165518737_1584100457591",
        fundCode: 519674,
        pageIndex: 1,
        pageSize: 20,
        startDate: "",
        endDate: 1584100457772
      };
      let res = await getFundList(params);
      console.log(res);
    },
    jQuery18306759089165518737_1584100457591(res) {
      console.log(res);
    },
    init(stocklist, fundlist, type = "stock") {
      let list = type === "fund" ? fundlist : stocklist;
      this.getInitData(
        list,
        type,
        function(config, defaultData) {
          this.curSelectChart = config.chartConfig.seriesData[1].name;
          this.columns = config.columns || [];
          this.tableHeight = this.$refs["table"].clientHeight - 20;
          this.tabelData = defaultData;
          this.catalogs[0].list = fundlist;
          this.catalogs[1].list = stocklist;
          this.originFundList = JSON.parse(JSON.stringify(fundlist));
          this.originStockList = JSON.parse(JSON.stringify(stocklist));
          this.curSelectItem = stocklist.length && stocklist[0].name;
          this.chartConfig = this.dealWithChartConfig(config.chartConfig);
          debugger;
          this.initChart(this.tabelData, this.chartConfig);
          this.loading = false;
        }.bind(this)
      );
    },
    queryName() {
      if (this.curSelectItem) {
        let url = `http://data.eastmoney.com/gstc/default.aspx?keyword=${this.curSelectItem}`;
        window.open(url);
      }
    },
    addItem(type) {
      this.curSelectType = type;
      this.showModal = true;
    },
    removeItem(type) {
      console.log(type);
    },
    closeModal() {
      this.showModal = false;
    },
    submitInfo(params) {
      this.modalinfo = params;
    },
    toggleChart(e) {
      this.curSelectChart = e.name;
      this.chartConfig.series.forEach(item => {
        if (item.name === e.name) {
          item.show = true;
        } else {
          item.show = false;
        }
      });
      this.initChart(this.tabelData, this.chartConfig);
    },
    async select(item) {
      this.tabelData = [];
      this.loading = true;
      this.curSelectItem = item.name;
      this.curSelectChart = this.chartConfig.series[0].name;
      let params = {
        name: item.name
      };
      let res = await getStockList(params);
      this.tabelData = res;
      this.initChart(this.tabelData, this.chartConfig);
      this.loading = false;
    },
    async getInitData(list, type, callback) {
      let config = await getHomeConfig();
      let params = {
        name: list.length && list[0].name
      };
      if (type === "fund") {
        console.log(list);
      } else {
        let defaultData = await getStockList(params);
        callback(config, defaultData);
      }
    },
    throttle(func, delay, duration) {
      let timeout = null,
        start = new Date();
      return function() {
        let context = this,
          args = arguments,
          end = new Date();
        clearTimeout(timeout);
        if (end - start >= duration) {
          func.apply(context, args);
          start = end;
        } else {
          timeout = setTimeout(func, delay);
        }
      };
    },
    query() {
      if (this.queryVal) {
        if (this.curSelectType === "基金") {
          let res = filterList(this.catalogs[0].list, this.queryVal);
          this.catalogs[0].list = res;
        } else {
          let res = filterList(this.catalogs[1].list, this.queryVal);
          this.catalogs[1].list = res;
        }
      } else {
        this.catalogs[1].list = this.originStockList;
        this.catalogs[0].list = this.originFundList;
      }
    },
    dealWithChartConfig(config) {
      let option = {};
      let {
        autoFit,
        width,
        height,
        padding,
        scale,
        tooltip,
        seriesData,
        isShowLegend
      } = config;
      let { series, legend } = dealSeries(seriesData);
      option.autoFit = autoFit || false;
      option.width = width || 300;
      option.height = height || 500;
      option.padding = padding || [10, 10, 10, 10];
      option.scale = scale || {};
      option.series = series;
      option.legend = isShowLegend ? legend : {};
      option.tooltip = tooltip || {};
      function dealSeries(series) {
        let res_series = [],
          res_legend = [];
        if (Array.isArray(series) && series.length) {
          series.forEach((item, i) => {
            let tempSeries = {},
              tempLegend = {};
            if (i == 0) {
              return;
            }
            if (i == 1) {
              tempSeries.show = true;
            }
            tempSeries.name = series[i].name;
            tempSeries.show = tempSeries.show || false;
            tempSeries.xy = series[0].name + "*" + series[i].name;
            tempSeries.color = series[i].color || getRandomColor();
            tempSeries.shape = series[i].shape || "smooth";
            tempLegend.name = series[i].name;
            tempLegend.value = series[i].value;
            tempLegend.marker = series[i].marker || {
              symbol: "line",
              style: {
                stroke: tempSeries.color,
                lineWidth: 3
              }
            };
            res_series.push(tempSeries);
            res_legend.push(tempLegend);
          });
        }
        return {
          series: res_series,
          legend: res_legend
        };
      }
      return option;
    },
    dealWithLineOption(list, key, identify) {
      let opt = {
        xAxis: {
          type: "category",
          data: list.map(item => {
            return item["日期"];
          })
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: list.map(item => {
              if (identify) {
                return item[key].replace(identify, "");
              }
              return item[key];
            }),
            type: "line",
            smooth: true
          }
        ]
      };
      return opt;
    },
    initChart(option) {
      // this.chart = echarts.init();
      if (!this.chart) {
        let dom = this.$refs.chart;
        this.chart = new EchartUtil(dom);
      }
      this.chart.setOption(option);
    },
    // 标记，图例，坐标系，提示
    initChart(data, config) {
      if (!this.chart) {
        this.chart = new Chart({
          container: "chart",
          autoFit: config.autoFit,
          height: config.height,
          width: config.width,
          padding: config.padding
        });
      }

      this.chart.clear();
      this.chart.data(data);
      config.series.forEach(item => {
        if (item.show) {
          this.chart.scale(item.name, config.scale);
          this.chart.axis(item.name, true);
          this.chart
            .line()
            .position(item.xy)
            .color(item.color)
            .shape(item.shape);
        }
      });
      this.chart.legend({
        custom: true,
        items: config.legend
      });
      this.chart.tooltip(config.tooltip);
      this.chart.render();
    }
  }
};
</script>

<style scoped lang="scss">
.home {
  position: relative;
  height: 100%;
  color: #fff;
}
.home__left {
  float: left;
  width: 45%;
  height: 100%;
}
.home__right {
  float: right;
  width: 55%;
  height: 100%;
}
.search__container {
  position: relative;
  display: flex;
  height: 3rem;
  padding: 0.3rem;
  align-items: center;
}
.search__container input {
  min-width: 30%;
  border: 1px solid #333;
  padding: 0.3rem;
  margin: 0.3rem 0.5rem;
}
.search__container select {
  min-width: 15%;
  height: 2rem;
  border: 1px solid #000;
  border-radius: 0.2rem;
}
.search__container div {
  position: absolute;
  right: 0.2rem;
  min-width: 20%;
  margin-left: 1rem;
  padding: 0.4rem;
  color: #000;
  background: #ffff00;
}
.catalog__container {
  height: 40%;
  padding: 0.3rem;
}
.item__container {
  float: left;
  height: 100%;
  width: 50%;
  padding: 0.4rem;
  border: 1px solid #eee;
}
.item__container--operation {
  float: right;
  display: flex;
}
.item__container--operation input {
  border: 0;
  min-height: 1rem;
  margin: 0 0.2rem;
  padding: 0 0.5rem;
}
.item__container span {
  padding-right: 0.3rem;
  border-right: 3px solid #8888;
}
.item__container--item {
  height: 90%;
  margin-top: 0.1rem;
  padding-top: 0.1rem;
  border-top: 1px solid #8888;
}
.item__container--item .ps {
  height: 100%;
}
.item__container--item .cell {
  display: inline-block;
  padding: 0.3rem;
  margin: 0.3rem;
  min-width: 3rem;
  min-height: 2rem;
  text-align: center;
  cursor: pointer;
}
.item__container--item .cell.isActive {
  background: #ffff00 !important;
  border: 1px solid #ff0000;
  color: #000 !important;
}
.table__container {
  height: 100%;
  padding: 0.3rem;
  overflow: hidden;
}
.chart__container {
  position: relative;
  height: 50%;
  margin: 1rem 0.3rem;
  padding: 1rem;
  border: 1px solid #8888;
  border-radius: 0.3rem;
}
.chart__container--title {
  position: absolute;
  top: 0.5rem;
  left: 1rem;
}

.chart__legend {
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  bottom: 0.2rem;
}
.chart__legend > div {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 0.5rem;
  cursor: pointer;
}
.chart__legend > div div {
  min-width: 2rem;
  min-height: 0.5rem;
  margin-left: 0.2rem;
}
.chart__legend > div.isActive div {
  border: 1px solid #ff0000;
  background: #ffff00 !important;
}
.home__modal {
  position: absolute;
  width: 100%;
  height: 100%;
}
/deep/ .ivu-table {
  background-color: transparent;
}
/deep/ .ivu-table th {
  background-color: transparent;
  color: #ffff00;
}
/deep/ .ivu-table-row td {
  background-color: transparent !important;
  color: #fff;
  font-weight: 500;
}
/deep/ .ivu-spin-fix {
  background-color: transparent !important;
}
</style>

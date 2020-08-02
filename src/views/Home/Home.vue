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
          <strong>{{ curSelectItem.split("(")[0] }}</strong>
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
                {{ cell.name.split("(")[0] }}
              </div>
            </perfect-scrollbar>
          </div>
        </div>
      </div>
      <div class="chart chart__container">
        <div class="chart__container--title" v-if="curSelectItem">
          {{ curSelectItem.split("(")[0] }}--{{ curSelectChart }}走势图
        </div>
        <div class="chart__container--content">
          <div ref="chart"></div>
        </div>
        <div class="chart__container--legend">
          <div
            v-for="(item, i) in chartConfig.legendData"
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
          this.curSelectChart = config.chartConfig.legendData[0].name;
          this.columns = config.columns || [];
          this.tableHeight = this.$refs["table"].clientHeight - 20;
          this.tabelData = defaultData;
          this.catalogs[0].list = fundlist;
          this.catalogs[1].list = stocklist;
          this.originFundList = JSON.parse(JSON.stringify(fundlist));
          this.originStockList = JSON.parse(JSON.stringify(stocklist));
          this.curSelectItem = stocklist.length && stocklist[0].name;
          this.dealWithChartConfig(config.chartConfig);
          let option = this.dealWithLineOption(
            this.tabelData,
            this.chartConfig.legendData[0]
          );
          this.initChart(option);
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
      this.chartConfig.legendData.forEach(item => {
        if (item.name === e.name) {
          item.show = true;
        } else {
          item.show = false;
        }
      });
      let option = {};
      if (e.name === "交易量") {
        option = this.dealWithLineOption(this.tabelData, e, "M");
      } else if (e.name === "涨跌幅") {
        option = this.dealWithLineOption(this.tabelData, e, "%");
      } else {
        option = this.dealWithLineOption(this.tabelData, e);
      }
      this.initChart(option);
    },
    async select(item) {
      this.tabelData = [];
      this.loading = true;
      this.curSelectItem = item.name;
      this.curSelectChart = this.chartConfig.legendData[0].name;
      let params = {
        name: item.name
      };
      let res = await getStockList(params);
      this.tabelData = res;

      let option = this.dealWithLineOption(
        this.tabelData,
        this.chartConfig.legendData[0]
      );
      this.initChart(option);
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
      let { legendData } = config;
      for (let i = 0; i < legendData.length; i++) {
        legendData[i].color = legendData[i].color || getRandomColor();
      }
      this.chartConfig = config;
    },
    dealWithLineOption(list, key, identify) {
      let opt = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross"
          }
        },
        grid: [
          {
            top: "2%",
            left: "5%",
            right: 0,
            bottom: "8%",
            height: "90%"
          }
        ],
        dataZoom: [
          {
            type: "inside"
          }
        ],
        xAxis: {
          type: "category",
          data: list
            .map(item => {
              return item["日期"];
            })
            .reverse(),
          axisLine: {
            lineStyle: {
              width: 0
            }
          },
          axisLabel: {
            color: "#fff"
          }
        },
        yAxis: {
          type: "value",
          splitLine: {
            lineStyle: {
              width: 0
            }
          },
          axisLine: {
            lineStyle: {
              width: 0
            }
          },
          axisLabel: {
            color: "#fff"
          }
        },
        series: [
          {
            data: list
              .map(item => {
                if (identify) {
                  return item[key.name].replace(identify, "");
                }
                return item[key.name];
              })
              .reverse(),
            type: "line",
            symbolSize: 2,
            smooth: true,
            itemStyle: {
              color: key.color
            },
            lineStyle: {
              color: key.color
            }
          }
        ]
      };
      return opt;
    },
    initChart(option) {
      if (!this.chart) {
        let dom = this.$refs.chart;
        this.chart = new EchartUtil();
        this.chart.init(dom);
      }
      this.chart.setOption(option);
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
  border: 1px solid #8888;
  border-radius: 0.3rem;
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
  border: 1px solid rgba(255, 0, 0, 1);
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
  height: 2rem;
}
.chart__container--content {
  height: calc(100% - 2rem);
  width: 100%;
}
.chart__container--content div {
  width: 100%;
  height: 100%;
}
.chart__container--legend {
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  bottom: 0.2rem;
}
.chart__container--legend > div {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 0.5rem;
  cursor: pointer;
}
.chart__container--legend > div div {
  min-width: 2rem;
  min-height: 0.5rem;
  margin-left: 0.2rem;
}
.chart__container--legend > div.isActive div {
  border: 1px solid rgba(255, 0, 0, 0.5);
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
/deep/ .ivu-table td {
  background-color: transparent !important;
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

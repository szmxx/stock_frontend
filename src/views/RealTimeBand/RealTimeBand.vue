<template>
  <div class="realtime">
    <div class="chart__container">
      <div ref="chart"></div>
    </div>
    <div class="stock__container">
      <div v-for="(item, i) in stocklist" :key="i">
        {{ item.code }}
      </div>
    </div>
  </div>
</template>

<script>
import EchartUtil from "@/utils/EchartUtil";
export default {
  data() {
    return {
      stocklist: []
    };
  },
  beforeMount() {
    this.initData();
  },
  mounted() {},
  methods: {
    initData() {
      let { stocklist } = this.$store.getters.userInfo;
      this.sendRequest(stocklist);
    },
    initChart(option) {
      if (!this.chart) {
        let dom = this.$refs.chart;
        this.chart = new EchartUtil();
        this.chart.init(dom);
      }
      this.chart.setOption(option);
    },
    sendRequest() {},
    dealWithTypePrefix(text, isStock = true) {
      let prefix = [],
        num = -1;
      num = Number(text);
      if (isStock) {
        // 排除NAN
        if (num === num) {
          num = num + "";
          if (num.indexOf("6") === 0 && num.length === 6) {
            prefix.push("sh");
            if (num.indexOf("688") === 0) {
              prefix.push("科创");
            }
          } else if (num.indexOf("0") === 0 && num.length === 6) {
            prefix.push("sz");
            if (num.indexOf("002") === 0) {
              prefix.push("中小创");
            }
          } else if (num.indexOf("300") === 0 && num.length === 6) {
            prefix.push("sz");
            prefix.push("创业板");
          } else if (num.length <= 5) {
            prefix.push("hk_");
            prefix.push("港股");
          }
        } else {
          prefix.push("gb_");
          prefix.push("美股");
        }
      } else {
        prefix.push("fu_");
        prefix.push("基金");
      }
      return prefix;
    }
  }
};
</script>

<style scoped>
.realtime {
  width: 100%;
  height: 100%;
}
.chart__container {
  height: 10rem;
}
.chart__container div {
  height: 100%;
}
.stock__container {
  display: flex;
}
</style>

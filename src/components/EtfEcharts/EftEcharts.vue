<template>
  <div ref="chart" class="container"></div>
</template>

<script>
import EchartUtil from "@/utils/EchartUtil";
export default {
  data() {
    return {
      chart: null
    };
  },
  props: {
    option: {
      type: Object,
      default: () => {}
    },
    theme: {
      type: String,
      default: "macarons"
    },
    width: {
      type: String,
      default: "auto"
    },
    height: {
      type: String,
      default: "auto"
    },
    renderer: {
      type: String,
      default: "canvas"
    },
    devicePixelRatio: {
      type: Number,
      default: window.devicePixelRatio
    }
  },
  watch: {},
  mounted() {
    let dom = this.$refs.chart;
    this.chart = new EchartUtil(dom, this.theme, {
      width: this.width,
      height: this.height,
      renderer: this.renderer,
      devicePixelRatio: this.devicePixelRatio
    });
    this.setOption(this.option);
  },
  setOption(option, notMerge = false, lazyUpdate = false) {
    if (typeof option !== "object" && Array.isArray(option)) {
      return;
    }
    if (Object.keys(option).length > -1) {
      this.chart.setOption(option, notMerge, lazyUpdate);
    }
  }
};
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
}
</style>

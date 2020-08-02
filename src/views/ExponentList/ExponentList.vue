<template>
  <div class="exponent exponent__container">
    <div class="exponent__search">
      <input
        type="text"
        placeholder="输入股票..."
        v-model="value"
        @input="query"
      />
      <h2>指数检索系统</h2>
    </div>
    <div class="exponent__item" v-for="(item, i) in list" :key="i">
      <div class="exponent__item--header">
        <h2>{{ item.name }}</h2>
      </div>
      <perfect-scrollbar>
        <div class="exponent__item--item">
          <div
            class="exponent__item--content"
            v-for="(cell, j) in item.list"
            :key="j"
            :style="{ background: cell.color }"
            @click="go(cell.name)"
          >
            {{ cell.name }}
          </div>
        </div>
      </perfect-scrollbar>
    </div>
  </div>
</template>

<script>
import {
  getExpontTable50,
  getExpontTable300,
  getExpontTableHK,
  getExpontTableChina
} from "@/api/exponent";
export default {
  data() {
    return {
      list: [],
      originlist: [],
      value: ""
    };
  },
  beforeMount() {
    this.initData(
      function(list) {
        this.list = list;
        this.originlist = list;
      }.bind(this)
    );
  },
  methods: {
    async initData(callback) {
      let list = [];
      let stock50 = await getExpontTable50();
      list.push({
        name: "上证50股票列表",
        list: stock50.list
      });
      let stock300 = await getExpontTable300();
      list.push({
        name: "沪深300股票列表",
        list: stock300.list
      });
      let stockhk = await getExpontTableHK();
      list.push({
        name: "香港股票列表",
        list: stockhk.list
      });
      let stockchina = await getExpontTableChina();
      list.push({
        name: "中概股股票列表",
        list: stockchina.list
      });
      callback(list);
    },
    query() {
      let temp = JSON.parse(JSON.stringify(this.originlist));
      let val = this.value;
      if (val) {
        for (let i = 0; i < temp.length; i++) {
          temp[i].list = temp[i].list.filter(item => {
            return item.name.indexOf(val) > -1;
          });
        }
      }
      this.list = temp;
    },
    go(name) {
      this.$router.push({
        name: "Home",
        params: {
          type: "stock",
          value: [
            {
              name: name
            }
          ]
        }
      });
    }
  }
};
</script>
<style scoped>
.exponent__container {
  position: relative;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  overflow: auto;
}

.exponent__search {
  display: flex;
  align-items: center;
  padding-left: 1rem;
  height: 4rem;
  border-bottom: 1px solid #fff;
}
.exponent__search input {
  min-width: 4rem;
  padding: 0.3rem;
  margin-right: 30%;
  border: 1px solid #8888;
}
.exponent__item {
  height: 30%;
  background: rgba(0, 0, 0, 0.3);
  margin: 0.5rem 1rem;
}
.exponent__item .ps {
  height: calc(100% - 2rem);
  border-top: 1px solid #fff;
}
.exponent__item--header {
  height: 2rem;
  padding-left: 1rem;
}
.exponent__item--item {
  display: flex;
  flex-wrap: wrap;
  padding: 0.3rem 1rem;
}
.exponent__item--content {
  min-width: 5.5rem;
  max-height: 2rem;
  padding: 0.3rem;
  margin: 0.5rem;
  text-align: center;
  cursor: pointer;
}
</style>

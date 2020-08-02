<template>
  <div class="board board__container">
    <div class="board__list">
      <div class="item item__container" v-for="(item, ind) in list" :key="ind">
        <div class="item__container--header">
          <h3>{{ list[ind].name }}</h3>
        </div>
        <perfect-scrollbar class="item__container--content">
          <div
            v-for="(i, j) in item.list"
            :key="j"
            class="item__container--item"
            :class="{ active: curBoard == i.name }"
            :style="{ background: i.color }"
            @click="getSingleBoardList(i.name, list[ind].type)"
          >
            {{ i.name }}
          </div>
        </perfect-scrollbar>
      </div>
    </div>
    <div class="chart__container">
      <div class="chart__container--header">
        <h3 @click="queryBoard">{{ curBoard }}--历史优质股</h3>
        <div class="chart__container--operate">
          <div
            v-for="(item, i) in operatelist"
            :key="i"
            :style="{ background: item.color }"
            :class="{ active: item.name === curSelectOperate }"
            @click="sortByOperateName(item.name)"
          >
            <span>{{ item.name }}</span>
          </div>
        </div>
        <div class="chart__container--legend">
          <div v-for="(item, i) in weeklist" :key="i">
            <div :style="{ background: item.color }"></div>
            <span>{{ item.name }}</span>
          </div>
        </div>
      </div>
      <div class="chart__container--content">
        <div
          v-for="(i, j) in curBoardList"
          :key="j"
          class="chart__container--item"
        >
          <div
            v-for="(k, q) in i.list"
            :key="q"
            class="chart__value"
            @click="toggle(k['名称'])"
            @contextmenu="go($event, k['名称'])"
            :style="{ background: '#000' }"
          >
            {{ k["名称"] }}({{ k["代码"] }})
            <i
              v-if="k['涨跌幅'].indexOf('-') > -1 && k['涨跌幅'] !== '-'"
              class="chart__value--down"
            />
            <i v-else class="chart__value--up" />
            <div class="chart__value--details" v-if="k['名称'] == curStockName">
              <div title="最新价">{{ k["最新价"] }}</div>
              <div title="昨收">{{ k["昨收"] }}</div>
              <div title="涨跌幅">{{ k["涨跌幅"] }}</div>
              <div title="成交量手">{{ k["成交量手"] }}</div>
              <div title="换手率">{{ k["换手率"] }}</div>
              <div title="市盈率">{{ k["市盈率"] }}</div>
            </div>
          </div>
          <div
            class="chart__axis"
            :class="
              calucateWeek(i.name) === 1
                ? 'one'
                : calucateWeek(i.name) === 2
                ? 'two'
                : calucateWeek(i.name) === 3
                ? 'three'
                : calucateWeek(i.name) === 4
                ? 'four'
                : calucateWeek(i.name) === 5
                ? 'five'
                : ''
            "
          >
            {{ i.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getIndustryNameList,
  getConceptNameList,
  getIndustryByName,
  getConceptByName
} from "@/api/board";
import { getRandomColor, calucateWeek } from "@/utils/common";
let originlist = [];
export default {
  data() {
    return {
      list: [],
      curStockName: -1,
      curBoard: "",
      curBoardList: [],
      calucateWeek: null,
      curSelectOperate: "涨幅率",
      operatelist: [
        {
          name: "涨幅率",
          color: "#ff00ff"
        },
        {
          name: "市盈率",
          color: "#ff0000"
        },
        {
          name: "股价",
          color: "#00ff00"
        },
        {
          name: "成交量",
          color: "#0000ff"
        },
        {
          name: "换手率",
          color: "#00ffff"
        }
      ],
      weeklist: [
        {
          name: "周一",
          color: "#00ff00"
        },
        {
          name: "周二",
          color: "#ffff00"
        },
        {
          name: "周三",
          color: "#00ffff"
        },
        {
          name: "周四",
          color: "#0000ff"
        },
        {
          name: "周五",
          color: "#ff0000"
        }
      ]
    };
  },
  beforeMount() {
    this.calucateWeek = calucateWeek;
    this.initData(
      function(list1, list2) {
        this.list = [
          {
            name: "概念板块列表",
            type: "concept",
            list: list1
          },
          {
            name: "行业板块列表",
            type: "industry",
            list: list2
          }
        ];
        let data = this.$route.params;
        if (data && Object.keys(data).length) {
          this.curBoard = data.value;
          this.getSingleBoardList(data.value, data.type);
        } else {
          this.curBoard = list1[0].name;
          this.getSingleBoardList(list1[0].name, "concept");
        }
      }.bind(this)
    );
  },
  destroyed() {
    originlist = null;
  },
  methods: {
    async initData(callback) {
      let conceptlist = await getIndustryNameList();
      let industrylist = await getConceptNameList();
      callback(industrylist.list, conceptlist.list);
    },
    async getSingleBoardList(name, type) {
      if (name && type) {
        this.curBoard = name;
        let params = {
          name: name
        };
        let result = [];
        if (type === "concept") {
          let res = await getConceptByName(params);
          result = this.dealWithChartData(res.list);
        } else {
          let res = await getIndustryByName(params);
          result = this.dealWithChartData(res.list);
        }
        this.curBoardList = result;
        originlist = JSON.parse(JSON.stringify(this.curBoardList));
      }
    },
    sortByOperateName(type) {
      this.curSelectOperate = type;
      let operateName = 0,
        tool = false,
        idetifier = "";
      switch (type) {
        case "市盈率":
          operateName = "市盈率";
          break;
        case "股价":
          operateName = "最新价";
          break;
        case "成交量":
          operateName = "成交量手";
          idetifier = "万";
          tool = true;
          break;
        case "换手率":
          operateName = "换手率";
          idetifier = "%";
          tool = true;
          break;
        default:
          operateName = 0;
          break;
      }
      if (operateName !== 0) {
        for (let i = 0; i < this.curBoardList.length; i++) {
          let list = this.curBoardList[i].list;
          list.sort(function(a, b) {
            let anum = 1,
              bnum = 1;
            let a1 = Number(
              tool
                ? a[operateName].indexOf(idetifier) > -1
                  ? a[operateName].replace(idetifier, "")
                  : a[operateName] && (anum = 1 / 10000)
                : a[operateName]
            );
            let b1 = Number(
              tool
                ? b[operateName].indexOf(idetifier) > -1
                  ? b[operateName].replace(idetifier, "")
                  : b[operateName] && (bnum = 1 / 10000)
                : b[operateName]
            );
            return a1 * anum - b1 * bnum > 0 ? -1 : 1;
          });
        }
      } else {
        debugger;
        for (let i = 0; i < originlist.length; i++) {
          let list = JSON.parse(JSON.stringify(originlist[i].list));
          this.$set(this.curBoardList[i], "list", list);
        }
      }
    },
    dealWithChartData(datas) {
      let result = [];
      if (Array.isArray(datas) && datas.length) {
        datas.forEach(item => {
          let temp = {
            name: item["日期"],
            list: []
          };
          let res = item["结果"];
          res.forEach(j => {
            j.show = false;
            j.color = getRandomColor();
            temp.list.push(j);
          });
          result.push(temp);
        });
      }
      let res = result.reduce((prev, cur) => {
        let key = cur.name;
        let names = prev.map(item => item.name) || [];
        if (names.indexOf(key) > -1) {
          let index = names.indexOf(key);
          prev[index].list = prev[index].list.concat(cur.list);
        } else {
          prev.push(cur);
        }
        return prev;
      }, []);
      return res;
    },
    toggle(i) {
      if (this.curStockName == i) {
        this.curStockName = -1;
      } else {
        this.curStockName = i;
      }
    },
    go(e, name) {
      e.preventDefault();
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
    },
    queryBoard() {
      let url = `https://www.baidu.com/s?ie=utf-8&f=3&rsv_bp=1&rsv_idx=1&tn=baidu&wd=${this.curBoard}行业`;
      window.open(url);
    }
  }
};
</script>

<style scoped>
.board__container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: auto;
  background: rgba(0, 0, 0, 0.3);
}
.board__list {
  display: flex;
  width: 100%;
  height: 50%;
}
.item__container {
  width: 50%;
  height: calc(100% - 2rem);
  margin: 1rem 1rem 0rem 1rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid #ffff00;
}

.item__container--header {
  padding-left: 0.5rem;
  height: 7%;
  cursor: pointer;
}
.item__container--content {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  max-height: 93%;
  border-top: 1px solid #fff;
}
.item__container--item {
  min-width: 5rem;
  max-height: 2rem;
  margin: 0.5rem;
  padding: 0.3rem;
  text-align: center;
  cursor: pointer;
}
.item__container--item.active {
  background: #ff0000 !important;
  border: 1px solid #ffff00;
}
.chart__container {
  background: rgba(0, 0, 0, 0.3);
  margin: 0rem 1rem 0rem 1rem;
}
.chart__container--header {
  position: relative;
  height: 7%;
  padding: 0.5rem 0 0.5rem 0.5rem;
  border-bottom: 0.1rem solid #aaa;
}
.chart__container--operate {
  position: absolute;
  top: 0.5rem;
  left: 15rem;
  display: flex;
}
.chart__container--legend {
  position: absolute;
  top: 0.4rem;
  right: 1rem;
  display: flex;
}
.chart__container--legend > div,
.chart__container--operate > div {
  min-width: 4rem;
  margin: 0rem 1rem;
  border: 0.1rem solid #00ff00;
  border-radius: 0.3rem;
  background: #000000;
  font-weight: 1000;
  text-align: center;
  box-shadow: 0.1rem 0.2rem 0.2rem rgba(255, 0, 0, 0.8);
}
.chart__container--operate > div.active {
  background: #000000 !important;
}
.chart__container--legend > div div {
  display: inline-block;
  min-width: 0.5rem;
  min-height: 0.5rem;
  border-radius: 50%;
  margin: 0 0.5rem;
}
.chart__container--content {
  display: flex;
  height: 93%;
}
.chart__container--item {
  margin: 0.1rem 0.5rem;
  text-align: center;
  cursor: pointer;
}
.chart__value {
  min-width: 3rem;
  min-height: 1.5rem;
  margin: 0.3rem 0;
  padding: 0.3rem;
}
.chart__value--down {
  float: right;
  width: 0.4rem;
  height: 0.4rem;
  background: #00ff00;
  border: 1px solid #00ff00;
  border-radius: 50%;
  margin: 0.4rem 0.1rem 0 0.5rem;
}
.chart__value--up {
  float: right;
  width: 0.4rem;
  height: 0.4rem;
  background: #ff0000;
  border: 1px solid #ff0000;
  border-radius: 50%;
  margin: 0.4rem 0.1rem 0 0.5rem;
}
.chart__value--details {
  border: 1px solid #eee;
}
.chart__axis {
  font-weight: 1000;
  padding: 0.3rem;
  border-top: 1px solid #fff;
}
.chart__axis.one {
  color: #00ff00;
}
.chart__axis.two {
  color: #ffff00;
}
.chart__axis.three {
  color: #00ffff;
}
.chart__axis.four {
  color: #0000ff;
}
.chart__axis.five {
  color: #ff0000;
}
</style>

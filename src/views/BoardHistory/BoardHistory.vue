<template>
  <div class="board board__container">
    <div class="chart chart__container" v-for="(item, ind) in list" :key="ind">
      <div class="chart__container--header">
        <h3>{{ list[ind].name }}</h3>
        <div class="chart__container--legend">
          <div
            v-for="(week, i) in weeklist"
            :key="i"
            @click="filterWeek(ind, week.name)"
          >
            <div :style="{ background: week.color }"></div>
            <span>{{ week.name }}</span>
          </div>
        </div>
      </div>
      <perfect-scrollbar class="chart__container--content">
        <div
          v-for="(i, j) in item.list"
          :key="j"
          class="chart__container--item"
        >
          <div
            v-for="(k, q) in i.list"
            :key="q"
            class="chart__value"
            @click="toggle(k['板块名称'])"
            @contextmenu="go($event, list[ind].type, k['板块名称'])"
            :style="{ background: '#000' }"
          >
            {{ k["板块名称"] }}
            <span>{{ k["排名"] }}</span>
            <i
              v-if="k['涨跌幅'].indexOf('-') > -1 && k['涨跌幅'] !== '-'"
              class="chart__value--down"
            />
            <i v-else class="chart__value--up" />
            <div
              class="chart__value--details"
              v-if="k['板块名称'] == curBoardName"
            >
              <div title="涨跌幅">{{ k["涨跌幅"] }}</div>
              <div title="换手率">{{ k["换手率"] }}</div>
              <div title="涨跌家数">{{ k["涨跌家数"] }}</div>
              <div title="领涨股票">{{ k["领涨股票"] }}</div>
              <div title="领涨跌幅">{{ k["领涨跌幅"] }}</div>
            </div>
          </div>
          <div
            class="chart__axis"
            @click="queryDateInfo(i.name)"
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
      </perfect-scrollbar>
    </div>
  </div>
</template>

<script>
import { getConceptRankList, getIndustryRankList } from "@/api/board";
import { getRandomColor, calucateWeek } from "@/utils/common";
let originlist = [];
export default {
  data() {
    return {
      list: [],
      curBoardName: -1,
      calucateWeek: null,
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
        },
        {
          name: "ALL",
          color: "#00ff00"
        }
      ]
    };
  },
  beforeMount() {
    this.calucateWeek = calucateWeek;
    this.initData(
      function(list1, list2) {
        let industrylist = this.dealWithChartData(list1);
        let conceptlist = this.dealWithChartData(list2);
        this.list = [
          {
            name: "概念板块涨幅历史图",
            type: "concept",
            list: conceptlist
          },
          {
            name: "行业板块涨幅历史图",
            type: "industry",
            list: industrylist
          }
        ];
        originlist = JSON.parse(JSON.stringify(this.list));
      }.bind(this)
    );
  },
  destroyed() {
    originlist = null;
  },
  methods: {
    async initData(callback) {
      let conceptlist = await getConceptRankList();
      let industrylist = await getIndustryRankList();
      callback(industrylist, conceptlist);
    },
    dealWithChartData(datas) {
      let result = [];
      if (Array.isArray(datas) && datas.length) {
        datas.forEach(data => {
          const { name, list } = data;
          let temp = {
            name: name,
            list: []
          };
          if (Array.isArray(list) && list.length) {
            list.forEach(item => {
              let res = item["结果"];
              res.forEach(j => {
                j.show = false;
                j.color = getRandomColor();
                temp.list.push(j);
              });
            });
          }
          result.push(temp);
        });
      }
      // 升序
      result.sort(function(a, b) {
        let a1 = Date.parse(new Date(a.name.replace("-", "/")));
        let b1 = Date.parse(new Date(b.name.replace("-", "/")));
        return a1 > b1 ? 1 : -1;
      });
      return result;
    },
    filterWeek(index, week) {
      let code = 0;
      switch (week) {
        case "周一":
          code = 1;
          break;
        case "周二":
          code = 2;
          break;
        case "周三":
          code = 3;
          break;
        case "周四":
          code = 4;
          break;
        case "周五":
          code = 5;
          break;
        default:
          code = 0;
          break;
      }
      let list = originlist[index].list;
      if (list.length && code !== 0) {
        let newlist = list.filter(item => {
          let { name } = item;
          let week_code = calucateWeek(name);
          return week_code === code;
        });
        debugger;
        this.$set(this.list[index], "list", newlist);
      } else {
        this.$set(this.list[index], "list", list);
      }
    },
    queryDateInfo(name) {
      let url = `http://search.sina.com.cn/?c=news&q=${name}+%B9%C9%CA%D0&range=all&num=10&col=&source=&from=&country=&size=&time=&a=&sort=count`;
      window.open(url);
    },
    toggle(i) {
      if (this.curBoardName === i) {
        this.curBoardName = -1;
      } else {
        this.curBoardName = i;
      }
    },
    go(e, type, name) {
      e.preventDefault();
      this.$router.push({
        name: "BoardList",
        params: {
          type: type,
          value: name
        }
      });
    }
  }
};
</script>

<style scoped>
.board__container {
  position: relative;
  width: 100%;
  height: 100%;
  font-size: 12px;
}
.chart__container {
  height: 50%;
  background: rgba(0, 0, 0, 0.3);
}
.chart__container--header {
  position: relative;
  padding: 0.25rem 0 0 0.5rem;
  height: 7%;
  vertical-align: bottom;
}
.chart__container--legend {
  position: absolute;
  top: 0.3rem;
  right: 1rem;
  display: flex;
}
.chart__container--legend > div {
  min-width: 4rem;
  margin: 0rem 1rem;
  border: 0.1rem solid #00ff00;
  border-radius: 0.3rem;
  background: #000000;
  font-weight: 1000;
  box-shadow: 0.1rem 0.2rem 0.1rem rgba(255, 0, 0, 0.3);
  user-select: none;
  cursor: pointer;
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
  border-top: 1px solid #fff;
  border-bottom: 1px solid #fff;
}
.chart__container--item {
  margin: 0.1rem 0.5rem;
  text-align: center;
  cursor: pointer;
}
.chart__value {
  min-width: 6rem;
  min-height: 1.85rem;
  margin: 0.45rem 0;
  padding: 0.3rem;
}
.chart__value--details {
  border: 1px solid #eee;
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
.chart__axis {
  padding: 0.3rem;
  border-top: 1px solid #fff;
  font-weight: 1000;
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

<template>
  <div class="portal">
    <div class="header portal__header">
      <h2>{{ sysName }}</h2>
      <div>
        <input type="button" value="注册系统" @click="registry" />
        <input type="button" value="Layout" @click="layout" />
      </div>
    </div>
    <div class="portal__container">
      <perfect-scrollbar>
        <div
          v-for="(item, i) in list"
          :key="i"
          :style="{ background: item.color }"
          :data-to="item.link"
          class="portal__container--item"
          @click="openPage(item.link)"
        >
          <span>{{ item.name }}</span>
        </div>
      </perfect-scrollbar>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      list: [],
      sysName: ""
    };
  },
  beforeMount() {
    this.sysName = this.$store.getters.sysname;
    this.initPortalList();
  },
  methods: {
    ...mapActions(["getPortalList", "userLayout"]),
    async initPortalList() {
      let list = this.$store.getters.userInfo.portallist;
      console.log(list);
      this.list = await this.getPortalList({ list: list });
      console.log(this.list);
    },
    openPage(link) {
      window.open(link);
    },
    layout() {
      this.userLayout().then(() => {
        this.$router.replace({ name: "Login" });
      });
    },
    registry() {
      this.$router.push({
        name: "Registry",
        params: {
          data: ["注册系统"]
        }
      });
    }
  }
};
</script>

<style scoped>
.portal {
  position: relative;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
}
.portal__header {
  position: absolute;
  height: 3rem;
  width: 100%;
  line-height: 3rem;
  text-align: center;
  background: rgba(0, 0, 0, 0.3);
}
.portal__header > div {
  position: absolute;
  top: 0;
  right: 1rem;
  height: 100%;
}
.portal__header div input {
  line-height: 100%;
  padding: 0.3rem;
  color: #fff;
  border: 1px solid #fff;
  border-radius: 1rem;
  margin: 0 0.5rem;
  min-width: 6rem;
  outline: 0;
  cursor: pointer;
  background: transparent;
}
.portal__container {
  height: 100%;
  margin: 0 5rem;
  padding: 3rem 0;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.5);
}
.portal__container .ps {
  height: 90%;
}
.portal__container .portal__container--item {
  display: inline-block;
  min-width: 5rem;
  min-height: 2rem;
  padding: 0.5rem;
  margin: 1rem;
  text-align: center;
  vertical-align: bottom;
  cursor: pointer;
}
</style>

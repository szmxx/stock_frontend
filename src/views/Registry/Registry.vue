<template>
  <div class="registry__container">
    <div class="registry__container--type">
      <div v-for="(item, i) in list" :key="i" @click="toggle(item)">
        <input type="button" :value="item" />
      </div>
    </div>
    <div class="registry__content">
      <div class="registry__content--header">
        <h2>{{ curType }}</h2>
      </div>
      <div v-if="curType === '注册账号'" class="registry__content--item">
        <div class="form form__container">
          <input type="text" placeholder="输入账号名..." v-model="name" />
          <input type="text" placeholder="输入密码..." v-model="code" />
          <input type="button" value="确定" @click="registryAccount" />
        </div>
      </div>
      <div v-if="curType === '注册系统'" class="registry__content--item">
        <div class="form form__container">
          <input type="text" placeholder="输入系统名..." v-model="name" />
          <input type="text" placeholder="输入链接..." v-model="code" />
          <input type="button" value="确定" @click="registrySys" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getRandomColor } from "@/utils/common";
import { registryAcc, registrySys } from "@/api/user";
export default {
  props: {
    list: {
      type: Array,
      default: () => {
        return ["注册账号"];
      }
    }
  },
  data() {
    return {
      curType: "",
      name: "",
      code: ""
    };
  },
  beforeMount() {
    // 接收路由参数
    if (this.$route.params && Object.keys(this.$route.params).length) {
      let { data } = this.$route.params;
      this.list = data;
    }
    this.curType = this.list[0];
  },
  methods: {
    toggle(type) {
      this.curType = type;
    },
    reset() {
      this.name = "";
      this.code = "";
    },
    async registrySys() {
      if (this.code && this.name) {
        let params = {
          name: this.name,
          link: this.code,
          color: getRandomColor()
        };
        let res = await registrySys(params);
        if (res.status === "success") {
          this.$Message.success(res.message);
        } else {
          this.$Message.error(res.message || "注册失败！");
        }
      } else {
        this.$Message.warning("输入不能为空！");
      }
      this.reset();
    },
    async registryAccount() {
      if (this.name && this.code) {
        let params = {
          name: this.name.trim(),
          password: this.code.trim()
        };
        const res = await registryAcc(params);
        if (res.status === "success") {
          this.$Message.success(res.message);
        } else {
          this.$router.replace({ name: "Login" });
          this.$Message.error(res.message || "注册失败！");
        }
      } else {
        this.$Message.warning("输入不能为空！");
      }
      this.reset();
    }
  }
};
</script>
<style scoped>
.registry__container {
  height: 100%;
  color: #fff;
}
.registry__container--type {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 3rem;
  background: rgba(0, 0, 0, 0.3);
}
.registry__container--type input {
  margin: 0 1rem;
  padding: 0.5rem;
  border: 0;
}
.registry__content {
  height: 90%;
  text-align: center;
}
.registry__content--header {
  position: absolute;
  top: 30%;
  width: 100%;
}
.registry__content--item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.form__container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
.form__container input[type="text"] {
  padding: 0.3rem;
  margin: 0 0.5rem;
  border: 1px solid #eee;
  border-radius: 0.5rem;
  outline: 0;
}
.form__container input[type="button"] {
  min-width: 4rem;
  padding: 0.3rem;
  border: 0;
}
</style>

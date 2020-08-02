<template>
  <div class="login">
    <div class="header login__header">
      <h2>{{ sysName }}</h2>
    </div>
    <div class="login__container">
      <div class="form login__form">
        <div class="login__form--item">
          <input
            type="text"
            name="username"
            placeholder="用户名"
            v-model="username"
          />
          <div>
            <a @click="go('Registry')">注册?</a>
          </div>
        </div>
        <div class="login__form--item">
          <input
            type="password"
            name="password"
            placeholder="密码"
            v-model="password"
          />
          <div>
            <a @click="go('Portal')">忘记密码?</a>
          </div>
        </div>
        <div class="login__form--item">
          <input
            type="checkbox"
            id="remenber"
            name="remenber"
            v-model="remenber"
          />
          <label for="remenber">记住我</label>
        </div>
        <div class="login__form--item">
          <input type="button" value="登录" @click="login()" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      username: "",
      password: "",
      sysName: "",
      remenber: false
    };
  },
  beforeMount() {
    this.sysName = this.$store.getters.sysname;
  },
  methods: {
    ...mapActions(["userLogin", "userLayout"]),
    async login() {
      const username = this.username.trim();
      const password = this.password.trim();
      if (username && password) {
        try {
          let res = await this.userLogin({
            username,
            password
          });
          if (res.status === "success") {
            this.$Message.success(res.message);
            this.$router.push({ name: "Portal" });
          } else {
            this.$Message.error(res.message);
          }
        } catch (e) {
          console.error(e);
        }
      } else {
        this.$Message.warning("用户名和密码不能为空！");
      }
    },
    go(path) {
      this.$router.push({ name: path });
    }
  }
};
</script>
<style scoped>
.login {
  height: 100%;
  background: rgba(252, 251, 251, 0.5);
}
.login__header {
  position: absolute;
  height: 3rem;
  width: 100%;
  line-height: 3rem;
  text-align: center;
  background: rgba(0, 0, 0, 0.4);
}
.login__container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.login__form {
  padding: 4rem 8rem;
  background: rgba(0, 0, 0, 0.5);
}
.login__form--item input {
  margin: 1.5rem 0 0 0;
  padding: 0.3rem 0.5rem;
  min-width: 5rem;
  border: 0;
}
.login__form--item input[type="checkbox"],
.login__form--item input[type="checkbox"] + label {
  float: left;
  min-width: 0;
  margin: 0;
  padding: 0 0.3rem;
  font-size: 0.7rem;
  line-height: 100%;
}
.login__form--item div {
  text-align: right;
  font-size: 0.7rem;
  padding: 0.3rem 0 0 0;
}
</style>

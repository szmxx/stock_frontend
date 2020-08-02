<template>
  <div class="modal__container">
    <div class="modal__content">
      <div class="header modal__header">
        <span>{{ type }}</span>
        <div @click="closeModal"></div>
      </div>
      <div class="content content__container">
        <div>
          <input type="text" v-model="name" placeholder="输入名称..." />
        </div>
        <div>
          <input type="text" v-model="code" placeholder="输入代码..." />
        </div>
      </div>
      <div class="footer footer__container">
        <input type="button" value="确认" @click="submitInfo" />
        <input type="button" value="重置" @click="cancelInfo" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "EtfModal",
  props: {
    type: {
      type: String,
      default: "基金"
    }
  },
  data() {
    return {
      name: "",
      code: ""
    };
  },
  methods: {
    submitInfo() {
      if (this.name) {
        let params = {
          name: this.name,
          code: this.code
        };
        this.$emit("submit", params);
        this.$emit("close");
      } else {
        this.$Message.warning(`${this.type}名称不能为空！`);
      }
    },
    cancelInfo() {
      this.name = "";
      this.code = "";
    },
    closeModal() {
      this.$emit("close");
    }
  }
};
</script>

<style scoped>
.modal__container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  color: #fff;
  background: rgba(0, 0, 0, 0.3);
  z-index: 99;
}
.modal__content {
  height: 30%;
  min-width: 20%;
  border: 1px solid #000;
  border-radius: 0.1rem;
  background: rgba(0, 0, 0, 0.5);
}
.modal__header {
  height: 2rem;
  padding-left: 0.5rem;
  line-height: 2rem;
  font-weight: 1000;
  background: rgba(0, 0, 0, 0.5);
}
.modal__header div {
  float: right;
  width: 1.3rem;
  height: 1.3rem;
  margin: 0.3rem 0.3rem;
  outline: 0.5rem solid #fff;
  outline-offset: -1.1rem;
  transform: rotate(45deg);
  border: 1px solid #fff;
  border-radius: 50%;
}
.content__container {
  margin-top: 2rem;
}
.content__container div {
  margin: 10% 0;
  text-align: center;
}
.content__container div input {
  border: 0;
  min-width: 50%;
  padding: 0.3rem;
}
.footer__container {
  display: flex;
  justify-content: center;
  height: 2rem;
}
.footer__container input {
  min-width: 20%;
  border: 0;
  padding: 0 0.3rem;
  margin: 0 0.5rem;
}
</style>

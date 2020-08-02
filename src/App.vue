<template>
  <div id="app">
    <router-view />
    <div class="basemap"><EtfOLMap></EtfOLMap></div>
  </div>
</template>

<style lang="scss">
html,
body {
  height: 100%;
  padding: 0;
  margin: 0;
  overflow: hidden;
}
#app {
  position: relative;
  width: 100%;
  height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #fff;
  // background: #000;
  .basemap {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: -1;
  }
}
::-webkit-scrollbar {
  width: 5px;
  height: 6px;
  background-color: transparent;
}
/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  width: 0;
  border-radius: 0;
  background-color: transparent;
}
/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  width: 5px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #e7ecf2;
}
/*滑块效果*/
::-webkit-scrollbar-thumb:hover {
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.4);
}
</style>

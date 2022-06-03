<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
  <router-view/>
  <startWindow/>
</template>

<script>
import startWindow from './components/startWindow.vue'

/*
//레이아웃 관련 부분인데 오류가 있어서 주석처리 했습니다.
import Vue from 'vue';
import Antd from 'ant-design-vue';
import App from './App';
import 'ant-design-vue/dist/antd.css';
Vue.config.productionTip = false;

Vue.use(Antd);

new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
});
*/

export default {
  name: 'App',
  components: {
    startWindow,
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

</style>


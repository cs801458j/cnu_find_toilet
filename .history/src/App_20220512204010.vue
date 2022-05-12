<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
  <HelloWorld msg="cnu pjt"/>
  <KakaoMap />
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import KakaoMap from './components/KakaoMap.vue'

export default {
  name: 'App',
  components: {
    HelloWorld,
    KakaoMap
  }
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

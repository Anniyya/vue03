<template>
  <div id="app">
    <manager></manager>
    <!-- <login></login> -->
  </div>
</template>

<script>
import manager from './components/manager.vue'
// import Login from './components/login.vue'
// import Reg from './components/register.vue'

export default {
  name: 'App',
  components: {
    manager
    // Login,
    // Reg
  }
}
</script>

<style>
#app {
  height: 100%;
} 
</style>

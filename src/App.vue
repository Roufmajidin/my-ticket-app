<script setup>
import Sidebar from './components/Sidebar.vue'

</script>

<template>
<div class="app">
    <Sidebar />
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
.content {
  flex: 1;
  padding-left: 250px;
  padding-bottom: 250px;
  /* overflow-x: auto; */

}


.app {
 background-color: white;
  overflow-x: auto;
}
</style>

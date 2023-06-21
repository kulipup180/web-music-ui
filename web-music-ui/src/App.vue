<script setup lang="ts">
import MyAside from "@components/aside.vue";
import Playsong from "@components/playsong.vue";
</script>

<template>
  <div class="common-layout">
    <div class="aside"><my-aside></my-aside></div>
    <div class="container">
      <RouterView></RouterView>
    </div>
  </div>
  <playsong></playsong>
</template>

<style scoped lang="scss">
.common-layout {
  max-height: 860px;
  height: 90vh;
  background: #fff;
  border-radius: 15px;
  display: flex;
  overflow: hidden;
  .aside {
    flex: 0 0 80px;
  }
  .container {
    flex: 1 1 auto;
  }
}
</style>

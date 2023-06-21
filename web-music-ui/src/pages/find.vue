<template>
  <my-nav></my-nav>
  <KeepAlive
    ><div class="main"><RouterView></RouterView></div
  ></KeepAlive>
</template>

<script setup lang="ts">
import MyNav from "@components/nav.vue";
</script>

<style scoped lang="scss">
.main {
  margin-top: 0;
  width: 100%;
  position: relative;
  top: 60px;
  overflow: scroll;
  height: 100%;
}
</style>

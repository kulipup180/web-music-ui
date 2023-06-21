<template>
  <div class="card-item">
    <el-skeleton style="width: 240px" :loading="loading" animated>
      <template #template>
        <el-skeleton-item variant="image" style="width: 140px; height: 140px" />
        <div style="padding: 10px">
          <el-skeleton-item style="width: 50%" />
          <el-skeleton-item variant="text" style="width: 30%" />
          <el-skeleton-item variant="text" style="width: 30%" />
        </div>
      </template>
      <template #default>
        <div class="img"><slot name="img"></slot></div>
        <div class="text">
          <slot name="text"></slot>
        </div>
      </template>
    </el-skeleton>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps({
  loading: Boolean,
});
const loading = ref(props.loading);
</script>

<style scoped lang="scss">
.card-item {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 160px;
  padding: 10px 0;
  border-radius: 10px;
  margin: 0 10px;
  &:hover {
    background-color: darken(white, 5%);
  }

  .text {
    width: 140px;
    color: lightslategrey;
    padding: 0 10px;
    text-align: start;
    font: {
      size: 12px;
    }
  }
}
</style>

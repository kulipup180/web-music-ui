<template>
  <div class="slider">
    <div
      class="banner-item"
      v-for="(banner, index) in visibleImages"
      :class="itemPositionClass(index)"
      :key="index"
    >
      <a :href="banner.url"><img :src="banner.imageUrl" alt="" /></a>
    </div>
  </div>
  <div class="menu">
    <div class="btn btn_pre" @click="prev">
      <i class="iconfont icon-left"></i>
    </div>
    <div class="btn btn_next" @click="next">
      <i class="iconfont icon-right"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getBannerApi } from "@/api/info";
import { vLoading } from "element-plus";
import { computed, onMounted, ref } from "vue";
import type { Ref } from "vue";
//获取banner数据
type bannerItem = {
  imageUrl: string;
  url: string;
  typeTitle: string;
};
type banner = {
  banners: Array<bannerItem>;
  code: number;
};
let banners: Ref<bannerItem[]> = ref([]);
async function getBanner() {
  const banner: banner = await getBannerApi();
  banners.value = banner.banners;
}
//只选3张图进行展示
const currentIndex = ref(0);
const visibleImages = computed(() => {
  console.log(currentIndex.value);
  const startIndex = currentIndex.value;
  const endIndex = startIndex + 3;
  if (endIndex > banners.value.length) {
    return banners.value
      .slice(startIndex, banners.value.length)
      .concat(banners.value.slice(0, endIndex - banners.value.length + 1));
  } else {
    return banners.value.slice(startIndex, endIndex);
  }
});
//绑定左中右类型
type ItemPositionClass = "left" | "center" | "right";
const itemPositionClass = (index: number) => {
  if (index === 0) {
    return "left";
  } else if (index === 1) {
    return "center";
  } else {
    return "right";
  }
};
//banner左右按钮事件
const nextIndex = computed<number>(() => {
  return (currentIndex.value + 1) % banners.value.length;
});
const prevIndex = computed<number>(() => {
  return (currentIndex.value - 1 + banners.value.length) % banners.value.length;
});
function prev() {
  currentIndex.value = prevIndex.value;
  console.log(currentIndex.value);
}
function next() {
  currentIndex.value = nextIndex.value;
}
onMounted(() => {
  getBanner();
});
</script>

<style scoped lang="scss">
.slider {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.5s ease-in-out;
  .banner-item {
    width: 540px;
    position: absolute;
    overflow: hidden;
    z-index: 0;
    border-radius: 10px;

    img {
      width: 100%;
      display: block;
    }
    &.left {
      transform: translateX(-300px);
      filter: brightness(0.7);
    }
    &.right {
      transform: translateX(300px);
      filter: brightness(0.7);
    }
    &.center {
      width: 640px;
      transform: translateX(0);
      z-index: 1;
    }
  }
}
.menu {
  width: 100%;
  height: 30px;
  position: absolute;
  z-index: 2;
  .btn {
    cursor: pointer;
    width: 70px;
    height: 70px;
    position: absolute;
    top: -20px;
    display: flex;
    justify-content: center;
    align-items: center;
    .iconfont {
      color: #fff;
      font-size: 25px;
    }
    &.btn_pre {
      left: 200px;
    }
    &.btn_next {
      right: 200px;
    }
  }
}
</style>

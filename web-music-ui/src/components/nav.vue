<template>
  <nav>
    <div class="header-menu">
      <a
        class="menu-link"
        v-for="(item, index) in menuList"
        :class="{ active: activeIndex === index }"
        :key="index"
        @click="handleSelect(index)"
        >{{ item.title }}</a
      >
    </div>
    <div class="search-bar">
      <input
        type="text"
        placeholder="搜索"
        v-model="keyword"
        @keydown.enter="search"
      />
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
let activeIndex = ref(0);
type menuItem = {
  title: string;
  name: string;
};
const menuList: menuItem[] = [
  { title: "推荐", name: "recommend" },
  { title: "歌单", name: "playlist" },
  { title: "搜索", name: "search" },
  { title: "Mv", name: "mv" },
];
function handleSelect(index: number) {
  activeIndex.value = index;
  router.push({
    name: menuList[index].name,
  });
}
const keyword = ref("");
const route = useRoute();
console.log(route.name);
watch(
  () => route.name,
  (val) => {
    console.log(val);
    if (val === "tracks") {
      activeIndex.value = 1;
    }
  }
);
function search() {
  console.log("跳转页面");
  activeIndex.value = 2;
  router.push({
    name: "search",
    query: {
      keyword: keyword.value,
    },
  });
  // emit("search", keyword.value);
  // console.log("事件触发");

  keyword.value = "";
}
</script>

<style scoped lang="scss">
nav {
  position: fixed;
  border-bottom: solid 1px var(--el-menu-border-color);
  display: flex;
  height: 60px;
  width: 1200px;
  align-items: center;
  justify-content: space-between;
  border-radius: 0 15px 0 0;
  z-index: 10;
  background-color: #fff;
  .header-menu {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 auto;
    height: 100%;
    width: 66%;
    a {
      text-decoration: none;
      color: #000;
      padding: 18px 30px;
      font-size: var(--el-menu-item-font-size);
      word-break: keep-all;
      white-space: nowrap;
      &.active,
      &:hover {
        color: var(--el-color-menu-active);
        border-bottom: 2px solid red;
        outline: 0;
      }
    }
  }
  .search-bar {
    padding-left: 1.5rem;
    height: 35px;
    display: flex;
    width: 15rem;
    padding-right: 3rem;
    input {
      height: 100%;
      width: 100%;
      text-align: center;
      border: none;
      background-color: #f2f3f7;
      border-radius: 15px;
      background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 56.966 56.966' fill='%23717790c7'%3e%3cpath d='M55.146 51.887L41.588 37.786A22.926 22.926 0 0046.984 23c0-12.682-10.318-23-23-23s-23 10.318-23 23 10.318 23 23 23c4.761 0 9.298-1.436 13.177-4.162l13.661 14.208c.571.593 1.339.92 2.162.92.779 0 1.518-.297 2.079-.837a3.004 3.004 0 00.083-4.242zM23.984 6c9.374 0 17 7.626 17 17s-7.626 17-17 17-17-7.626-17-17 7.626-17 17-17z'/%3e%3c/svg%3e");
      background-size: 14px;
      background-repeat: no-repeat;
      background-position: 16px 48%;
    }
  }
}
</style>

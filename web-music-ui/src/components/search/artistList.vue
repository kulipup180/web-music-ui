<template>
  <div class="wrapper">
    <card class="card" v-for="(item, index) in artistList" :key="index">
      <template #img
        ><img
          style="width: 140px; height: 140px; border-radius: 50%"
          :src="item.img1v1Url"
          alt=""
      /></template>
      <template #text>
        <div class="aname">{{ item.name }}</div>
      </template>
    </card>
  </div>
</template>

<script setup lang="ts">
import { getSearchDataApi } from "@/api/info";

import { Artist } from "@/utils/types";
import card from "@components/card.vue";
import { Ref, inject, ref } from "vue";

const keyword = inject("keyword") as string;
console.log(keyword);
const artistList: Ref<Array<Artist>> = ref([]);
async function initArtistSearchData(keyword: string, type: number = 1) {
  const res = await getSearchDataApi(keyword, type);
  artistList.value = res.result.artists;
}

initArtistSearchData(keyword, 100);
</script>

<style scoped lang="scss">
.wrapper {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  padding: 30px 0;
  .aname {
    padding: 10px 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: black;
    font: {
      weight: 500;
      size: 16px;
    }
  }
  .artists:hover {
    text-decoration: underline;
  }
}
</style>

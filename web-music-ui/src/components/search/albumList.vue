<template>
  <div class="wrapper">
    <card v-for="(item, index) in albumList" :key="index" :loading="loading">
      <template #img
        ><img style="width: 140px" :src="item.picUrl" alt=""
      /></template>
      <template #text>
        <div class="aname">{{ item.name }}</div>
        <div class="ctime">{{ formatDate(item.publishTime) }}</div>
        <div class="artists" v-for="aitem in item.artists">
          {{ aitem.name }}
        </div>
      </template>
    </card>
  </div>
</template>

<script setup lang="ts">
import { getSearchDataApi } from "@/api/info";
import { formatDate } from "@/utils/fommater";
import { Album } from "@/utils/types";
import card from "@components/card.vue";
import { Ref, inject, ref } from "vue";
const loading = ref(true);
const keyword = inject("keyword") as string;
console.log(keyword);
const albumList: Ref<Array<Album>> = ref([]);
async function initAlbumSearchData(keyword: string, type: number = 1) {
  const res = await getSearchDataApi(keyword, type);
  albumList.value = res.result.albums;
  loading.value = false;
  console.log(albumList.value);
}

initAlbumSearchData(keyword, 10);
</script>

<style scoped lang="scss">
.wrapper {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  padding: 30px 0;

  .aname {
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

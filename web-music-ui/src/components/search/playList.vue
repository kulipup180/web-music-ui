<template>
  <div class="wrapper">
    <card
      v-for="(item, index) in playList"
      :key="index"
      :loading="loading"
      @click="clickPlaylist(index)"
    >
      <template #img
        ><img style="width: 140px" :src="item.coverImgUrl" alt=""
      /></template>
      <template #text>
        <div class="aname">{{ item.name }}</div>
        <div class="creator">{{ item.creator.nickname }}</div>
      </template>
    </card>
  </div>
</template>

<script setup lang="ts">
import { getPlaylistApi, getSearchDataApi } from "@/api/info";
import { PlayList } from "@/utils/types";
import card from "@components/card.vue";
import { Ref, inject, ref } from "vue";
import { useRouter } from "vue-router";
const loading = ref(true);
const keyword = inject("keyword") as string;
console.log(keyword);
const playList: Ref<Array<PlayList>> = ref([]);
async function initAlbumSearchData(keyword: string, type: number = 1) {
  const res = await getSearchDataApi(keyword, type);
  playList.value = res.result.playlists;
  loading.value = false;
}

initAlbumSearchData(keyword, 1000);

const router = useRouter();
function clickPlaylist(index: number) {
  console.log(playList.value[index].id);
  router.push({
    name: "tracks",
    params: {
      id: playList.value[index].id,
    },
  });
}
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
  .creator:hover {
    text-decoration: underline;
  }
}
</style>

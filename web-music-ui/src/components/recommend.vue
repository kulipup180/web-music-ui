<template>
  <div class="container">
    <banner />
  </div>
  <div class="r-playlist">
    <div class="p-head">
      <div class="p-title">推荐歌单</div>
      <span class="p-more">更多></span>
    </div>
    <div class="p-body">
      <el-skeleton :rows="5" animated :loading="loading">
        <div
          class="p-item"
          v-for="(item, index) in playlists"
          :key="index"
          @click="clickPlaylist(index)"
        >
          <div class="p-card">
            <img :src="item.picUrl" class="image" />
            <div class="p-count">
              <i class="iconfont icon-listen"></i>{{ item.playCount }}
            </div>
          </div>

          <div class="p-name">{{ item.name }}</div>
        </div>
      </el-skeleton>
    </div>
  </div>
</template>

<script setup lang="ts">
import banner from "@components/banner.vue";
import { getPlaylistApi, getPlaylistDetailApi } from "@/api/info";
import { ref } from "vue";
import { useRouter } from "vue-router";

interface playlistIntem {
  id: number;
  name: string;
  picUrl: string;
  playCount: string;
}
let loading = ref(true);
let playlists = ref<playlistIntem[]>([]);
function formatCount(count: number): string {
  if (count > 99999) {
    return (count / 10000).toFixed(1) + "万";
  } else {
    return count.toString();
  }
}
async function getPlaylist() {
  let res = await getPlaylistApi(10);
  if (res.code === 200) {
    res = res.result;
    console.log(res);
    res.map((item: any) => {
      item.playCount = formatCount(item.playCount);
    });
    console.log(res);
    playlists.value = res;
    loading.value = false;
  }
}

const router = useRouter();
function clickPlaylist(index: number) {
  console.log(playlists.value[index].id);
  router.push({
    name: "tracks",
    params: {
      id: playlists.value[index].id,
    },
  });
}

getPlaylist();
</script>

<style scoped lang="scss">
.container {
  width: 1150px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 270px;
  position: relative;
  margin: 0 auto;
}
.r-playlist {
  margin: 20px;
  // display: flex;
  .p-head {
    .p-title {
      font : {
        size: 1.1rem;
        weight: 600;
      }
      position: absolute;
      left: 20px;
    }
    .p-more {
      position: absolute;
      color: lightslategrey;
      font: {
        size: 0.8rem;
      }
      right: 15px;
    }
  }
  .p-body {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-start;
    padding-top: 30px;
    .p-item {
      position: relative;
      img {
        height: 208px;
        width: 208px;
        object-fit: cover;
      }
      margin-right: 15px;
      margin-bottom: 30px;
      .p-count {
        position: absolute;
        right: 0;
        color: #fff;
        top: 0;
        text-align: center;
        background-color: rgba(0, 0, 0, 0.2);
      }
      .p-name {
        width: 208px;
        font-size: 0.9rem;
        text-align: start;
      }
    }
  }
}
</style>

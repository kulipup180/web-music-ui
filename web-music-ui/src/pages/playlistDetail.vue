<template>
  <div class="p-title">
    <el-skeleton style="width: 240px" :loading="loading" animated>
      <template #template>
        <el-skeleton-item
          variant="image"
          style="
            width: 180px;
            height: 180px;
            border-radius: 6px;
            padding-left: 20px;
          "
        />
      </template>
      <template #default>
        <div class="p-img"><img :src="pDetail.coverImgUrl" alt="" /></div>
      </template>
    </el-skeleton>

    <el-skeleton style="width: 240px" :loading="loading" animated>
      <template #template>
        <el-skeleton-item variant="h2" style="width: 800px" />
        <el-skeleton-item variant="text" style="width: 800px" />
        <el-skeleton-item variant="text" style="width: 800px" />
        <el-skeleton-item variant="text" style="width: 800px" />
        <el-skeleton-item variant="text" style="width: 800px" />
      </template>
      <template #default>
        <div class="detail">
          <div class="title">{{ pDetail.name }}</div>
          <div class="create">
            <span class="c-time">{{ formatDate(pDetail.createTime) }}创建</span>
          </div>

          <div class="tags">
            <div class="tag" v-for="(item, index) in pDetail.tags" :key="index">
              <a href="#">{{ item }}</a>
            </div>
          </div>
          <div class="p-num">
            歌曲：<span>{{ pDetail.trackCount }}</span
            >播放：<span>{{ formatCount(pDetail.playCount) }}</span>
          </div>
          <div class="p-des">
            <div class="des">简介：{{ pDetail.description }}</div>
            <div class="toggle-button" @click="toggleDes"></div>
          </div>
          <div class="btn">
            <div class="play" @click="playTrack">
              <i class="iconfont icon-24gf-play"></i>播放
            </div>
            <div class="like"><i class="iconfont icon-jushoucang"></i></div>
            <div class="add" @click="addToPlayList">
              <i class="iconfont icon-jiaru"></i>
            </div>
          </div>
        </div>
      </template>
    </el-skeleton>
  </div>
  <div class="tracks">
    <div class="nav">
      <a
        class="menu-link"
        v-for="(item, index) in playNav"
        :class="{ current: activeIndex === index }"
        :key="index"
        @click="handleSelect(index)"
        >{{ item.title }}</a
      >
    </div>
    <div class="content">
      <KeepAlive><RouterView v-if="isData"></RouterView></KeepAlive>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { Ref } from "vue";
import { useRoute } from "vue-router";
import { getPlaylistDetailApi } from "@/api/info";
import router from "@/router";
import {
  formatDate,
  formatCount,
  formatDuration,
  formatSongData,
} from "@/utils/fommater";
import { getAllSongApi } from "@/api/info";
import { SongOriginItem, SongTableItem, playlistItem } from "@/utils/types";
import { useSongStore } from "@/stores/index";
import { useEventsBus } from "@/utils/useEmitter";
const route = useRoute();
const songStore = useSongStore();

let pDetail: Ref<playlistItem> = ref({
  name: "",
  coverImgUrl: "",
  createTime: 0,
  trackCount: 0,
  subscribedCount: 0,
  description: "",
  tags: [],
  tracks: [],
  playCount: 0,
});
// let tracks: Ref<songItem[]> = ref([]);
let loading = ref(true);
let trackId = ref(0);
async function getPlaylistDetail() {
  const res = await getPlaylistDetailApi(Number(route.params.id));
  if (res.code === 200) {
    pDetail.value = res.playlist;
    loading.value = false;
  }
}
function toggleDes(event: Event) {
  const btn = event.target as HTMLElement;
  btn.classList.toggle("expanded");
  btn.parentElement?.children[0].classList.toggle("expanded");
}
const playNav = [{ title: "歌曲列表", name: "tracks" }];
let activeIndex = ref(0);
function handleSelect(index: number) {
  console.log(index);
  if (index !== activeIndex.value) {
    activeIndex.value = index;

    router.push({
      name: playNav[index].name,
      params: { id: route.params.id },
    });
  }
}
const { emit } = useEventsBus();
// 播放当前歌单 把当前歌单的第一首歌的id传到“playSongChange”事件中
function playTrack() {
  emit("playSongChange", songStore.songList[0].id);
}
//将当前歌单歌曲加入播放列表中
function addToPlayList() {
  songStore.currentSongList.push(...songStore.songList);
}

const isData = ref(false);

async function initTableData() {
  let res = await getAllSongApi(Number(route.params.id));
  songStore.songList = [];
  console.log(res);
  formatSongData(res.songs, songStore.songList);
  isData.value = true;
}
initTableData();

onMounted(() => {
  getPlaylistDetail();
});
</script>

<style scoped lang="scss">
.p-title {
  width: 100%;
  padding-top: 30px;
  display: flex;
  .p-img {
    padding-left: 20px;
    img {
      width: 180px;
      height: 180px;
      border-radius: 6px;
    }
  }
  .detail {
    padding-left: 20px;
    text-align: start;
    span {
      color: rgb(75, 73, 73);
    }
    font: {
      size: 0.8rem;
    }
    .title {
      font: {
        size: 1.2rem;
        weight: 600;
      }
      padding-bottom: 10px;
    }
    .create {
      padding-bottom: 10px;
    }
    .tags {
      display: flex;
      padding-bottom: 10px;
      .tag {
        background-color: rgba($color: #000000, $alpha: 0.4);
        margin-left: 10px;
        border-radius: 20px;
        padding: 2px 10px;
        a {
          color: #fff;
        }
      }
    }
    .p-num {
      span {
        padding-right: 10px;
      }
      padding-bottom: 10px;
    }
    .p-des {
      position: relative;
      .des {
        width: 800px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        &.expanded {
          white-space: normal;
        }
      }

      .toggle-button {
        cursor: pointer;
        position: absolute;
        top: 5px;
        right: -50px;
        width: 0;
        height: 0;
        border-left: 7px solid transparent;
        border-right: 7px solid transparent;
        border-top: 7px solid #000;
        transition: transform 0.4s;
        &.expanded {
          transform: rotate(180deg);
          transform-origin: center;
        }
      }
    }
    .btn {
      padding-top: 15px;
      display: flex;
      & > div {
        border-radius: 5px;
        margin-right: 10px;
        cursor: pointer;
        padding: 6px 10px;
        background-color: #f7f8f9;
      }
      .play {
        color: rgb(232, 39, 90);
        background-color: rgb(253, 240, 235);
      }
    }
  }
}
.tracks {
  padding-top: 20px;

  .nav {
    display: flex;
    padding-left: 20px;
    a {
      margin-right: 25px;
      color: #424141;
      padding-bottom: 5px;
      font: {
        size: 1rem;
        weight: 300;
      }
      &.current {
        font: {
          size: 1.2rem;
          weight: 500;
        }
        border-bottom: 2px solid red;
      }
    }
  }
  .content {
    overflow: hidden auto;
  }
}
</style>

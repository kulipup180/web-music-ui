<template>
  <div class="t-title">
    <h3>当前播放</h3>
    <div class="c-wrapper">
      <span>总{{ songStore.currentSongList.length }}首</span>
      <div class="control">
        <div class="shoucang">
          <i class="iconfont icon-shoucang"></i>收藏全部
        </div>
        <div class="clear" @click="clearList">清空列表</div>
      </div>
    </div>
  </div>
  <div class="list-wrapper">
    <ul>
      <li
        v-for="(item, index) in songStore.currentSongList"
        :key="index"
        :class="{ selected: index === songIndex }"
        @click="playSongFromList(index)"
      >
        <div class="info">
          <div class="text">
            <span class="name">
              {{ item.name }}
            </span>
            <span class="singer"> - {{ item.s_singer }}</span>
          </div>
          <div class="list-btn">
            <div class="link">
              <i class="iconfont icon-24gl-link"></i>
            </div>
            <div class="delete" @click.stop="deleteSong(index)">
              <i class="iconfont icon-shanchu2"></i>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useSongStore } from "@/stores";
import { useEventsBus } from "@/utils/useEmitter";
import { storeToRefs } from "pinia";
import { computed, watch } from "vue";
const songStore = useSongStore();

const { currentPlaySong } = storeToRefs(useSongStore());
const songIndex = computed(() => {
  const index = songStore.currentSongList.findIndex(
    (item) => item.id === currentPlaySong.value.song.id
  );
  return index;
});

const { emit, bus } = useEventsBus();
function playSongFromList(index: number) {
  songStore.updateCurrentPlaySong(2, songStore.currentSongList[index]);
  emit("playSongChange", currentPlaySong.value.song.id);
  emit("playSong", currentPlaySong.value.song.id);
}

function deleteSong(index: number) {
  console.log(index);
  let newCurrentSongList = [...songStore.currentSongList];

  console.log(songStore.currentSongList.length);
  console.log(newCurrentSongList);
  newCurrentSongList.splice(index, 1);
  songStore.currentSongList = newCurrentSongList;
  console.log(songStore.currentSongList[index].name);
  console.log(songIndex.value);
  if (songIndex.value === -1) {
    console.log("切换歌曲");
    if (songStore.currentSongList.length === 0) {
      songStore.updateCurrentPlaySong(0);
      emit("playSongChange", false);
    } else {
      songStore.updateCurrentPlaySong(2, songStore.currentSongList[index]);
      emit("playSongChange", currentPlaySong.value.song.id);
      emit("playSong", currentPlaySong.value.song.id);
    }
  }
}

function clearList() {
  songStore.currentSongList = [];
  emit("playSong", false);
}

//播放搜索歌曲加入当前播放列表

watch(
  () => bus.value.get("addCurrentSongList"),
  (val) => {
    songStore.currentSongList.splice(songIndex.value + 1, 0, val[0]);
    songStore.updateCurrentPlaySong(3, val[0]);
    emit("playSong", currentPlaySong.value.song.id);
  }
);
</script>

<style scoped lang="scss">
.t-title {
  position: fixed;
  border-bottom: 1px solid #d0d8e6;
  margin: 0 10px;
  width: 430px;
  h3 {
    text-align: initial;
  }
  .c-wrapper {
    display: flex;
    justify-content: space-between;
    span {
      font-size: 15px;
      color: lightgray;
    }
    .control {
      display: flex;
      align-items: center;
      padding-left: 10px;
      cursor: pointer;
      .shoucang {
        padding-right: 10px;
      }
      .clear {
        color: var(--el-color-primary);
      }
    }
  }
}
.list-wrapper {
  padding-top: 85px;
  ul {
    overflow: hidden auto;
    height: 598px;
    margin-bottom: 0;
    padding: 0 20px;
    li {
      list-style: none;
      border-bottom: 1px solid #d0d8e6;
      cursor: pointer;
      .info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 0;
        .text {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          .singer {
            font-size: 12px;
            color: #999ea5;
          }
        }
        .list-btn {
          display: flex;
          & > div {
            padding-right: 10px;
          }
          .link {
            opacity: 0;
          }
        }
      }
      &.selected {
        .text {
          color: red;
          .singer {
            color: red;
          }
        }
        .link {
          opacity: 1 !important;
        }
      }
    }
  }
}
</style>

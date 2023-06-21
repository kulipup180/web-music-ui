<template>
  <!-- 用v-show让播放列表组件初始化，否则无法先播放搜索出来的音乐 -->
  <div class="wrapper" v-show="songUrl">
    <div class="info">
      <img :src="currentPlaySong.song.al_pic" alt="" />
      <div class="text">
        <span class="name">{{ currentPlaySong.song.name }}</span
        ><span class="artist"> - {{ currentPlaySong.song.s_singer }}</span>
      </div>
    </div>
    <div class="control">
      <div class="prev" @click="clickPrev">
        <i class="iconfont icon-shangyishou"></i>
      </div>
      <div class="play" @click="clickPlay">
        <i
          class="iconfont"
          :class="isPlay ? 'icon-24gf-pauseCircle' : 'icon-24gf-playCircle'"
        ></i>
      </div>
      <div class="next" @click="clickNext">
        <i class="iconfont icon-xiayishou"></i>
      </div>
    </div>
    <div class="progress">
      <span class="time" v-if="currentPlaySong.song.id"
        >{{ currentTime }}/{{ currentPlaySong.song.s_time }}</span
      >
      <div class="progress-bar" @click="clickProgress">
        <div class="pro-btn" :style="{ left: barWidth }"></div>
        <div class="progress__current" :style="{ width: barWidth }"></div>
      </div>
    </div>
    <div class="btn">
      <div class="shoucang"><i class="iconfont icon-jushoucang"></i></div>
      <div class="volume">
        <div class="v-control">
          <div class="bar" @click="clickVolumeBar">
            <div class="current-volume" :style="{ height: volumeHeight }"></div>
          </div>
        </div>
        <div class="v-icon" @click="clickVolume">
          <i v-if="isVolume" class="iconfont icon-yinliang"></i>
          <i v-else class="iconfont icon-24gl-volumeCross"></i>
        </div>
      </div>
      <div class="playSetting" @click="changePlaySetting">
        <i
          v-show="playSetting === 0"
          class="iconfont icon-24gl-shuffle"
          style="font-size: 25px"
        ></i>
        <i
          v-show="playSetting === 1"
          class="iconfont icon-icon-"
          style="font-size: 30px"
        ></i>
        <i
          v-show="playSetting === 2"
          class="iconfont icon-hanhan-01-01"
          style="font-size: 27px"
        ></i>
      </div>
      <div class="btn-tracklist" @click="showTrackList">
        <i
          class="iconfont icon-24gl-playlistMusic4"
          style="font-size: 22px"
        ></i>
      </div>
      <div
        class="trackList"
        :style="{ display: isShowTrack ? 'block' : 'none' }"
      >
        <tracklist></tracklist>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getSongUrlApi } from "@/api/info";
import { useEventsBus } from "@/utils/useEmitter";
import { Ref, ref, watch } from "vue";
import tracklist from "@/components/playlist/trackList.vue";
import { SongTableItem } from "@/utils/types";
import { useSongStore } from "@/stores";
import { storeToRefs } from "pinia";

const song: Ref<SongTableItem> = ref({
  name: "",
  s_singer: "",
  s_al: "",
  s_time: "",
  id: 0,
  al_pic: "",
});

const songIndex = ref(0);

enum PlaySetting {
  "suiji",
  "liebiao",
  "danqu",
}
const playSetting = ref(PlaySetting.suiji);
function changePlaySetting() {
  playSetting.value = (playSetting.value + 1) % 3;
}

function playBySetting() {
  if (playSetting.value === 0) {
    songIndex.value = Math.floor(
      Math.random() * songStore.currentSongList.length
    );
    songStore.updateCurrentPlaySong(
      2,
      songStore.currentSongList[songIndex.value]
    );
    emit("playSongChange", songStore.currentPlaySong.song.id);
    playSong(songStore.currentPlaySong.song.id);
  } else if (playSetting.value === 1) {
    clickNext();
  } else {
    audio.value.play();
  }
}

const audio: Ref<HTMLAudioElement> = ref(new Audio());
//音量控制
const isVolume = ref(true);
const currentVolume = ref(0);
const volumeHeight = ref("0");
function clickVolume() {
  isVolume.value = !isVolume.value;
  if (isVolume.value) {
    audio.value.volume = currentVolume.value;
    volumeHeight.value = currentVolume.value * 80 + "px";
  } else {
    //不修改之前的currentVolume
    currentVolume.value = audio.value.volume;
    audio.value.volume = 0;
    volumeHeight.value = "0";
  }
}
function clickVolumeBar(e: MouseEvent) {
  console.log(e.offsetY);
  let position = e.offsetY;
  let currentBar = e.target as HTMLElement;
  let volume = currentBar.offsetParent as HTMLElement;
  if (position > volume.offsetHeight) {
    position = 100;
  }
  if (position < 0) {
    position = 0;
  }
  if (position !== 0) {
    isVolume.value = true;
  }
  volumeHeight.value = position + "px";
  audio.value.volume = position / volume.offsetHeight;
  currentVolume.value = audio.value.volume;
}
//音乐进度条控制
const barWidth = ref("0");
const currentTime = ref("00:00");
function generateTime() {
  if (audio) {
    let width = (100 / audio.value.duration) * audio.value.currentTime;
    barWidth.value = width + "%";
    // circleLeft.value = width + "%";
    let curmin = Math.floor(audio.value.currentTime / 60);
    let cursec = Math.floor(audio.value.currentTime - curmin * 60);
    currentTime.value =
      String(curmin).padStart(2, "0") + ":" + String(cursec).padStart(2, "0");
  }
}
function resetAudio() {
  barWidth.value = "0";
  currentTime.value = "00:00";
  currentVolume.value = audio.value.volume;
  volumeHeight.value = currentVolume.value * 80 + "px";
  if (songUrl.value !== "") {
    audio.value.src = songUrl.value;
    audio.value.ontimeupdate = () => {
      generateTime();
    };
    audio.value.onloadedmetadata = () => {
      generateTime();
    };
    audio.value.onended = () => {
      playBySetting();
    };
  }
  setTimeout(clickPlay, 200);
}

let isPlay = ref(false);
function clickPlay() {
  if (isPlay.value) {
    //正在播放
    console.log("pause");
    audio.value.pause();
  } else {
    console.log("play");
    audio.value.play();
  }
  isPlay.value = !isPlay.value;
  console.log(isPlay.value);
}

const songStore = useSongStore();
const { currentPlaySong } = storeToRefs(songStore);
//按钮上下切换歌曲
function changeSong() {
  if (songIndex.value < 0) {
    console.log("没有上一首");
  } else if (songIndex.value > songStore.currentSongList.length) {
    console.log("没有下一首");
  } else {
    songStore.updateCurrentPlaySong(
      2,
      songStore.currentSongList[songIndex.value]
    );

    emit("playSongChange", songStore.currentPlaySong.song.id);
    playSong(songStore.currentPlaySong.song.id);
  }
}

function clickPrev() {
  songIndex.value--;
  changeSong();
}

function clickNext() {
  songIndex.value++;
  changeSong();
}

function clickProgress(e: MouseEvent) {
  //e.offsetX就是相对于进度条起始点的偏移
  audio.value.pause();
  let position = e.offsetX;
  let progress = e.target as HTMLElement;
  let percentage = (100 * position) / progress.offsetWidth;
  if (percentage > 100) {
    percentage = 100;
  }
  if (percentage < 0) {
    percentage = 0;
  }
  console.log(percentage);
  barWidth.value = percentage + "%";
  audio.value.currentTime = (percentage * audio.value.duration) / 100;
  audio.value.play();
}

const { emit, bus } = useEventsBus();
const songUrl = ref("");
function playSong(songId: number) {
  console.log("歌曲点击播放");
  songIndex.value = songStore.currentSongList.findIndex(
    (item) => item.id === songId
  );
  //切换，如果当前正在放歌就暂停
  // song.value = val[0];
  if (songId) {
    console.log("当前歌曲暂停");
    audio.value.pause();
    isPlay.value = false;
  }
  getSongUrl(songId);
}

watch(
  () => bus.value.get("playSong"),
  (val) => {
    //从歌单列表中删除歌曲
    if (!val) {
      console.log("当前播放歌曲被删除");
      //删除后列表中没有歌曲了
      if (songStore.currentSongList.length === 0) {
        console.log("播放列表为空");
        songUrl.value = "";
        audio.value.pause();
      }
    } else {
      //index设置为当前正在播放的歌曲列表里的

      playSong(currentPlaySong.value.song.id);
    }
  }
);

//显示当前播放歌单
const isShowTrack = ref(false);
function showTrackList() {
  isShowTrack.value = !isShowTrack.value;
}

async function getSongUrl(sid: number) {
  const res = await getSongUrlApi(sid);
  songUrl.value = res.data[0].url;
  // isPlay.value = true;
  resetAudio();
}
</script>

<style scoped lang="scss">
.wrapper {
  transition: all 2s;
  display: flex;
  align-items: center;
  position: fixed;
  background-color: #fff;
  width: 100%;
  bottom: 43px;
  height: 100px;
  max-width: 1280px;
  border-radius: 0 0 15px 15px;
  backdrop-filter: blur(15px);
  background-color: rgba(255, 255, 255, 0.75);
  z-index: 10;
  .info {
    display: flex;
    padding: 0 20px;
    align-items: center;
    img {
      width: 70px;
      height: 70px;
    }
    .text {
      top: 20px;
      position: absolute;
      left: 310px;
      .name {
        font: {
          size: 16px;
        }
      }
      .artist {
        font: {
          size: 14px;
        }
        color: lightslategrey;
      }
    }
  }
  .control {
    display: flex;
    align-items: center;
    div {
      padding-left: 20px;
    }
    .iconfont {
      color: red;
      font-size: 25px;
    }
    .play {
      .iconfont {
        font-size: 40px;
      }
    }
  }
  .progress {
    padding-left: 50px;
    position: relative;
    .time {
      position: absolute;
      right: -100px;
      top: -10px;
      color: #71829e;
      font-weight: 500;
    }
    .progress-bar {
      position: relative;
      width: 600px;
      background-color: #d0d8e6;
      height: 6px;
      border-radius: 10px;
      cursor: pointer;
      &:hover {
        .pro-btn {
          opacity: 1;
        }
      }
      .pro-btn {
        opacity: 0;
        position: absolute;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: darkred;
        transform: translate(-50%, -20%);
      }
      .progress__current {
        background-color: darkred;
        height: inherit;
        border-radius: 10px;
      }
    }
  }
  .btn {
    display: flex;
    padding-left: 200px;
    align-items: center;
    & > div {
      padding-right: 15px;
    }
    .iconfont {
      font-size: 32px;
      color: #71829e;
    }
    .volume,
    .shoucang {
      .iconfont {
        font-size: 26px;
      }
    }
    .volume {
      position: relative;
      cursor: pointer;
      &:hover {
        .v-control {
          opacity: 1;
        }
      }
      .v-control {
        opacity: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        bottom: 45px;
        left: -5px;
        width: 30px;
        height: 100px;
        border-radius: 5px;
        background-color: #fff;
        box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.3);
        z-index: 10;
        &::after {
          content: "";
          width: 10px;
          height: 10px;
          background-color: #fff;
          position: absolute;
          bottom: -4.5px;
          left: 9px;
          transform-origin: center;
          transform: rotate(45deg);
          box-shadow: 3.5px 3.5px 5px 0px rgba(0, 0, 0, 0.1);
        }
        .bar {
          width: 6px;
          height: 80px;
          border-radius: 5px;
          background-color: #d0d8e6;
          transform: rotate(180deg);
          .current-volume {
            height: inherit;
            background-color: red;
            width: 6px;
          }
        }
      }
    }
    .trackList {
      position: absolute;
      height: 698px;
      width: 450px;
      box-shadow: -2px 0 4px -2px rgba(0, 0, 0, 0.3);
      bottom: 100px;
      right: 0;
      background-color: #fff;
    }
  }
}
</style>

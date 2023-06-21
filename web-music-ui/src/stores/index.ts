import { SongTableItem, songOrigin } from "@/utils/types";
import { defineStore } from "pinia";

export const useSongStore = defineStore("config", {
  state: () => ({
    // baseURL: "https://netease-cloud-music-api-eta-lovat.vercel.app/",
    songId: 0,
    songList: [] as SongTableItem[], //歌单内歌曲
    currentSongList: [] as SongTableItem[], //当前播放列表歌曲
    searchSongList: [] as SongTableItem[], //搜索列表歌曲
    currentPlaySong: {
      origin: songOrigin.NoSong,
      song: {} as SongTableItem,
    },
  }),

  actions: {
    incement() {
      this.songId++;
    },
    updateCurrentPlaySong(origin: number, song?: SongTableItem) {
      if (origin === 0) {
        this.currentPlaySong.origin = songOrigin.NoSong;
        this.currentPlaySong.song = {} as SongTableItem;
      } else if (origin === 1) {
        this.currentPlaySong.origin = songOrigin.SongList;
        this.currentPlaySong.song = song as SongTableItem;
      } else if (origin === 2) {
        this.currentPlaySong.origin = songOrigin.currentSongList;
        this.currentPlaySong.song = song as SongTableItem;
      } else if (origin === 3) {
        this.currentPlaySong.origin = songOrigin.SearchSongList;
        this.currentPlaySong.song = song as SongTableItem;
      }
    },
  },
});

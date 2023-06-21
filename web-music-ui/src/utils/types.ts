//歌曲

export interface SongOriginItem {
  name: string;
  ar: { name: string; id: number }[];
  al: { name: string; id: number; picUrl: string };
  id: number;
  dt: number;
}

export interface SongTableItem {
  name: string;
  s_singer: string;
  s_al: string;
  s_time: string;
  id: number;
  al_pic: string;
}

export interface TrackItem {
  tid: number;
  tracks: SongTableItem[];
}

export interface playlistItem {
  name: string;
  coverImgUrl: string;
  createTime: number;
  trackCount: number;
  subscribedCount: number;
  description: string;
  tags: string[];
  tracks: SongOriginItem[];
  playCount: number;
}

//歌曲来源
export enum songOrigin {
  NoSong,
  SongList,
  currentSongList,
  SearchSongList,
}

export interface Album {
  id: number;
  name: string;
  picUrl: string;
  publishTime: number;
  artists: Array<{ name: string; id: number }>;
}

export interface Artist {
  id: number;
  name: string;
  img1v1Url: string;
}

export interface PlayList {
  coverImgUrl: string;
  creator: {
    nickname: string;
    userId: number;
  };
  name: string;
  id: number;
}

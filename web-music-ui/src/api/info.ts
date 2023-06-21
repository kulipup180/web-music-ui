import request from "@/utils/request";

export function getBannerApi() {
  return request({
    url: "/banner",
    method: "get",
  });
}

export function getPlaylistApi(limitNumber: number) {
  return request({
    url: "/personalized",
    method: "get",
    params: {
      limit: limitNumber,
    },
  });
}

export function getPlaylistDetailApi(pid: number) {
  return request({
    url: "/playlist/detail",
    params: {
      id: pid,
    },
  });
}

export function getSongUrlApi(sid: number, level: string = "standard") {
  return request({
    url: "/song/url/v1",
    params: {
      id: sid,
      level: level,
    },
  });
}

export function getAllSongApi(pid: number, limit: number = 20) {
  return request({
    url: "/playlist/track/all",
    params: {
      id: pid,
      limit: limit,
      offset: 1,
    },
  });
}

export function getSearchDataApi(
  keyword: string,
  type: number = 1,
  limit: number = 30,
  offset: number = 0
) {
  return request({
    url: "/cloudsearch",
    params: {
      keywords: keyword,
      type: type,
      limit: limit,
      offset: offset,
    },
  });
}

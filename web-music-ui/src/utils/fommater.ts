import { SongOriginItem, SongTableItem } from "./types";

export function formatDate(time: any): string {
  let date = new Date(time);

  let YY = date.getFullYear();
  let MM =
    date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1;
  let DD = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  let hh = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  let mm = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  let ss = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

  // 这里修改返回时间的格式
  return YY + "-" + MM + "-" + DD;
}
export function formatCount(count: number): string {
  if (count > 9999) {
    return (count / 10000).toFixed(1) + "万";
  } else {
    return count.toString();
  }
}

export function formatDuration(duration: number): string {
  const minutes = Math.floor(duration / 1000 / 60);
  const seconds = Math.floor((duration / 1000) % 60);
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");
  return `${formattedMinutes}:${formattedSeconds}`;
}

export function formatSongData(res: any, songTableData: SongTableItem[]) {
  res.forEach((item: SongOriginItem, index: number) => {
    const temp = {
      name: item.name,
      s_al: item.al.name,
      s_time: formatDuration(item.dt),
      s_singer: "",
      id: item.id,
      al_pic: item.al.picUrl,
    };
    //把每首歌曲的歌手名拼接成一个字符串
    if (item.ar.length > 1) {
      temp.s_singer = item.ar.map((item) => item.name).join("/");
    } else {
      temp.s_singer = item.ar[0].name;
    }
    songTableData.push(temp);
  });
}

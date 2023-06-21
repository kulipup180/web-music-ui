# 模板技术栈

Vite Vue3 vue-router4 pinia2 typescript template

ui:element-plus@2.3.3
图标：@element-plus/icons-vue@2.1.0

# 项目描述

仿网易云音乐 HD 版网页音乐播放器

## 项目难点

音乐播放组件

组件通信：

- 亲子组件异步传值
- 非亲子组件传值

定义的事件：

1. "playSongChange"

参数：

- 歌曲 id

触发组件：

- 音乐播放组件的歌曲切换功能

监听组件：

- tracks 歌单列表组件。当切换的歌曲在歌单列表中进行高亮行更新

2. "playSong"
   参数：歌曲 id

触发组件：

- 歌单组件点击歌曲播放

监听组件：

playSong 音乐播放组件监听事件，歌单处有点击则调用 playSong 音乐播放方法。在音乐播放组件内切换歌曲

## 项目功能

- 歌单详情
  - [x] 展示歌曲列表
  - [ ] 收藏/下载歌曲
- 音乐播放组件
  - [x] 点击歌曲后播放音乐
  - [x] 进度条
  - [x] 播放/暂停
  - [x] 点击进度条控制音乐播放
  - [x] 调节音量
  - [x] 随机/顺序/循环播放
  - 当前播放音乐列表
    - [x] 查看当前播放列表
    - [x] 从当前歌单列表控制音乐播放
    - [x] 上一首/下一首
    - [x] 清空歌单
    - [ ] 删除当前播放列表中的歌曲
- 搜索
  - [x] 搜索框输入关键词搜索
  - [x] 不同搜索结果展示
    - [x] 单曲
    - [x] 歌单跳转各单详情
    - [ ] 专辑跳转专辑详情
    - [ ] 艺人页
  - [x] 播放搜索歌曲
    - 自动加入当前播放列表
- [ ] 登录
- [ ] 收藏

# 各组件功能实现逻辑

store 有歌单列表，播放音乐列表，搜索歌曲列表，当前播放音乐：{来源，歌曲信息}；

## 歌单列表

不同歌曲行变化：点击触发的高亮行改变，且触发 playsong 方法；监听 playsongchange 获得的歌曲变化事件,查看歌曲是否在展示的歌单中，有则更新高亮行，但不触发 playsong 方法。

## 音乐播放组件

监听 playsong 方法，变化则播放音乐，触发 playSong 方法。

组件内的播放音乐列表子组件：

当前播放音乐的高亮行从 store 里的当前播放音乐获取；

# 问题

~~现在是将当前歌单列表放在 eventbus 里的，可以实现功能，但有一点问题，感觉放在 store 里更好~~

将获取的歌单歌曲数据，当前播放列表数据，搜索结果放进 store 里，方便其他组件获取和修改数据。

## 已解决

### 触发音乐播放组件

非父子组件通信：参考：https://stackoverflow.com/questions/63471824/vue-js-3-event-bus

音乐音乐播放组件固定在 app.vue 中，而触发音乐播放组件的音乐列表可能在任何地方，存在非父子组件的通信。我们定义一个全局事件库。简单来说就是用一个 Map 存放触发的事件名和要传递的参数：

```typescript
import { ref } from "vue";
const bus = ref(new Map());

export function useEventsBus() {
  function emit(event: string, ...args: any[]) {
    bus.value.set(event, args);
  }

  return {
    emit,
    bus,
  };
}
```

在组件 A 中注册及触发事件：

```typescript
emit("playSong", currentRow.value);
```

在组件 B 中接收事件：

```typescript
const { bus } = useEventsBus();
watch(
  () => bus.value.get("playSong"),
  (val) => {
    song.value = val[0];
    getSongUrl(song.value.id);
  }
);
```

### 歌曲列表显示的数据获取

目前通过 props 实现，但感觉用 store 会更好

### 嵌套子路由

**在 tracks.vue 组件内根据`route.params.id`获取歌单歌曲.** 这是之前的解决方法

也可以通过子组件处理亲组件异步传值的

### 音乐对象方法

使用`new Audio()`创建音频实例对象

- play(): 播放音频。
- pause(): 暂停音频播放。
- load(): 重新加载音频。
- canPlayType(type): 检查浏览器是否支持指定的音频类型，type 参数是音频类型的 MIME 类型，例如 "audio/mp3"。
- addEventListener(event, listener): 添加事件监听器来处理音频播放过程中的不同事件，常见的事件有 "play"、"pause"、"ended" 等。
- removeEventListener(event, listener): 移除先前添加的事件监听器。
- currentTime: 获取或设置当前音频播放的时间位置（以秒为单位）。
- duration: 获取音频的总时长（以秒为单位）。
- volume: 获取或设置音频的音量，范围是 0.0（静音）到 1.0（最大音量）。

## 未解决

### 路由参数更新不及时

搜索 input 组件和搜索页在不同的组件，使用 query 路由传参无法立即获取最新触发的路由查询

打算使用事件总线触发一个 search 事件，带上 keyword 的参数，但是发现使用**事件总线**进行组件间通信，第一次发起的事件不能监听到。

不管是路由查询传参还是使用事件总线，第一次的查询总是无法获取，最终使用在 onMounted 里进行一次 init 函数。

问题根本是 vue 生命周期，之后还是要好好研究下。

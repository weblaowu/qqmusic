<template>
  <!-- playList.length 控制player组件显示 -->
  <div class="player" v-if="playList.length > 0">
    <!-- fullScreen : true 显示 normal -->
    <transition name="normal">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.albummid" />
        </div>
        <!-- 返回按钮和歌曲信息 -->
        <div class="top">
          <div class="back" @click="backMini">
            <i class="icon-back"></i>
          </div>
          <h1 class="title">{{ currentSong.songname }}</h1>
          <h2 class="subtitle">{{ currentSong.singer }}</h2>
        </div>
        <!-- 中间播放的CD -->
        <div
          class="middle"
          @touchstart.prevent="lyricStart"
          @touchmove.prevent="lyricMove"
          @touchend="lyricEnd"
        >
          <!-- CD展示 -->
          <div class="middle-l" ref="middleL" v-show="true">
            <div class="cd-wrapper">
              <div class="cd" :class="rotateCD">
                <img class="image" :src="currentSong.albummid" />
              </div>
            </div>
            <!-- 显示当前播放行歌词 -->
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{ playingLyric }}</div>
            </div>
          </div>
          <!-- 歌词展示 -->
          <scroll class="middle-r" ref="lyricList">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <!-- 逐行显示歌词 -->
                <p
                  v-for="(item, index) in currentLyric.lines"
                  class="text"
                  :key="index"
                  :class="{'current':currentLine === index}"
                  ref="lyricLine"
                >{{ item.txt }}</p>
              </div>
              <div v-else>该歌曲没有歌词</div>
            </div>
          </scroll>
        </div>
        <!-- 底部的按钮 -->
        <div class="bottom">
          <!-- CD 歌词视图的切换 -->
          <div class="dot-wrapper">
            <span class="dot" :class="{'active': currentShow=== 'CD'}"></span>
            <span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
          </div>
          <!-- 进度条 -->
          <div class="progress-wrapper">
            <span class="time time-l">{{ formatTime(currentTime) }}</span>
            <div class="progress-bar-wrapper">
              <!-- 进度条 -->
              <progress-bar :percent="percent" @percentChange="changePerc"></progress-bar>
            </div>
            <span class="time time-r">{{formatTime(currentSong.interval)}}</span>
          </div>
          <!-- 操作按钮 -->
          <div class="operators">
            <!-- 播放模式 -->
            <div class="icon i-left" @click="changeMode">
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left">
              <i class="icon-prev" @click="prevSong"></i>
            </div>
            <div class="icon i-center">
              <i :class="normalIcon" @click="togglePlay"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-next" @click="nextSong"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!-- fullScreen : false 显示 mini -->
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="openNormal">
        <div class="icon">
          <img width="40" height="40" :src="currentSong.albummid" :class="rotateCD" />
        </div>
        <div class="text">
          <h2 class="name">{{ currentSong.songname }}</h2>
          <p class="desc">{{ currentSong.singer }}</p>
        </div>
        <!-- 播放暂定按钮 -->
        <div class="control">
          <i :class="miniIcon" @click.stop="togglePlay"></i>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <!-- 播放源 -->
    <audio
      :src="currentSong.url"
      ref="audio"
      @canplay="readyPlay"
      @error="playErr"
      @timeupdate="timeUpdate"
      @ended="playEnd"
    ></audio>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import progressBar from "./progress-bar";
import { playMode } from "@common/js/paramConf";
import LyricParser from "lyric-parser";
import scroll from "@base/m-scroll/m-scroll";
export default {
  data() {
    return {
      songReady: false,
      currentTime: 0,
      currentLyric: null,
      currentLine: null,
      currentShow: "CD",
      playingLyric: ""
    };
  },
  computed: {
    ...mapGetters('player',[
      "playList",
      "fullScreen",
      "currentSong",
      "playing",
      "currentIndex",
      "playMode",
      "orderList"
    ]),
    // 根据播放状态 playing 设置播放图标样式 mini
    miniIcon() {
      return this.playing ? "icon-pause-mini" : "icon-play-mini";
    },
    // normal
    normalIcon() {
      return this.playing ? "icon-pause" : "icon-play";
    },
    // 设置播放模式样式
    iconMode() {
      return this.playMode === playMode.order
        ? "icon-sequence"
        : this.playMode === playMode.loop
        ? "icon-loop"
        : "icon-random";
    },
    rotateCD() {
      return this.playing ? "play" : "play pause";
    },
    // 计算播放进度 百分比 = currentTime / interval
    percent() {
      return this.currentTime / this.currentSong.interval;
    }
  },
  methods: {
    ...mapMutations('player',[
      "setFullScreen",
      "setPlaying",
      "setCurrentIndex",
      "setPlayMode",
      "setPlayList"
    ]),
    // 切换 mini 和 normal
    openNormal() {
      // 提交 mutations type 【setFullScreen】 改变状态
      this.setFullScreen(true);
    },
    backMini() {
      this.setFullScreen(false);
    },
    // 切换播放暂停
    togglePlay() {
      if (!this.songReady) {
        return;
      }
      // 提交 setPlaying , 修改播放 playing 状态
      this.setPlaying(!this.playing);

      // 歌词同步切换暂定播放
      if (this.currentLyric) {
        this.currentLyric.togglePlay();
      }
    },
    // 切换歌曲
    prevSong() {
      // 上一首

      if (!this.songReady) {
        return;
      }
      let index = this.currentIndex - 1;
      if (index === -1) {
        index = this.playList.length - 1;
      }
      this.setCurrentIndex(index);
      if (!this.playing) {
        this.togglePlay();
      }
      this.songReady = false;
    },
    nextSong() {
      // 下一首

      // 判断当前歌曲是否准备好
      if (!this.songReady) {
        return;
      }
      let index = this.currentIndex + 1;
      // 当index大于歌曲列表length时，回到第一首歌曲
      if (index === this.playList.length) {
        index = 0;
      }
      // 修改currentIndex, 提交setCurrentIndex
      this.setCurrentIndex(index);
      // 判断当前播放状态
      if (!this.playing) {
        this.togglePlay();
      }
      // 重置 songReady
      this.songReady = false;
    },
    readyPlay() {
      this.songReady = true;
    },
    playErr() {
      this.songReady = false;
    },
    // 播放时间改变事件
    timeUpdate(e) {
      // 获取当前歌曲播放时间
      this.currentTime = e.target.currentTime;
    },
    // 处理 currentTime => 00 : 00  90
    formatTime(time) {
      time = Math.floor(time);
      let m = Math.floor(time / 60);
      let s = time % 60;
      if (m.toString().length < 2) {
        m = "0" + m;
      }
      if (s.toString().length < 2) {
        s = "0" + s;
      }
      return `${m}:${s}`;
    },
    // 重新设置 当前播放时间 audio.currentTime
    changePerc(newPerc) {
      // 设置 歌曲的播放
      let currentTime = this.currentSong.interval * newPerc;
      this.$refs.audio.currentTime = currentTime;
      // 设置 歌词的播放
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000);
      }
    },
    // 歌曲播放结束
    playEnd() {
      // 当播放模式是 循环 时
      if (this.playMode === playMode.loop) {
        // 把当前歌曲的currentTime重置为 0
        this.$refs.audio.currentTime = 0;
        // 调用播放方法
        this.$refs.audio.play();
      } else {
        // 调用下一首方法
        this.nextSong();
      }
    },
    // 切换播放模式 playMode
    changeMode() {
      // 取值  0 1 2 之间
      let mode = (this.playMode + 1) % 3;
      // console.log(mode)
      this.setPlayMode(mode);
      let list = null;
      // 实现随机播放,执行数组乱序逻辑，达到随机效果
      if (this.playMode === playMode.random) {
        list = this.randomList(this.orderList);
      } else {
        list = this.orderList;
      }
      // 重置 currentIndex
      this.resetcIndex(list);
      // 提交 mutations setPlayList 改变播放列表
      this.setPlayList(list);
    },
    // 乱序数组的方法
    randomList(arr) {
      let _arr = arr.slice();
      for (let i = 0; i < _arr.length; i++) {
        // 在 0 ~ i 之间生成随机整数
        let r = Math.floor(Math.random() * (i + 1));
        // 交换 _arr[i] | _arr[r]
        let val = _arr[i];
        _arr[i] = _arr[r];
        _arr[r] = val;
      }
      return _arr;
    },
    // 重置 currentIndex
    resetcIndex(list) {
      let cindex = list.findIndex(item => {
        // item => song
        return item.songid === this.currentSong.songid;
      });
      // 提交 mutation , 重置 currentIndex
      console.log(cindex);
      this.setCurrentIndex(cindex);
    },
    // 获取 并 设置 歌词
    getLyric() {
      // 获取歌词 调用接口
      this.currentSong
        ._getLyric()
        .then(lyric => {
          this.currentLyric = new LyricParser(lyric, this.handleLyric);
          // 歌曲播放时 ，播放歌词
          if (this.playing) {
            this.currentLyric.play();
          }
        })
        .catch(err => {
          console.log(err);
          this.currentLyric = null;
          this.playingLyric = null;
          this.currentLine = 0;
        });
    },
    handleLyric({ lineNum, txt }) {
      this.currentLine = lineNum;
      // 获取 elem
      if (lineNum > 5) {
        let elem = this.$refs.lyricLine[lineNum - 5];
        // 调用 scroll组件 滚动到指定元素的方法
        this.$refs.lyricList.scrollToElement(elem, 1000);
      } else {
        // 滚动到歌词开头播放的位置
        this.$refs.lyricList.scrollTo(0, 0, 200);
      }
      this.playingLyric = txt;
    },
    // 切换 歌词 视图 touch事件回调
    lyricStart(e) {
      // 表示touchstart开始
      this.touch.isStart = true;
      // 判断是否是第一次移动
      this.touch.isMove = false;
      const t = e.touches[0];
      // 记录 start的 X ，Y 坐标
      this.touch.startX = t.pageX;
      this.touch.startY = t.pageY;
    },
    lyricMove(e) {
      if (!this.touch.isStart) {
        return;
      }

      let t = e.touches[0];
      // 记录滑动距离  end - start  = distanceX | distanceY
      let distanceX = t.pageX - this.touch.startX;
      let distanceY = t.pageY - this.touch.startY;
      // 判断当前滚动 是否是横轴方向的
      // distanceY > distanceX 说明是纵轴的操作，不做任何滑动
      if (Math.abs(distanceY) > Math.abs(distanceX)) {
        return;
      }

      if (!this.touch.isMove) {
        this.touch.isMove = true;
      }
      // 滚动的偏移值只有两个 要么是0,  要么是 -window.innnerWidth
      let left = this.currentShow === "CD" ? 0 : -window.innerWidth;

      let offsetWidth = Math.min(
        0,
        Math.max(-window.innerWidth, left + distanceX)
      );
      // 滑动逻辑，设置 歌词视图 的transform: translateX
      this.$refs.lyricList.$el.style.transform = `translateX(${offsetWidth}px)`;

      // 计算滑动比例 percent
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth);
      // 设置 CD 的透明度
      this.$refs.middleL.style.opacity = 1 - this.touch.percent;
    },
    lyricEnd(e) {
      // 滑动有两种情况，向左滑，向右滑
      // 左滑，歌词划入，CD隐藏
      if (!this.touch.isMove) {
        return;
      }
      let offsetWidth;
      let opacity;
      if (this.currentShow === "CD") {
        // 判断滑动距离，大于20%，滑动成功
        if (this.touch.percent > 0.2) {
          offsetWidth = -window.innerWidth;
          opacity = 0;
          this.currentShow = "lyric";
        } else {
          // 滑动无效
          offsetWidth = 0;
          opacity = 1;
        }
      } else {
        if (this.touch.percent < 0.9) {
          offsetWidth = 0;
          opacity = 1;
          this.currentShow = "CD";
        } else {
          offsetWidth = -window.innerWidth;
          opacity = 0;
        }
      }
      // 设置 位移 最终的值
      this.$refs.lyricList.$el.style.transform = `translateX(${offsetWidth}px)`;
      // 过渡属性
      this.$refs.lyricList.$el.style.transition = "all 0.3s ease-out";
      this.$refs.middleL.style.opacity = opacity;

      this.touch.isStart = false;
    }
  },
  watch: {
    // 监听 currentSong 改变
    currentSong(newSong, oldSong) {
      // 测试 getLyric
      if (newSong.songid === oldSong.songid) {
        return;
      }
      // 判断当前有没有歌词
      if (this.currentLyric) {
        this.currentLyric.stop();
        this.currentTime = 0;
        this.currentLine = 0;
      }
      this.$nextTick(() => {
        const audio = this.$refs.audio;
        // 延迟一下，确保audio标签src有值，才能调用 play()
        setTimeout(() => {
          audio.play(); // 歌曲播放
          this.getLyric(); // 歌词播放
        }, 200);
      });
    },
    // 监听 playing 状态
    playing(newVal) {
      // 根据当前的playing状态 设置播放 或 暂停
      this.$nextTick(() => {
        // DOM更新之后再执行
        const audio = this.$refs.audio;
        newVal ? audio.play() : audio.pause();
      });
    }
    // 监听  playMode 改变
  },
  created() {
    // 保存 touch 数据
    this.touch = {};
  },
  components: {
    progressBar,
    scroll
  }
};
</script>

<style scoped lang="stylus" >
@import '../../common/stylus/variable';
@import '../../common/stylus/mixin';

.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;

    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.9;
      filter: blur(40px);
    }

    .top {
      position: relative;
      margin-bottom: 25px;

      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;

        .icon-back {
          display: block;
          padding: 9px;
          font-size: $font-size-large-x;
          color: $color-theme;
          transform: rotate(-90deg);
        }
      }

      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        no-wrap();
        font-size: $font-size-large;
        color: #f2f2f2;
      }

      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: #f2f2f2;
      }
    }

    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;

      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;

        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          height: 100%;

          .cd {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            border: 10px solid rgba(255, 255, 255, 0.1);
            border-radius: 50%;

            &.play {
              animation: rotate 20s linear infinite;
            }

            &.pause {
              animation-play-state: paused;
            }

            .image {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
        }

        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;

          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: #f9f9f9;
          }
        }
      }

      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;

        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;

          .text {
            line-height: 32px;
            color: rgba(250,250,250,.7);
            font-size: $font-size-medium-x;

            &.current {
              color: #fff;
            }
          }
        }
      }
    }

    .bottom {
      position: absolute;
      bottom: 20px;
      width: 100%;

      .dot-wrapper {
        text-align: center;
        font-size: 0;

        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;

          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }

      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 86%;
        margin: 0px auto;
        padding: 10px 0;

        .time {
          color: #f2f2f2;
          font-size: $font-size-small;
          flex: 0 0 30px;
          line-height: 30px;
          width: 30px;

          &.time-l {
            text-align: left;
          }

          &.time-r {
            text-align: right;
          }
        }

        .progress-bar-wrapper {
          flex: 1;
          margin: 0 10px;
        }
      }

      .operators {
        display: flex;
        align-items: center;

        .icon {
          flex: 1;
          color: $color-theme;

          &.disable {
            color: $color-theme-d;
          }

          i {
            font-size: 30px;
          }
        }

        .i-left {
          text-align: right;
        }

        .i-center {
          padding: 0 20px;
          text-align: center;

          i {
            font-size: 40px;
          }
        }

        .i-right {
          text-align: left;
        }

        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }

    &.normal-enter-active, &.normal-leave-active {
      transition: all 0.4s;

      .top, .bottom {
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
      }
    }

    &.normal-enter, &.normal-leave-to {
      opacity: 0;

      .top {
        transform: translate3d(0, -100px, 0);
      }

      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }

  .mini-player {
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 180;
    width: 100%;
    height: 60px;
    background: #fff;
    box-shadow: 0 -5px 10px rgba(0,0,0,.1);
    &.mini-enter-active, &.mini-leave-active {
      transition: all 0.4s;
    }

    &.mini-enter, &.mini-leave-to {
      opacity: 0;
    }

    .icon {
      flex: 0 0 40px;
      width: 40px;
      padding: 0 10px 0 20px;

      img {
        border-radius: 50%;

        &.play {
          animation: rotate 10s linear infinite;
        }

        &.pause {
          animation-play-state: paused;
        }
      }
    }

    .text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      line-height: 20px;
      overflow: hidden;

      .name {
        margin-bottom: 2px;
        no-wrap();
        font-size: $font-size-medium;
        color: $color-text;
      }

      .desc {
        no-wrap();
        font-size: $font-size-small;
        color: $color-text-d;
      }
    }

    .control {
      flex: 0 0 30px;
      width: 30px;
      padding: 0 10px;

      .icon-play-mini, .icon-pause-mini, .icon-playlist {
        font-size: 30px;
        color: #31c27c;
      }

      .icon-mini {
        font-size: 32px;
        position: absolute;
        left: 0;
        top: 0;
      }
    }
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
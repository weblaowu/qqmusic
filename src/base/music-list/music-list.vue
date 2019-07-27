<template>
  <div class="music-list">
    <!-- 回退按钮 -->
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <!-- title bgImage -->
    <h1 class="title">{{ title }}</h1>
    <div class="bg-image" :style="getHeadImg" ref="bgImage">
      <div class="filter"></div>
    </div>
    <!-- 向上滑动底层 -->
    <div class="bg-layer" ref='bglayer'></div>
    <!-- song-list -->
    <scroll
      class="list"
      ref="list"
      @scroll="scrollChange"
      :probeType="probeType"
      :listenScroll="listenScroll"
    >
      <div class="song-list-wrapper">
        <song-list :songs="songs" @select="selectSong"></song-list>
      </div>
      <!-- loading -->
      <div class="loading-container" v-show="!songs.length">
        <loading />
      </div>
    </scroll>
  </div>
</template>

<script>
import songList from '@base/song-list/song-list'
import scroll from '@base/m-scroll/m-scroll'
import { mapActions } from 'vuex'
import { playlistMixin } from '@common/js/mixin'
import loading from '@base/loading/loading'
export default {
  mixins: [playlistMixin],
  methods: {
    ...mapActions('player',['selectPlay']),
    back() {
      this.$router.back()
    },
    // 接收当前点击的歌曲信息
    selectSong(song, index) {
      this.selectPlay({
        list: this.songs, // 当前歌手歌曲列表
        index // 当前点击的currentIndex
      })
    },
    // 滚动触发
    scrollChange(prop){
      let zIndex = 0; 
      let scale = 1; 
      let bgHeight = this.$refs.bgImage.style.height;
      let paddingTop = this.$refs.bgImage.style.paddingTop;
      // 列表向上滚动的最大距离是 bgImage 的高度 + 40(距离顶部的距离)
      let offsetTop = Math.max(-this.bgTop + 40, prop.y);
      // 设置 bglayer 的 y 轴向上滚动距离(负值)
      this.$refs.bglayer.style['transform']= `translate3d(0,${offsetTop}px,0)`;
      this.$refs.bglayer.style['webkitTransform']= `translate3d(0,${offsetTop}px,0)`;
  
      // 如果滚动距离 超过 最大滚动距离
      if(prop.y <  offsetTop){
        zIndex = 10;  // 设置 bgImage 的图层顺序在前面盖住文字
        paddingTop = 0; // bgImage 的 padding设置 0
        bgHeight = `40px`; // 设置 bgImage 的高度为 40px 
      }else{
        // 不超过最大距离，bgImage值设置回去
        zIndex = 0; 
        paddingTop = '70%';
        bgHeight = 0;
      }
      // 下拉是设置bgImage缩放效果
      const percent = Math.abs(prop.y / this.bgTop);
      if(prop.y > 0){
        scale = 1 + percent;
        zIndex = 10;
      }
      // 设置列表向上滚动
      this.$refs.bgImage.style.zIndex = zIndex;
      this.$refs.bgImage.style.height = bgHeight;
      this.$refs.bgImage.style.paddingTop = paddingTop;
      // 设置 缩放
      this.$refs.bgImage.style['transform']= `scale(${scale})`;
      this.$refs.bgImage.style['webkitTransform']= `scale(${scale})`;
      
    },
    handlePlaylist(playList){
      const bottom = playList.length > 0 ? '60px' : '';
      this.$refs.list.$el.style.bottom = bottom;
      this.$refs.list.refresh()
    }
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    bgImage: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default() {
        return []
      }
    }
  },
  computed: {
    getHeadImg() {
      return `background-image:url(${this.bgImage})`
    }
  },
  components: {
    songList,
    scroll,
    loading
  },
  mounted() {
    // 设置 list 的 top 值 等于 bgImage 的高度
    this.bgTop = this.$refs.bgImage.clientHeight;
    this.$refs.list.$el.style.top = this.bgTop + 'px';
  },
  created() {
    // 初始化BScroll props值
    this.probeType = 3
    this.listenScroll = true
  }
}
</script>

<style scoped lang="stylus">
@import '~@common/stylus/variable'
@import '~@common/stylus/mixin'
.music-list
  position fixed
  z-index 100
  top 0
  left 0
  bottom 0
  right 0
  background $color-background
  .back
    position absolute
    top 0
    left 6px
    z-index 50
    .icon-back
      display block
      padding 10px
      font-size $font-size-large-x
      color $color-theme
  .title
    position absolute
    top 0
    left 10%
    z-index 40
    width 80%
    no-wrap()
    text-align center
    line-height 40px
    font-size $font-size-large
    color #fff
  .bg-image
    position relative
    width 100%
    height 0
    padding-top 70%
    transform-origin top
    background-size cover
    .play-wrapper
      position absolute
      bottom 20px
      z-index 50
      width 100%
      .play
        box-sizing border-box
        width 135px
        padding 7px 0
        margin 0 auto
        text-align center
        border 1px solid $color-theme
        color $color-theme
        border-radius 100px
        font-size 0
        .icon-play
          display inline-block
          vertical-align middle
          margin-right 6px
          font-size $font-size-medium-x
        .text
          display inline-block
          vertical-align middle
          font-size $font-size-small
  .bg-layer
    position relative
    height 100%
    background #fff
  .list
    position fixed
    top 0
    bottom 0
    width 100%
    background #fff
    .song-list-wrapper
      padding 20px 30px
    .loading-container
      display flex
      align-items center
      justify-content center
      transform translateY(100%)
</style>
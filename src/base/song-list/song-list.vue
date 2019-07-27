<template>
  <div class="song-list">
    <ul>
      <li
        class="item"
        v-for="(song, index) in songs"
        @click="selectSong(song, index)"
        :key="index"
        :class="[isclick && currentIndex===index?'bgColor':'']"
      >
        <div class="content">
          <div class="index">{{ index+1 }}</div>
          <div>
            <h2 class="name">{{ song.songname }}</h2>
            <p class="desc">{{ getDesc(song) }}</p>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  data(){
    return {
      isclick: false
    }
  },
  props: {
    songs: {
      type: Array,
      default() {
        return []
      }
    }
  },
  computed: {
    ...mapGetters('player',['currentIndex'])
  },
  methods: {
    getDesc(s) {
      return `${s.singer} ~ ${s.albumname}`
    },
    // 点击每一首歌曲
    selectSong(song, index) {
      // 把 song ,index 派发出去
      this.$emit('select', song, index)
      // 判断是不是当前点击对象
      if(this.currentIndex === index){
        this.isclick = true;
      }
      setTimeout(()=>{
        this.isclick = false;
      },200)
    }
  }
}
</script>

<style scoped lang="stylus">
@import '~@common/stylus/variable'
@import '~@common/stylus/mixin'
.song-list
  .item
    display flex
    align-items center
    box-sizing border-box
    height 64px
    font-size $font-size-medium
    // .rank {
    // flex: 0 0 25px;
    // width: 25px;
    // margin-right: 30px;
    // text-align: center;

    // .icon {
    // display: inline-block;
    // width: 25px;
    // height: 24px;
    // background-size: 25px 24px;

    // &.icon0 {
    // bg-image('first');
    // }

    // &.icon1 {
    // bg-image('second');
    // }

    // &.icon2 {
    // bg-image('third');
    // }
    // }

    // .text {
    // color: $color-theme;
    // font-size: $font-size-large;
    // }
    // }
    .content
      flex 1
      line-height 20px
      overflow hidden
      display flex
      align-items center
      .index
        margin-right 15px
      .name
        no-wrap()
        color #222
        font-size 16px
      .desc
        no-wrap()
        margin-top 4px
        color #888
  .bgColor
    background #f3f3f3
</style>
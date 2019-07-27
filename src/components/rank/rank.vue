<template>
  <div class="rank" ref="rank">
    <scroll class="toplist" ref="toplist">
      <ul>
        <li class="item" v-for="(items,index) in ranklist" @click="selectItem(items)" :key="index">
          <ol class="songlist">
            <li class="song" v-for="(item, index) in items.songList" :key="index">
              <span>{{index+1}}. {{ item.songname }}</span>
              <span class="name">{{ item.singername }}</span>
            </li>
          </ol>
          <div class="icon">
            <img width="120" height="120" :src="items.picUrl" />
          </div>
        </li>
      </ul>
      <!-- loading -->
      <div class="loading-container" v-show="!ranklist.length">
        <loading />
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import { getRanklist } from '@api/rank'
import Scroll from '@base/m-scroll/m-scroll'
import { mapMutations } from 'vuex'
import { playlistMixin } from '@common/js/mixin'
import loading from '@base/loading/loading'
export default {
  mixins: [playlistMixin],
  components: {
    Scroll,
    loading
  },
  data() {
    return {
      ranklist: []
    }
  },
  created() {
    this._getRanklist()
  },
  methods: {
    ...mapMutations('rankSong',['setRankSong']),
    _getRanklist() {
      getRanklist().then(res => {
        if (res.code === 0) {
          this.ranklist = res.data.topList
        }
      })
    },
    // 点击排行列表
    selectItem(item) {
      this.setRankSong(item)
      this.$router.push({
        path: `/rank/${item.id}`
      })
    },
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.rank.style.bottom = bottom
      this.$refs.toplist.refresh()
    }
  }
}
</script>

<style scoped lang="stylus">
@import '../../common/stylus/variable'
@import '../../common/stylus/mixin'
.rank
  position fixed
  width 100%
  top 88px
  bottom 0
  .toplist
    height 100%
    overflow hidden
    .item
      display flex
      margin 0 20px
      padding-top 10px
      &:last-child
        padding-bottom 20px
      .icon
        flex 0 0 100px
        width 120px
        img
          border-radius 0 8px 8px 0
      .songlist
        flex 1
        display flex
        flex-direction column
        justify-content center
        padding 0 20px
        height 120px
        overflow hidden
        background rgba(230, 230, 230, 0.2)
        color $color-text-d
        font-size $font-size-medium-x
        border-radius 8px 0 0 8px
        .song
          no-wrap()
          line-height 26px
          .name
            color #888
    .loading-container
      position absolute
      width 100%
      top 50%
      transform translateY(-50%)
</style>
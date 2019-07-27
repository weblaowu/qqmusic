<template>
  <div class="singer" ref="singer">
    <scroll class="listview" ref="listview" >
      <!-- 歌手列表 -->
      <ul>
        <li v-for="(groups, index) in singerlist" :key="index" class="list-group" ref="listGroup">
          <h2 class="list-group-title">{{ groups.title }}</h2>
          <ul>
            <li
              class="list-group-item"
              v-for="(item, index) in groups.items"
              :key="index"
              @click="selectSinger(item)"
            >
              <img v-lazy="item.headImg" alt class="avatar" />
              <span class="name">{{ item.sname }}</span>
            </li>
          </ul>
        </li>
      </ul>
      <!-- 检索列表 -->
      <div class="list-shortcut">
        <ul>
          <li
            class="item"
            v-for="(item, index) in getCheckIndex"
            :key="index"
            @click="scrollTo(index)"
          >{{ item }}</li>
        </ul>
      </div>
      <!--loading  -->
      <div class="loading-container" v-show="!singerlist.length">
        <loading></loading>
      </div>
    </scroll>
    <!-- singerDetail 渲染出口 -->
    <transition name="slide">
      <router-view />
    </transition>
  </div>
</template>

<script>
import scroll from '@base/m-scroll/m-scroll'
import loading from '@base/loading/loading'
import { getSingerlist } from '@api/singer'
import { mapMutations } from 'vuex'
import { playlistMixin } from '@common/js/mixin'
export default {
  mixins: [playlistMixin],
  data() {
    return {
      singerlist: []
    }
  },
  computed: {
    // 获取检索词
    getCheckIndex() {
      return this.singerlist.map((group, index) => {
        return group.title.slice(0, 1)
      })
    }
  },
  methods: {
    ...mapMutations('singer',['setSinger']),
    _getSingerlist() {
      // 调用歌手列表请求接口
      getSingerlist().then(res => {
        this.singerlist = this.sortSingerlist(res.data.list)
      })
    },
    // 处理歌手数据
    sortSingerlist(list) {
      let map = {
        hot: {
          title: '热门',
          items: []
        }
      }
      // 处理热门数据，取前十条数据为热门
      list.forEach((singer, index) => {
        if (index < 10) {
          map.hot.items.push({
            Fid: singer.Fsinger_mid,
            sname: singer.Fsinger_name,
            headImg: `http://y.gtimg.cn/music/photo_new/T001R300x300M000${singer.Fsinger_mid}.jpg?max_age=2592000`
          })
        }
        // 获取 Findex
        let Findex = singer.Findex
        if (!map[Findex]) {
          map[Findex] = {
            title: Findex,
            items: []
          }
        }
        map[Findex].items.push({
          Fid: singer.Fsinger_mid,
          sname: singer.Fsinger_name,
          headImg: `http://y.gtimg.cn/music/photo_new/T001R300x300M000${singer.Fsinger_mid}.jpg?max_age=2592000`
        })
      })
      // 得到一个无序的对象集合，需要对A~Z进行排序
      let hotData = [] // 存放 hot
      let retData = [] // 存放 A~Z
      for (let key in map) {
        let val = map[key] // 缓存一下 value
        if (val.title.match(/[a-zA-Z]/)) {
          // 匹配所有title是A~Z的内容
          retData.push(val) // 把所有A~Z放入retData数组中
        } else if (val.title === '热门') {
          hotData.push(val)
        }
      }
      retData.sort((a, b) => {
        // 把大写的A~Z转化成 Unicode 号在比较
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      // 拼接这两个数组
      return hotData.concat(retData)
    },
    // 点击当前歌手,传入 Fsinger_mid
    selectSinger(item) {
      // 触发 mutation type, 传入 item
      this.setSinger(item)
      // 路由跳转  item.Fid :  Fsinger_mid
      this.$router.push({
        path: `/singer/${item.Fid}`
      })
    },
    // 刷新scroll组件，重新计算滚动高度
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.singer.style.bottom = bottom
      this.$refs.listview.refresh()
    },
    // 滚动到检索对应歌手列表
    scrollTo(i) {
      // 获取 歌手列表的 li 集合
      let currentGroup = this.$refs.listGroup[i]
      // 调用scroll组件实例的方法
      this.$refs.listview.scrollToElement(currentGroup)
    }
  },
  created() {
    this._getSingerlist()
  },
  components: {
    scroll,
    loading
  }
}
</script>
<style scoped lang="stylus">
@import '~@common/stylus/variable'
.singer
  position fixed
  top 88px
  bottom 0
  width 100%
  .slide-enter-active, .slide-leave-active
    transition all 0.5s
  .slide-enter, .slide-leave-to
    transform translateX(100%)
  .listview
    position relative
    width 100%
    height 100%
    overflow hidden
    background #fff
    .list-group
      padding-bottom 30px
      .list-group-title
        height 30px
        line-height 30px
        padding-left 20px
        font-size $font-size-small
        color $color-text-l
        background #f2f2f2
      .list-group-item
        display flex
        align-items center
        padding 20px 0 0 30px
        .avatar
          width 70px
          height 70px
          border-radius 50%
        .name
          margin-left 20px
          color $color-text-l
          font-size $font-size-medium-x
    .list-shortcut
      position absolute
      z-index 30
      right 0
      top 50%
      transform translateY(-50%)
      width 20px
      padding 20px 0
      border-radius 10px
      text-align center
      background rgba(200, 200, 200, 0.1)
      font-family Helvetica
      .item
        padding 3px
        line-height 1
        color #333
        font-size $font-size-small
        &.current
          color $color-theme
    .list-fixed
      position absolute
      top 0
      left 0
      width 100%
      .fixed-title
        height 30px
        line-height 30px
        padding-left 20px
        font-size $font-size-small
        color $color-text-l
        background $color-highlight-background
    .loading-container
      display flex
      align-items center
      justify-content center
      transform translateY(100%)
</style>

<template>
  <transition name="slide">
    <music-list :title="title" :bgImage="bgImage" :songs="hotSonglist"></music-list>
  </transition>
</template>

<script>
import { getHotSonglist } from '@api/recommend'
import musicList from '@base/music-list/music-list'
import { mapGetters } from 'vuex'
import getPlaykey from '@api/playkey'
import Song from '@common/js/song'
export default {
  components: {
    musicList
  },
  data() {
    return {
      hotSonglist: []
    }
  },
  created() {
    this._getHotSonglist()
  },
  computed: {
    ...mapGetters('hotSong',['hotSong']),
    // 获取 title bgImage
    title() {
      if(this.hotSong.dissid){
        return this.hotSong.creator.name;
      }
    },
    bgImage() {
      return this.hotSong.imgurl
    }
  },
  methods: {
    _getHotSonglist() {
      // 刷新页面需要处理
      if (!this.hotSong.dissid) {
        this.$router.push('/recommend')
        return;
      }
      getHotSonglist(this.hotSong.dissid).then(res => {
        this.hotSonglist = this.sortHotSonglist(res.cdlist[0].songlist)
      })
    },
    // 处理 热门歌曲列表数据
    sortHotSonglist(list) {
      const ret = []
      const mid = []
      const purl = []
      const musicData = []
      list.forEach(item => {
        const albummid = item.album.mid
        const albumname = item.album.name
        const songid = item.id
        const songmid = item.mid
        const songname = item.name
        const singer = item.singer
        const interval = item.interval
        ret.push({
          albummid,
          albumname,
          songid,
          songmid,
          songname,
          singer,
          interval
        })
        mid.push(songmid)
      })
      // 发请求获取播放源
      this._getPlaykey(mid).then(res => {
        const data = res.midurlinfo
        // 遍历 res.midurlinfo 取出purl放入一个数组中
        data.forEach(item => {
          purl.push(item.purl)
        })
        // 必须保证 mid里面有内容
        ret.forEach((item, index) => {
          if (purl[index]) {
            let mDataUrl = Object.assign({}, item, {
              url: `http://223.111.104.155/amobile.music.tc.qq.com/${purl[index]}`
            })
            // 把数据放入 ret 数组中
            musicData.push(new Song(mDataUrl))
          }
        })
      })
      return musicData
    },
    _getPlaykey(songmid) {
      // 调用 getPlaykey 接口
      return getPlaykey(songmid).then(res => {
        if (res.code === 0) {
          // 表示请求数据是正确的
          return Promise.resolve(res.req_0.data)
        } else {
          return Promise.reject(err)
        }
      })
    }
  }
}
</script>

<style scoped lang="stylus">
.slide-enter-active, .slide-leave-active
  transition all 0.3s
.slide-enter, .slide-leave-to
  transform translate3d(100%, 0, 0)
</style>
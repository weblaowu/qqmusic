<template>
  <transition name="slide">
    <music-list :title='title' :bgImage='bgImage' :songs='rankSonglist'></music-list>
  </transition>
</template>

<script>
import musicList from "@base/music-list/music-list";
import { mapGetters } from "vuex";
import getPlayKey from "@api/playkey";
import Song from "@common/js/song";
import { getRankSonglist } from "@api/rank";
export default {
  components: {
    musicList
  },
  data() {
    return {
      rankSonglist: []
    };
  },
  created() {
    this._getRankSonglist();
  },
  computed: {
    ...mapGetters('rankSong',["rankSong"]),
    // 获取 title bgImage
    title() {
      return this.rankSong.topTitle;
    },
    bgImage() {
      return this.rankSong.picUrl;
    }
  },
  methods: {
    _getRankSonglist() {
      // 刷新页面需要处理
      if (!this.rankSong.id) {
        this.$router.push("/rank");
        return;
      }
      getRankSonglist(this.rankSong.id).then(res => {
        if (res.code === 0) {
          this.rankSonglist = this.sortSong(res.songlist);
        }
      });
    },
     // 处理歌曲信息
    sortSong(list) {
      let ret = [];   
      let smid = [];  // 存放 songmid 
      let purl = [];  // 存放 purl
      list.forEach(item=>{
        // 解构songmid, 放入一个数组中
        let { data: { songmid } } = item;
        smid.push(songmid)
      })
      // 调用 _getPlayKey 
      this._getPlayKey(smid).then(res=>{
        const data = res.midurlinfo;
        // 遍历 res.midurlinfo 取出purl放入一个数组中
        data.forEach(item=>{
          purl.push(item.purl)
        })

        // 遍历 取出 Data ，制作 song 类
        list.forEach((item, index) =>{
          let { data } = item;
          if(purl[index]){
            let mDataUrl = Object.assign({}, data, {
              url: `http://223.111.104.155/amobile.music.tc.qq.com/${ purl[index] }`
            });
            // 把数据放入 ret 数组中
            ret.push(new Song(mDataUrl));
          }
        })
      })
      return ret;
    },
    // 请求 歌曲播放源 
    _getPlayKey(songmid){
      // 调用 getPlayKey 接口
      return getPlayKey(songmid).then(res=>{
        if(res.code === 0){ // 表示请求数据是正确的
          return Promise.resolve(res.req_0.data);
        }else{
          return Promise.reject(err);
        }
      })
    }
  }
};
</script>

<style scoped lang="stylus">
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>
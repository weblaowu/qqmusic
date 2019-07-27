<template>
  <div class="singer-detail">
    <music-list 
      :title="getSname" 
      :bgImage="getHeadImg"
      :songs='songs'
    ></music-list>
    <!-- loading -->
    <div class="loading-container" v-show="!songs.length">
      <loading></loading>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import musicList from "@base/music-list/music-list";
import { getSonglist } from "@api/singer"
import Song from '@common/js/song'
import getPlayKey from '@api/playkey'
import loading from '@base/loading/loading'
export default {
  data(){
    return {
      songs: []
    }
  },
  components: {
    musicList,
    loading
  },
  computed: {
    ...mapGetters('singer',["singerInfo"]),
    getSname() {
      return this.singerInfo.sname;
    },
    getHeadImg() {
      return this.singerInfo.headImg;
    }
  },
  methods: {
    _getSonglist(){
      // 判断有没有 Fid = singermid 
      if(!this.singerInfo.Fid){
        // 返回上一级 并退出
        this.$router.push('/singer')
        return;
      }
      // 调用歌曲数据请求方法
      getSonglist(this.singerInfo.Fid).then(res=>{
          this.songs = this.sortSong(res.data.list);
      })
    },
    // 处理歌曲信息
    sortSong(list) {
      let ret = [];   
      let smid = [];  // 存放 songmid 
      let purl = [];  // 存放 purl
      list.forEach(item=>{
        // 解构songmid, 放入一个数组中
        let { musicData: { songmid } } = item;
        smid.push(songmid)
      })
      // 调用 _getPlayKey 
      this._getPlayKey(smid).then(res=>{
        const data = res.midurlinfo;
        // 遍历 res.midurlinfo 取出purl放入一个数组中
        data.forEach(item=>{
          purl.push(item.purl)
        })

        // 遍历 取出 musicData ，制作 song 类
        list.forEach((item, index) =>{
          let { musicData } = item;
          if(purl[index]){
            let mDataUrl = Object.assign({}, musicData, {
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
  },
  created(){
    this._getSonglist()
  }
};
</script>

<style scoped lang="stylus">
@import '~@common/stylus/variable';

.singer-detail {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: $color-background;
}
</style>
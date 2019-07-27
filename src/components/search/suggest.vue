<template>
  <scroll ref="suggest" class='suggest'>
    <ul class="suggest-list">
      <li class="suggest-item" v-for='(items, index) in result' :key='index'>
        <div class="icon">
          <i :class='getIcon(items)'></i>
        </div>
        <div class="name">
          <p class="text" v-text='getDiscName(items)'></p>
        </div>
      </li>
    </ul>
    <!-- loading -->
    <div class="loading-container" v-show="!result.length">
      <loading />
    </div>
    <div class="no-result-wrapper" display='none'>
      <!-- <no-result title="抱歉，暂无搜索结果"></no-result> -->
    </div>
  </scroll>
</template>
<script>
import { getSearch } from '@api/search.js'
import scroll from '@base/m-scroll/m-scroll'
import loading from '@base/loading/loading'
export default {
  components: {
    scroll,loading
  },
  data(){
    return {
      result: []
    }
  },
  props:{
    query: {
      type: String,
      default: ''
    }
  },
  // 根据搜索不同的内容，去请求数据
  watch: {
    query(){
      this._getSearch()
    }
  },
  methods: {
    _getSearch(){
      // 调用 getSearch 接口
      getSearch(this.query, 1).then(res=>{
        this.result = this.getResult(res.data)
      })
    },
    // 处理数据 点击歌手需要拼接歌手信息 
    getResult(data){
      let ret = [];
      // 判断当前是歌手 ，zhida && zhida.singerid
      if(data.zhida && data.zhida.singerid){
        // 获取歌手信息 ，存放在 ret
        ret.push({...data.zhida, ...{type: 'singer' }}) 
      }
      // 有歌曲存在
      if(data.song){
        // 把歌曲和歌手信息拼接一下
        ret = ret.concat(data.song.list)
      }
      return ret;
    },
    getIcon(item){
      if(item.type === 'singer'){
        return 'icon-mine'
      }else{
        return 'icon-music'
      }
    },
    getDiscName(item){
      if(item.type === 'singer'){
        return item.singername;
      }else{
        return `${item.songname} ~ ${this.filterSinger(item.singer) }`
      }
    },
    filterSinger(s) {
      let ret = [];
      if(!s){
        return;
      }
      s.forEach(item=>{
        ret.push(item.name)  
      })
      return ret.join(' / ') 
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "~@common/stylus/variable"
  @import "~@common/stylus/mixin"
  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
    .loading-container
      display flex
      align-items center
      justify-content center
      transform translateY(100%)
</style>
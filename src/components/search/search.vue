<template>
  <div class="search">
    <!-- search-box -->
    <div class="search-box-wrapper">
      <search-box @queryChange="changeQuery" ref="searchBox"></search-box>
    </div>
    <!-- hotkey  -->
    <div class="shortcut-wrapper" v-show="!searchQuery">
      <div class="shortcut">
        <div class="hot-key">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li
              class="item"
              v-for="(item,index) in hotkey"
              @click="selectItem(item.k)"
              :key="index"
            >
              <span>{{ item.k }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- suggest -->
    <div class="search-result" v-show="searchQuery">
      <suggest :query="searchQuery"></suggest>
    </div>
  </div>
</template>

<script>
import searchBox from './search-box'
import { getHotkey } from '@api/search.js'
import { ERR_OK } from '@common/js/paramConf'
import suggest from './suggest'
export default {
  data() {
    return {
      hotkey: [],
      searchQuery: ''
    }
  },
  components: {
    searchBox,
    suggest
  },
  methods: {
    changeQuery(query) {
      this.searchQuery = query
    },
    // 获取 hotkey
    _getHotkey() {
      // 调用请求接口
      getHotkey().then(res => {
        if (res.code === ERR_OK) {
          this.hotkey = res.data.hotkey.slice(0, 10)
        }
      })
    },
    selectItem(k) {
      this.$refs.searchBox.setQuery(k)
    }
  },
  created() {
    this._getHotkey()
  }
}
</script>

<style lang="stylus" >
@import '~@common/stylus/variable'
@import '~@common/stylus/mixin'
.search
  .search-box-wrapper
    margin 20px
  .shortcut-wrapper
    position fixed
    top 178px
    bottom 0
    width 100%
    .shortcut
      height 100%
      overflow hidden
      .hot-key
        margin 0 20px 20px 20px
        .title
          margin-bottom 20px
          font-size $font-size-medium-x
          color $color-text-l
          font-weight 900
        .item
          display inline-block
          padding 5px 8px
          margin 0 20px 10px 0
          border-radius 18px
          background $color-text-ll
          font-size $font-size-medium
          color $color-text-d
          border 1px solid #999
      .search-history
        position relative
        margin 0 20px
        .title
          display flex
          align-items center
          height 40px
          font-size $font-size-medium
          color $color-text-l
          .text
            flex 1
          .clear
            extend-click()
            .icon-clear
              font-size $font-size-medium
              color $color-text-d
  .search-result
    position fixed
    width 100%
    top 178px
    bottom 0
</style>
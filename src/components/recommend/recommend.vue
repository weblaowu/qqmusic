<template>
  <div class="recommend" ref='recom'>
    <scroll class="recommend-content" :data="sliderlist" ref='recontent'>
      <div>
        <!-- 轮播图 -->
        <div class="slider-wrapper">
          <m-slider :subSlider="sliderlist"></m-slider>
        </div>
        <!-- 热门歌曲列表 -->
        <div class="recommend-list">
          <div>
            <h1 class="list-title">民谣歌曲推荐</h1>
            <ul>
              <li v-for="(item,index) in Hotlist" class="item" :key="index" @click='selectHotSong(item)'>
                <div class="icon" :class="[(index+1) % 2 === 1 ? 'p-left':'p-right']">
                  <img v-lazy="item.imgurl" class='recom-img'/>
                </div>
                <div class="text" :class="[(index+1) % 2 === 1 ? 'p-left':'p-right']">
                  <h2 class="desc" v-text="item.dissname"></h2>
                  <p class="name" v-text="item.creator.name"></p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <!-- loading -->
        <div class="loading-container" v-show="!Hotlist.length">
          <loading></loading>
        </div>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>
<script>
import mSlider from "@base/m-slider/m-slider";
import { getSliderlist, getHotlist} from "../../api/recommend";
import scroll from "@base/m-scroll/m-scroll";
import { mapMutations } from 'vuex';
import { playlistMixin } from '@common/js/mixin'
import loading from '@base/loading/loading'
export default {
  mixins: [playlistMixin],
  components: {
    mSlider,
    scroll,
    loading
  },
  data() {
    return {
      sliderlist: [],
      Hotlist: []
    };
  },
  methods: {
    ...mapMutations('hotSong',['setHotSong']),
    _getSliderlist() {
      getSliderlist()
        .then(res => {
          this.sliderlist = res.data.slider;
        })
        .catch(err => {
          console.log(err);
        });
    },
    _getHotlist() {
      getHotlist().then(res => {
        if(res.code === 0){
          this.Hotlist = res.data.list;
        }
      });
    },
    // 热门列表点击事件处理
    selectHotSong(item){
      // 提交 mutation type -> setHotSong 
      this.setHotSong(item)
      // 路由跳转，到 recomDetail 页
      this.$router.push({
        path: `/recommend/${item.dissid}`
      })
    },
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : '';
      this.$refs.recom.style.bottom = bottom;
      this.$refs.recontent.refresh()
    } 
  },
  created() {
    this._getSliderlist();
    this._getHotlist();
  }
};
</script>

<style scoped lang="stylus" >
@import '~@common/stylus/variable';

.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;

  .recommend-content {
    height: 100%;
    overflow: hidden;

    .slider-wrapper {
      position: relative;
      width: 100%;
      overflow: hidden;
    }

    .recommend-list {
      height: 100%;
      overflow: hidden;
      position: relative;

      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-medium-x;
        color: $color-theme;
      }

      .item {
        display: inline-flex;
        box-sizing: border-box;
        align-items: center;
        flex-direction : column;
        width: 50%;
        .p-left {
          padding-left: 10px;
        }
        .p-right {
          padding-right: 10px;
        }
        .icon {
          flex: 0 0 60px;
          max-width: 160px;
          .recom-img {
            border-radius:10px;
            max-width: 160px;
          }
        }

        .text {
          line-height: 20px;
          font-size: $font-size-medium;
          max-width: 160px;
          margin-top: 6px;
          .name {
            margin-bottom: 10px;
            color: #888;
          }

          .desc {
            color: $color-text-d;
          }
        }
      }
    }

    .loading-container {
      display: flex;
      align-items: center;
      justify-content: center;
      transform: translateY(100%);
    }
  }
}
</style>
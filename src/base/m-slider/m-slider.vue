<template>
  <div class="slider">
    <van-swipe class="slider-group" :autoplay="5000">
      <van-swipe-item class='slider-item' v-for='(item,index) in subSlider' :key='index'>
        <img :src='item.picUrl'>
      </van-swipe-item> 
    </van-swipe>
  </div>
</template>

<script >
export default {
  props: {
    subSlider: {
      type: Array,
      default() {
        return []
      }
    }
  }
  
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
 @import '~@common/stylus/variable.styl';

.slider {
  min-height: 1px;

  .slider-group {
    position: relative;
    overflow: hidden;
    white-space: nowrap;

    .slider-item {
      float: left;
      box-sizing: border-box;
      overflow: hidden;
      text-align: center;

      a {
        display: block;
        width: 100%;
        overflow: hidden;
        text-decoration: none;
      }

      img {
        display: block;
        width: 100%;
      }
    }
  }
}
</style>
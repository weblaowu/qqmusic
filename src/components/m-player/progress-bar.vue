<template>
  <div class="progress-bar" ref="progressBar">
    <!-- 进度条显示内容 -->
    <div class="bar-inner" @click='clickProgress'>
      <!-- 当前进度显示  -->
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
        @touchstart.prevent='touchStart'
        @touchmove.prevent='touchMove'
        @touchend='touchEnd'
      >
        <!-- 进度按钮 -->
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script >
export default {
  created(){
    // 创建一个临时对象来保存touch事件信息
    this.touches = {}
  },
  props: {
    percent: { // 播放进度 百分比
      type: Number,
      default: 0
    }
  },
  methods: {
    touchStart(e){
      // 记录一个 flag 标志位 isStart 
      this.touches.isStart = true;
      // 记录起始坐标 
      this.touches.startX = e.touches[0].pageX;
      // 记录当前进度显示长度
      this.touches.offsetWidth = this.$refs.progress.clientWidth; 
    },
    touchMove(e){
      // 判断当前 isStart 
      if(!this.touches.isStart){
        return;
      }
      // 计算进度按钮滑动的距离 end - start
      const distanceX = e.touches[0].pageX - this.touches.startX;
      // 真正需要位移的距离 = 当前进度显示长度 + distanceX
      const left =  Math.min(this.$refs.progressBar.clientWidth - 16,  Math.max(0, this.touches.offsetWidth + distanceX));
      // 调用位移方法
      this._offset(left)
    },
    touchEnd(e){
      // isStart 为 false 
      this.touches.isStart = false; 
      // 计算当前进度百分比 
      this._triggerPercent()
    },
    _triggerPercent(){
      // 获取 进度总长度 
      const barWidth = this.$refs.progressBar.clientWidth - 16;
      const percent = this.$refs.progress.clientWidth / barWidth;
      // 把新的percent传给父组件 m-player
      this.$emit('percentChange',percent)
    },
    _offset(o){
       // 设置播放按钮位移
      this.$refs.progressBtn.style.transform = 
                                   `translateX(${o}px)`;
      // 设置当前进度显示
      this.$refs.progress.style.width = `${o}px`;
    },
    // 点击改变进度
    clickProgress(e){
      this. _offset(e.offsetX);
      this._triggerPercent()
    } 
  },
  watch: {
    // 当播放进度改变时，进度条的进度就要改变
    percent(newPerc){
      // 当滑动时，权值高于自动播放，停止watch
      if(this.touches.isStart){
        return;
      }
      //  当前进度条进度 = 进度条总长 * 当前播放进度(百分比) 
      const barWidth =  this.$refs.progressBar.clientWidth - 16;
      const offsetWidth = barWidth * newPerc;
      // 调用位移方法
      this._offset(offsetWidth)
    }
  }
};
</script>

<style scoped lang="stylus">
@import '~@common/stylus/variable';

.progress-bar {
  height: 30px;

  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(255, 255, 255, 0.5);

    .progress {
      position: absolute;
      height: 100%;
      background: $color-theme;
    }

    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;

      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid #fff;
        border-radius: 50%;
        background: #fff;
      }
    }
  }
}
</style>
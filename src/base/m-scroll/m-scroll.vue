<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>
<script>
import BScroll from "better-scroll";
export default {
  props: {
    // 设置滚动的效果 
    // 1 会非实时派发scroll 事件
    // 2 实时派发scroll 事件
    // 3 动画运行过程中也会实时派发 scroll 事件
    probeType: {
      // 验证函数
      type: Number,
      default: 1
    },
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    pullup: {
      type: Boolean,
      default: false
    },
    listenScroll: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    _initScroll() {
      // 如果组件没有加载，直接返回
      if (!this.$refs.wrapper) {
        return;
      }
      // 参数：1. 滚动的父元素 2. options选项
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: true,
        // 开启滚动动画
        momentum:true,
        // 滚动动画时长  ms
        swipeTime: 1500,
        // 滚动动画的减速度  number
        deceleration: 0.003
      }); 
      // 如果有滚动监听，派发一个自定义scroll事件出去
      if(this.listenScroll) {
        // 注册原生scroll事件
        this.scroll.on('scroll', (prop)=>{
          this.$emit('scroll', prop)
        })
      }
    },
    enable() {
      // 启动BScroll
      this.scroll && this.scroll.enable();
    },
    disable() {
      // 禁止 BScroll
      this.scroll && this.scroll.disable();
    },
    refresh() {
      this.scroll && this.scroll.refresh();
    },
    scrollToElement(elem, ms) {
      // 滚动到指定元素 elem  , ms : 滚动过渡时间
      this.scroll && this.scroll.scrollToElement(elem, ms);
    },
    // 滚动到指定的位置 
    scrollTo(x, y, ms) {
      this.scroll && this.scroll.scrollTo(x, y, ms);
    } 
  },
  mounted() {
    this.$nextTick(() => {
      // 执行 BScroll， 确保在DOM加载完成之后
      this._initScroll();
    });
  },
  watch: {
    data() {
      setTimeout(() => {
        this.refresh();
      }, 20);
    }
  }
};
</script>

<template>
  <div>
    <m-header></m-header>
    <Tab></Tab>
    <!-- 缓存组件渲染内容 -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <m-player></m-player>  
  </div>
</template>
<script>
import MHeader from './components/m-header/m-header'
import Tab from './components/tab/tab'
import MPlayer from './components/m-player/m-player'
export default {
  components: {
    MHeader,
    Tab,
    MPlayer
  }
}
</script>

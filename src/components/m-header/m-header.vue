<template>
  <div class="m-header">
    <h1 class="text">Vue - Music</h1>
  </div>
</template>

<style  lang="stylus" scoped>
 @import '~@common/stylus/variable';
 @import '~@common/stylus/mixin'; 

.m-header {
  position: relative;
  height: 44px;
  text-align: center;
  color: $color-theme;
  font-size: 0;

  .text {
    display: inline-block;
    vertical-align: top;
    line-height: 44px;
    font-size: $font-size-large;
  }

  .mine {
    position: absolute;
    top: 0;
    right: 0;

    .icon-mine {
      display: block;
      padding: 12px;
      font-size: 20px;
      color: $color-theme;
    }
  }
}
</style>
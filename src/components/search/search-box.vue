<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input ref="query" class="box" 
      :placeholder="placeholder" 
      v-model="query" 
    />
    <i class="icon-dismiss" 
       v-show="query" 
       @click="dismiss"
    ></i>
  </div>
</template>

<script >
export default {
  props: {
    placeholder: {
      type: String,
      default: "请输入歌曲或歌手"
    }
  },
  data() {
    return {
      query: ""
    };
  },
  methods: {
    dismiss() {
      this.query = '';
    },
    // 设置 query 值 
    setQuery(query){
      this.query = query;
    }
  },
  watch: {
    query(newVal){
      // 派发一个事件出去
      this.$emit('queryChange',newVal);
    }
  }
};
</script>

<style scoped lang="stylus">
@import '~@common/stylus/variable';

.search-box {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 0 6px;
  height: 40px;
  background: #f3f3f3;
  border-radius: 20px;

  .icon-search {
    font-size: 24px;
    color: $color-background;
  }
  input::-webkit-input-placeholder {
    color: #999;
  }
  input:-moz-placeholder {
    color: #999;
  }
  input:-ms-input-placeholder {
    color: #999;
  }
  .box {
    flex: 1;
    margin: 0 5px;
    line-height: 30px;
    background: #f3f3f3;
    color: $color-text;
    font-size: $font-size-medium;

    &::placeholder {
      color: $color-text-d;
    }
  }
  
  .icon-dismiss {
    font-size: 16px;
    color: $color-dialog-background;
  }
}
</style>
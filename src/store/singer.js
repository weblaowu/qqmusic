const state = {
  // 歌手信息
  singerInfo: {}
}

const getters = {
  // 获取歌手信息
  singerInfo(state) {
    return state.singerInfo;
  }
}

const mutations = {
  // 设置歌手信息
  setSinger(state, singer){
    state.singerInfo = singer;
  }
}

export default {
  state,
  getters,
  mutations,
  namespaced: true
}
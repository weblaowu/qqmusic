const state  = {
  hotSong: [], // 当前热歌
}

const getters  = {
  // 当前热门列表歌曲 
  hotSong(state) {
    return state.hotSong
  }
}

const mutations = {
  // 设置当前热门列表歌曲
  setHotSong(state, list){
    state.hotSong = list;
  }
} 

export default {
  state,
  getters,
  mutations,
  namespaced: true
}
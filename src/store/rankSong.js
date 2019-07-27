const state  = {
  rankSong: [] // 当前排行歌曲 
}

const getters  = {
  // 当前热门列表歌曲 
  rankSong(state) {
    return state.rankSong
  }
}

const mutations = {
  // 设置当前热门列表歌曲
  setRankSong(state, list){
    state.rankSong = list;
  }
} 

export default {
  state,
  getters,
  mutations,
  namespaced: true
}
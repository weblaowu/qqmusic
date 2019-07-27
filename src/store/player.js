import { playMode } from '@common/js/paramConf'
const state  = {
  // player的状态
  playing: false,
  playList: [],
  orderList: [],
  currentIndex: -1,
  fullScreen: false,
  playMode: playMode.order,
  url: '' 
}

const getters  = {
  playing(state){
    return state.playing
  },
  playList(state){
    return state.playList
  },
  orderList(state){
    return state.orderList
  },
  fullScreen(state){
    return state.fullScreen
  },
  playMode(state){
    return state.playMode
  },
  currentIndex(state){
    return state.currentIndex
  },
  // 当前歌曲 currentSong 
  currentSong(state){
    return state.playList[state.currentIndex] || {}
  }
} 

const mutations = {
  setPlayList(state, list){
    state.playList = list;
  },
  setOrderList(state, list){
    state.orderList = list;
  },
  setFullScreen(state, bool){
    state.fullScreen = bool;
  },
  setPlayMode(state, num){
    state.playMode = num;
  },
  setCurrentIndex(state, index){
    state.currentIndex = index;
  },
  setPlaying(state, bool){
    state.playing = bool;
  }
}

/* 封装多个 mutations, 提交 actions  */ 
const actions = {
  selectPlay({ commit },{ list, index }) {
    commit('setPlaying', true)
    commit('setPlayList', list)
    commit('setOrderList', list)
    commit('setCurrentIndex', index)
  }
}

export default {
  state,
  getters,
  mutations,
  actions,
  namespaced: true
}
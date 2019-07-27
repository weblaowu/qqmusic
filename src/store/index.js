import Vue from 'vue';
import Vuex from 'vuex';
import singer from './singer'
import player from './player'
import hotSong from './hotSong'
import rankSong from './rankSong'

Vue.use(Vuex);

export default new Vuex.Store({
  // 按模块划分，引入各个模块 
  modules: {
    singer,
    player,
    hotSong,
    rankSong
  }
})
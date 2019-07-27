import { mapGetters } from 'vuex';
export const playlistMixin = {
  computed: {
    ...mapGetters('player',['playList'])
  },
  mounted() {
    this.handlePlaylist(this.playList)
  },
  // 切换组件时激活
  activated() {
    this.handlePlaylist(this.playList)
  },
  watch: {
    // playList发生变化 
    playList(newVal) {
      this.handlePlaylist(newVal)
    }
  },
  methods: {
    handlePlaylist(){
      throw new Error('handlePlaylist must be defined')
    }
  },
}
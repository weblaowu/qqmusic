/*  
  musicData 有我们需要的数据。
  albummid , albumname , songid, songmid, songname, singer 
  我们定义一个类 来保存这个数据，多次使用 
*/ 
// 引入歌词接口
import getLyric from '@api/lyric';
import {  Base64 } from 'js-base64';
class Song {
  constructor({albummid, albumname, songid, songmid, songname, singer,interval, url}) {
    this.albumname = albumname; // 专辑名
    this.songid = songid;     // 歌曲id
    this.songmid = songmid;   // 歌曲播放源
    this.songname = songname; // 歌曲名
    this.singer = filterSinger(singer); // 歌手
    this.albummid = `http://y.gtimg.cn/music/photo_new/T002R300x300M000${albummid}.jpg?max_age=2592000`; // 专辑图片
    this.url = url;
    this.interval = interval;
    // 播放源
  }
  // song 类请求lyric的方法，私有方法
  _getLyric(){
    // 判断有歌词有返回
    if(this.lyric){
      return Promise.resolve(this.lyric)
    }
    // 否则返回 promsie 对象 
    return new Promise((resolve, reject)=> {
      getLyric(this.songmid).then(res=> {
        if(res.code === 0){
          // res.lyric 是base64格式，需要处理 Base64.decode()
          this.lyric = Base64.decode(res.lyric);
          resolve(this.lyric);
        }else{
          reject('lyric is not defined')
        }
      })
    })
  }
}
// 把歌手数组变成字符串
function filterSinger(s){
  let ret = [];
  if(!s){
    return;
  }
  s.forEach(item=>{
    ret.push(item.name)  
  })
  return ret.join(' / ') 
}

export default Song;
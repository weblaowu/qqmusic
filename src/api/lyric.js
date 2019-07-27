/* 请求歌词的接口 getLyric */ 
import { commonParams } from '@common/js/paramConf'
import axios from 'axios'
export default function getLyric(songmid){
  const url = '/lyric/fcgi-bin/fcg_query_lyric_new.fcg';
  const data = Object.assign({}, commonParams, {
    pcachetime: new Date().getTime(),
    songmid: songmid,
    notice: 0,
    platform: 'yqq.json',
    needNewCode: 0,
  })
  return axios.get(url, {
    params: data
  }).then(res=>{
    return Promise.resolve(res.data)
  })
}
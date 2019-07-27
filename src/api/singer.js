import { commonParams } from '@common/js/paramConf'
import axios from 'axios';
/* singer 的请求文件 */ 
// 请求 歌手列表数据 
const getSingerlist = ()=> {
  const url = `/v8/fcg-bin/v8.fcg`
  const data = Object.assign({}, commonParams, {
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq.json',
    page: 'list',
    channel: 'singer',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1
  })
  return axios.get(url,{
    params: data
  }).then(res=>{
    return Promise.resolve(res.data)
  }).catch(err=>{
    console.log(err)
  }) 
}

// 获取歌曲列表
const getSonglist = (singermid)=>{
  const url = `/v8/fcg-bin/fcg_v8_singer_track_cp.fcg`
  const data = Object.assign({}, commonParams, {
    singermid: singermid, 
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    order: 'listen',
    begin: 0,
    num: 100,
    songstatus: 1
  })
  return axios.get(url,{
    params: data
  }).then(res=>{
    return Promise.resolve(res.data)
  }).catch(err=>{
    console.log(err)
  })
}

export {
  getSingerlist,
  getSonglist
}
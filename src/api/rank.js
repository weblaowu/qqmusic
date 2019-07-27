/* 排行页的请求数据接口 */
import {
  commonParams
} from '@common/js/paramConf'
import axios from 'axios';
const getRanklist = ()=>{
  const url = '/v8/fcg-bin/fcg_myqq_toplist.fcg'
  const data = Object.assign({}, commonParams, { 
    uin: 0,
    platform: 'h5',
    needNewCode: 1
  })
  return axios.get(url, {
    params: data
  }).then(res => {
    if(res.data.code === 0){
      return Promise.resolve(res.data)
    }
  })
} 

//排行二级页接口 
const getRankSonglist = (topid)=>{
  const url = '/v8/fcg-bin/fcg_v8_toplist_cp.fcg'
  const data = Object.assign({}, commonParams, { 
    topid,
    uin: 0,
    tpl: 3,
    page: 'detail',
    type: 'top',
    platform: 'h5',
    needNewCode: 1
  })
  return axios.get(url, {
    params: data
  }).then(res => {
    if(res.data.code === 0){
      return Promise.resolve(res.data)
    }
  }) 
}

export {
  getRanklist,
  getRankSonglist
}
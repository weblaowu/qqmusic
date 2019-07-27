// https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg
import {
  commonParams
} from '@common/js/paramConf'
import axios from 'axios';
export function getHotkey() {
  const url = `/splcloud/fcgi-bin/gethotkey.fcg`;
  const data = Object.assign({}, commonParams, {
    uin: 0,
    notice: 0,
    platform: 'h5',
    needNewCode: 1
  })
  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

// 根据搜索关键词请求数据 
// w: 关键字 p: page 页面 
export function getSearch(query, page) {
  const url = `/soso/fcgi-bin/search_for_qq_cp`;
  const data = Object.assign({}, commonParams, {
    uin: 0,
    notice: 0,
    platform: 'h5',
    needNewCode: 1,
    w: query,
    zhidaqu: 1,
    catZhida: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    perpage: 20,
    n: 20,
    p: page,
    remoteplace: 'txt.mqq.all'
  })
  return axios.get(url, {
    params: data
  }).then(res=>{
    return Promise.resolve(res.data)
  })
}
import { commonParams } from '@common/js/paramConf'
import axios from 'axios';
/*  请求推荐相关的数据  */
// 1. 请求轮播图 
const getSliderlist = () => {
  // slider 的 url 
  const url = `/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg`;
  const data = Object.assign({}, commonParams, {
    uin: 0,
    platform: 'h5',
    needNewCode: 1
  });
  // 发起请求 AJax
  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  }).catch(err => {
    return Promise.reject(err)
  })
}

// 2.请求热门歌曲推荐列表数据 
const getHotlist = () => {
  const url = `/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg`;
  const data = Object.assign({}, commonParams, {
    picmid: 1,
    rnd: Math.random(),
    platform: 'yqq.json',
    needNewCode: 0,
    categoryId: 28,
    sortId: 5,
    sin: 0,
    ein: 19,
  })
  return axios.get(url, {
    params: data
  }).then(res => {
    if(res.data.code === 0){
      return Promise.resolve(res.data)
    }
  })
}

// 请求热门列表每一列歌曲接口
const getHotSonglist = (dissid) => {
  const url = `/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg`;
  const data = Object.assign({}, commonParams, {
    disstid: dissid,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    platform: 'yqq',
    new_format: 1,
    hostUin: 0,
    needNewCode: 0
  })
  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

export {
  getSliderlist,
  getHotlist,
  getHotSonglist
}
import { commonParams } from '@common/js/paramConf'
import axios from 'axios';
// 获取歌曲的播放源  songmid => Array 类型
export default function getPlaykey(songmid) {
  const url = '/cgi-bin/musicu.fcg'
  const data = Object.assign({}, commonParams, {
    hostUin: 0,
    platform: 'yqq.json',
    needNewCode: 0,
    data: {
      "req": {
        "module": "CDN.SrfCdnDispatchServer",
        "method": "GetCdnDispatch",
        "param": {
          "guid": "7592953634",
          "calltype": 0,
          "userip": ""
        }
      },
      "req_0": {
        "module": "vkey.GetVkeyServer",
        "method": "CgiGetVkey",
        "param": {
          "guid": "7592953634",
          // songmid 是数组
          "songmid": songmid,
          "songtype": [0],
          "uin": "729346758",
          "loginflag": 1,
          "platform": "20"
        }
      },
      "comm": {
        "uin": 729346758,
        "format": "json",
        "ct": 24,
        "cv": 0
      }
    }
  })
  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  }).catch(err => {
    console.log(err)
  })
}




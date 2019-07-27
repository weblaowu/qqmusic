/* param 公共参数 */
const commonParams = {
  format: 'json',
  inCharset: 'utf8',
  outCharset: 'utf-8',
  notice: 0,
  g_tk: 5381
} 

// 设置播放模式  语义化
const playMode = {
  order: 0,  // 顺序 
  loop: 1,   // 循环
  random: 2  // 随机
}

// code : 0 | -1 | -2， data , msg , descri
const ERR_OK  = 0;


export {
  commonParams,
  playMode,
  ERR_OK
}
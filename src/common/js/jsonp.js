/* 引入安装的插件 jsonp */
import jsonpPlugin from 'jsonp';

// 在其基础上封装一层，希望封装成 promise 对象 data(Object) 
export default function codeJsonp (url, data, opt) {
  // GET 请求，url?key=val&key=val
  url += "?" + params(data);
  // 返回一个 promise 对象
  return new Promise((resolve,reject)=> {
    // 调用jsonpPlugin(url,opt, cb)
    jsonpPlugin(url, opt, (err, data)=>{
      if(err) {
        reject(err)
      }else{
        resolve(data)
      }
    })
  })
}  

// 定义一个处理data的方法 params 
function params(data){
  let urlData = '';
  for(let key in data){
    urlData += `&${key}=${data[key]}`
  }
  return urlData.slice(1);
}


//axios全局常量
import {baseURLNode, headers} from './config.js'

import axios from 'axios'

const serviceNode=axios.create({
    baseURL:baseURLNode,
    timeout:120000,
    headers
})

//request请求拦截器
serviceNode.interceptors.request.use((config)=>{
    console.log('请求拦截器经过');
    return config
},(error)=>{
    Promise.reject(error)
})


//response响应拦截器
serviceNode.interceptors.response.use(
    (res)=>{
    console.log("Node服务器响应拦截器");
    const status=res.status || 200;
    const message=res.data.message
    if(status==200||status==201){
       
        console.log(res)
        console.log(res.data);
        return res.data  
    }else{
        console.warn('响应错误');
        return message
    }   
},
    (error)=>{
        return error;
    }
)

export default serviceNode
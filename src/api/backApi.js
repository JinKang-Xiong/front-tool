import { method } from 'lodash-es'
import request from '../utils/axios/request.js'
import requestN from '../utils/axios/requestN.js'
import { async } from '@kangc/v-md-editor'



//登录接口
export function ManagerLoginAPI(query){
    return request({
        url:'/bigmanager/login',
        method:'post',
        data:query
    })
}

//获取当前的用户态
export function ManagerCurrent(query,token){
    return request({
        url:'/bigmanager/current',
        method:'get',
        headers:{
            'Authorization':token
        },
        data:query
    })
}

//搜索分页获取数据的接口
export async function UserManagePage(query){
    return request({
        url:'/user/search',
        method:'post',
        data:query
    })
}

//编辑接口
export async function UserEdit(query){
    return request({
        url:'/user/edituser',
        method:'get',
        params:query
    })
}

//注销接口
export async function UserDelete(query){
    return request({
        url:'/user/delete',
        method:'post',
        params:query
    })
}

//编辑大管理员的基础信息接口
export async function BigManagerUpdateBasic(query){
    return request({
        url:'/bigmanager/updatebasic',
        method:'post',
        data:query
    })
}

//新增加管理员
export async function BigManagerAdd(query){
    return request({
        url:'/bigmanager/addbigmanager',
        method:'post',
        data:query
    })
}

//搜索分页管理员
export async function BigManagerSearch(query){
    return request({
        url:'/bigmanager/search',
        method:'post',
        data:query
    })
}

//注销管理员
export async function BigManagerDelete(query){
    return request({
        url:'/bigmanager/deleteBigManager',
        method:'get',
        params:query
    })
}

//统计用户总数
export async function UserTotalAPI(query){
    return request({
        url:'/user/total',
        method:'get',
        params:query
    })
}

//统计公共资源的数量
export async function UserPublicSumAPI(){
    return request({
        url:'/user/sumpublic',
        method:'get'
    })
}


//统计异常用户总数
export async function UserAbnormalAPI(){
    return request({
        url:'/user/abnormal',
        method:'get'
    })
}

//统计管理员的总数
export async function BigManagerTotalAPI(){
    return request({
        url:'/bigmanager/total',
        method:'get'
    })
}

//获取前几的数据
export async function UserSortAPI(query){
    return request({
        url:'/user/queryRange',
        method:'get',
        params:query
        
    })
}

//获取验证码的接口
export async function VaildateCheckAPI(query){
    return request({
        url:'/bigmanager/validatecheck',
        method:'get',
        params:query
    })
}

export async function UpdatePhoneAPI(query){
    return request({
        url:'/bigmanager/updatephone',
        method:'get',
        params:query
    })
}

//修改密码
export async function UpdatePasswordByPhoneAPI(query){
    return request({
        url:'/bigmanager/updatePasswordByPhone',
        method:'post',
        data:query
    })
}

//邮箱验证码
export async function EmailVaildateAPI(query){
    return request({
        url:'/bigmanager/emailvalidate',
        method:'get',
        params:query
    })
}

//修改邮箱
export async function UpdateEmail(query){
    return request({
        url:'/bigmanager/updateemail',
        method:'post',
        data:query
    })
}

//根据id查询管理员信息
export async function QueryByIdAPI(query){
    return request({
        url:'/bigmanager/querybyid',
        method:'get',
        params:query
    })
}

export async function UpdateBigManagerAPI(query){
    return request({
        url:'/bigmanager/updateBigManager',
        method:'post',
        data:query
    })
}

//获取忘记密码验证码
export async function emailUserVerifyForgetAPI(query){
    return request({
        url:'/bigmanager/emailvalidateforget',
        method:'get',
        params:query
    })
}


//根据邮箱修改密码
export async function updatePasswordUserByEmail(query){
    return request({
        url:'/bigmanager/updatepasswordbyemail',
        method:'get',
        params:query
    })
}

//发送反馈信息给邮箱
export async function sendTipOffAPI(query){
    return request({
        url:'/user/sendtipoff',
        method:'get',
        params:query
    })
}

//#region 审核功能
export async function FindAllTipOffAPI(query){
    return requestN({
        url:'/tipoff/findall',
        method:'get',
        params:query
    })
}

export async function FindTipOffByIdAPI(query){
    return requestN({
        url:'/tipoff/findbyid',
        method:'get',
        params:query
    })
}

//根据id获取用户的id
export async function FindUserByIdAPI(query){
    return request({
        url:'/user/finduserbyid',
        method:'get',
        params:query
    })
}

//通过和封禁的操作
export async function UpdateTipOff(query){
    return requestN({
        url:'/tipoff/update',
        method:'post',
        data:query
    })
}

//统计各反馈处理情况
export async function CountisDisPoseAPI(query){
    return requestN({
        url:'/tipoff/countdispose',
        method:'get',
        params:query
    })
}

//#endregion

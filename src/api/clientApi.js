import requestN from '../utils/axios/requestN.js'
import request from '../utils/axios/request.js'
import { async } from '@kangc/v-md-editor'

//#region 个人中心 and 系统消息
//用户登录功能
export async function UserLoginAPI(query){
    return request({
        url:'/user/login',
        method:'post',
        data:query
    })
}

//注册接口
export async function UserRegisterAPI(query){
    return request({
        url:'/user/register',
        method:'post',
        data:query
    })
}

//获取用户信息的接口
export function UserCurrentAPI(query,token){
    return request({
        url:'/user/current',
        method:'get',
        headers:{
            'Authorization':token
        },
        data:query
    })
}

//修改基本信息
export async function UpdateUserBaseAPI(query){
    return request({
        url:'/user/updatebasic',
        method:'get',
        params:query
    })
}

//修改密码
export async function UpdateUserPasswordByPasswordAPI(query){
    return request({
        url:'/user/updatePassword',
        method:'post',
        data:query
    })
}

//接受邮箱验证码
export async function emailUserVerifyAPI(query){
    return request({
        url:'/user/emailvalidate',
        method:'get',
        params:query
    })
}

//修改用户的邮箱
export async function emailUserUpdateAPI(query){
    return request({
        url:'/user/updateemail',
        method:'get',
        params:query
    })
}

//获取手机验证码
export async function phoneUserVerifyAPI(query){
    return request({
        url:"/user/validatecheck",
        method:'get',
        params:query
    })
}

//修改用户的手机
export async function phoneUserUpdateAPI(query){
    return request({
        url:'/user/updatephone',
        method:'get',
        params:query
    })
}

//获取忘记密码验证码
export async function emailUserVerifyForgetAPI(query){
    return request({
        url:'/user/emailvalidateforget',
        method:'get',
        params:query
    })
}


//根据邮箱修改密码
export async function updatePasswordUserByEmail(query){
    return request({
        url:'/user/updatepasswordbyemail',
        method:'get',
        params:query
    })
}

//查询用户的消息中心
export async function FindAllMessageAPI(query){
    return requestN({
        url:'/message/findall',
        method:'get',
        params:query
    })
}

//删除用户的全部消息
export async function DeleteMessageAllAPI(query){
    return requestN({
        url:'/message/deleteall',
        method:'put',
        params:query
    })
}

//删除用户单个消息
export async function DeleteMessageOneAPI(query){
    return requestN({
        url:"/message/deleteone",
        method:'put',
        params:query
    })
}

//把消息全部改为已读
export async function UpdateAllMessageStatusAPI(query){
    return requestN({
        url:'/message/updateall',
        method:'put',
        params:query
    })
}

//查询用户的全部消息状态
export async function FindAllMessageStatusAPI(query){
    return requestN({
        url:"/message/findallstatus",
        method:'get',
        params:query
    })
}

//#endregion



//#region 首页

//查询用户的快捷仓库
export async function FindFastOpenByUserAPI(query){
    return requestN({
        url:'/fastopenstore/findbyuser',
        method:'get',
        params:query
    })
}

//增加用户的快捷仓库
export async function AddFastOpenAPI(query){
    return requestN({
        url:'/fastopenstore/add',
        method:'post',
        data:query
    })
}

//从快捷仓库移出
export async function DeleteFastOpenAPI(query){
    return requestN({
        url:'/fastopenstore/update',
        method:'put',
        params:query
    })
}

//搜索热门公共书籍
export async function FindHotPublicBook(query){
    return requestN({
        url:'/book/hotpublic',
        method:'get',
    })
}

//搜索热门公共代码片段
export async function FindHotPublicCode(query){
    return requestN({
        url:'/code/findhotpublic',
        method:'get',
    })
}

//搜索热门公共笔记
export async function FindHotPublicNote(query){
    return requestN({
        url:'/note/findhotpublic',
        method:'get',
    })
}

//统计私人和公共资源总数
export async function CountPrivateTotalByUserConAPI(query){
    return requestN({
        url:'/fastopenstore/resourcetotal',
        method:'get',
        params:query
    })
}

//统计用户每月的资源总数
export async function CountCreateTotalByMonthConAPI(query){
    return requestN({
        url:'/fastopenstore/createtotal',
        method:'get',
        params:query
    })
}

//统计用户未归档小灵的比例
export async function CountMemoAPI(query){
    return requestN({
        url:'/fastopenstore/memototal',
        method:'get',
        params:query
    })
}


//#endregion


//#region 任务管理器

//查询标签
export async function FindTagAPI(query){
    return requestN({
        url:'/memo/findtag',
        method:'get',
        params:query
    })
}

//增加小灵
export async function AddMemoAPI(query){
    return requestN({
        url:'/memo/add',
        method:'post',
        data:query
    })
}

//获取小灵
export async function ListMemoAPI(query){
    return requestN({
        url:'/memo/findall',
        method:'get',
        params:query
    })
}

//修给小灵位置——取消置顶——置顶
export async function UpdateTopAPI(query){
    return requestN({
        url:'/memo/updatetop',
        method:'put',
        params:query
    })
}

//修改小灵 必要把这些全部传回来，不能只传修改的 
export async function EditMemoAPI(query){
    return requestN({
        url:'/memo/editmemo',
        method:'post',
        data:query
    })
}

//小灵归档
export async function FileMemoAPI(query){
    return requestN({
        url:'/memo/filememo',
        method:'put',
        params:query
    })
}

//删除小记
export async function DeleteMemoAPI(query){
    return requestN({
        url:'/memo/deletememo',
        method:'delete',
        params:query
    })
}

//查询用户的数据，归档和未归档的
export async function FindListAPI(query){
    return requestN({
        url:'/task/findall',
        method:'get',
        params:query
    })
}

//没有未归档的用户
export async function AddTaskListAPI(query){
    return requestN({
        url:'/task/addtasklist',
        method:'post',
        data:query
    })
}

//有未归档的用户
export async function AddTaskAPI(query){
    return requestN({
        url:'/task/addtask',
        method:'post',
        data:query
    })
}

//提前完成和完成的时间插入
export async function FinshTaskAPI(query){
    return requestN({
        url:'/task/finshtask',
        method:'post',
        data:query
    })
}

//查询任务集中的任务
export async function FindTaskAPI(query){
    return requestN({
        url:'/task/findtask',
        method:'get',
        params:query
    })
}

//编辑任务集中的单个任务
export async function UpdateTaskAPI(query){
    return requestN({
        url:'/task/updatetask',
        method:'post',
        data:query
    })
}

//删除任务集中的任务
export async function DeleteTaskAPI(query){
    return requestN({
        url:'/task/deletetask',
        method:'put',
        params:query
    })
}

//任务归档
export async function FileTaskListAPI(query){
    return requestN({
        url:'/task/filetasklist',
        method:'post',
        data:query

    })
}

//任务归档删除
export async function DeleteTaskFileAPI(query){
    return requestN({
        url:'/task/deletefiletask',
        method:'put',
        params:query
    })
}
//#endregion


//#region 代码片段的API

//查询用户全部代码库
export async function FindAllStoreAPI(query){
    return requestN({
        url:'/code/findallstore',
        method:'get',
        params:query
    })
}

//修改代码库
export async function UpdateStoreAPI(query){
    return requestN({
        url:'/code/updatestore',
        method:'put',
        params:query
    })
}

//查询用户分组
export async function FindAllGroupAPI(query){
    return requestN({
        url:'/group/findall',
        method:'get',
        params:query
    })
}

//增加用户代码库
export async function AddStoreAPI(query){
    return requestN({
        url:'/code/addstore',
        method:'post',
        data:query
    })
}

//修改组名
export async function UpdateGroupNameAPI(query){
    return requestN({
        url:'/group/updateName',
        method:'put',
        params:query
    })
}

//增加分组
export async function AddGroupAPI(query){
    return requestN({
        url:'/group/add',
        method:'post',
        data:query
    })
}

//删除分组
export async function DeleteGroupAPI(query){
    return requestN({
        url:'/group/delete',
        method:'post',
        data:query
    })
}

//查询代码库中的全部代码片段
export async function FindAllSnippetAPI(query){
    return requestN({
        url:'/code/findallsnippet',
        method:'get',
        params:query
    })
}

//增加代码片段

export async function AddCodeSnippetAPI(query){
    return requestN({
        url:'/code/addsnippet',
        method:'post',
        data:query,
    })
}

//上传结果运行图片
export async function AddCodeRunResultAPI(query){
    return requestN({
        url:'/code/addpicture',
        method:'post',
        data:query,
        headers: {
            'Content-Type': 'multipart/form-data', // 必须设置正确的Content-Type头部
            }
    })
}

//删除结果运行图
export async function DeleteCodeRunResultAPI(query){
    return requestN({
        url:'/code/deletepicture',
        method:'put',
        params:query
    })
}

//修改代码片段
export async function UpdateSnippetAPI(query){
    return requestN({
        url:'/code/updatesnippet',
        method:'post',
        data:query
    })
}

//删除代码片段
export async function DeleteSnippetAPI(query){
    return requestN({
        url:'/code/deletesnippet',
        method:'put',
        params:query
    })
}

//删除代码库
export async function DeleteCodeStoreAPI(query){
    return requestN({
        url:'/code/deletestore',
        method:'put',
        params:query
    })
}

//修改代码片段的公有性
export async function UpdateSnippetIsPrivateAPI(query){
    return requestN({
        url:'/code/updateIsPrivate',
        method:'put',
        params:query
    })
}

//代码片段公共搜索功能
export async function SearchByCodeAPI(query){
    return requestN({
        url:'/code/search',
        method:'get',
        params:query
    })
}

//查询单个代码片段
export async function FindBycodeuuidAPI(query){
    return requestN({
        url:'/code/findbycodeuuid',
        method:'get',
        params:query
    })
}

//新增加收藏的代码片段
export async function CollectCodeSnippetAPI(query){
    return requestN({
        url:'/collect/addcodesnippet',
        method:'post',
        data:query
    })
}

//根据标题和标签搜索代码库中的代码片段
export async function FindSnippetByTitleAPI(query){
    return requestN({
        url:'/code/findsnippetByTitle',
        method:'get',
        params:query
    })
}

//新增加收藏夹
export async function CollectAddAPI(query){
    return requestN({
        url:'/collect/addcollect',
        method:'post',
        data:query
    })
}


//查询收藏关系的功能
export async function FindCollectByUserAPI(query){
    return requestN({
        url:'/collect/find',
        method:'get',
        params:query
    })
}

//查询收藏关系中收藏夹得代码片段集
export async function FindCollectCodeSnippet(query){
    return requestN({
        url:'/collect/findcodeSnippet',
        method:'get',
        params:query
    })
}
//取消收藏
export async function CancelCollectAPI(query){
    return requestN({
        url:'/collect/cancel',
        method:'put',
        params:query
    })
}

//编辑收藏
export async function UpdateNameAndDescAPI(query){
    return requestN({
        url:'/collect/updatename',
        method:'post',
        data:query
    })
}

//删除收藏
export async function DeleteCollectAPI(query){
    return requestN({
        url:'/collect/delete',
        method:'put',
        params:query
    })
}

//增加点赞
export async function LikeCodeAPI(query){
    return requestN({
        url:'/like/addlike',
        method:'post',
        data:query
    })
}

//取消点赞
export async function CancelLikeAPI(query){
    return requestN({
        url:'/like/cancel',
        method:'post',
        data:query
    })
}

//查询用户的点赞
export async function FindAllLikeAPI(query){
    return requestN({
        url:'/like/findallbyuser',
        method:'get',
        params:query
    })
}

//增加反馈
export async function TipOffAddAPI(query){
    return requestN({
        url:'/tipoff/add',
        method:'post',
        data:query
    })
}

//#endregion


//#region 图库管理

//增加图库
export async function AddStorePictureAPI(query){
    return requestN({
        url:'/picture/addstore',
        method:'post',
        data:query
    })
}

//查询全部图库
export async function FindAllStorePictureAPI(query){
    return requestN({
        url:'/picture/findallstore',
        method:'get',
        params:query
    })
}

//新增加图片
export async function UploadFileAPI(query){
    return requestN({
        url:'/picture/add',
        method:'post',
        data:query,
        headers: {
            'Content-Type': 'multipart/form-data', // 必须设置正确的Content-Type头部
          },
    })
}

//查询图库中的全部图片
export async function FindAllPictureAPI(query){
    return requestN({
        url:'/picture/findall',
        method:'get',
        params:query
    })
}

//修改图库
export async function UpdateStorePictureAPI(query){
    return requestN({
        url:'/picture/updatestore',
        method:'put',
        params:query
    })
}

//删除图库
export async function DeleteStorePictureAPI(query){
    return requestN({
        url:'/picture/deletestore',
        method:'put',
        params:query
    })
}

//删除图片
export async function DeletePictureAPI(query){
    return requestN({
        url:'/picture/delete',
        method:'put',
        params:query
    })
}

//移动图片
export async function MovePicture(query){
    return requestN({
        url:'/picture/movepicture',
        method:'put',
        params:query
    })
}

//查询图片的全部数量
export async function FindPictureCountAPI(query){
    return requestN({
        url:'/picture/findpicturecount',
        method:'get',
        params:query
    })
}

//下载图片
export async function DownPictureAPI(picture){
    return requestN({
        url:picture,
        method:'get',
        responseType:'blob'
    })
}
//#endregion


//#region 书库管理

//上传书籍
export async function AddBookAPI(query){
    return requestN({
        url:'/book/add',
        method:'post',
        data:query,
        headers: {
            'Content-Type': 'multipart/form-data', // 必须设置正确的Content-Type头部
        },
    })
}

//修改书籍信息
export async function UpdateBookAPI(query){
    return requestN({
        url:'/book/update',
        method:'post',
        data:query,
    })
}

//查询用户的全部书籍
export async function FindAllBookAPI(query){
    return requestN({
        url:'/book/find',
        method:'get',
        params:query
    })
}

//根据id查询具体书籍
export async function FindBookByIdAPI(query){
    return requestN({
        url:'/book/findbyid',
        method:'get',
        params:query
    })
}

//删除书籍
export async function DeleteBookAPI(query){
    return requestN({
        url:'/book/delete',
        method:'put',
        params:query
    })
}

//修改封面
export async function UpdateBookImgAPI(query){
    return requestN({
        url:'/book/updateimg',
        method:'post',
        data:query
    })
}

//根据标签搜索
export async function SearchByTagAPI(query){
    return requestN({
        url:'/book/searchbytag',
        method:'get',
        params:query
    })
}

//根据标签和书名搜索
export async function SearchByTagAndNameAPI(query){
    return requestN({
        url:'/book/searchbytn',
        method:'get',
        params:query
    })
}

//修改阅读次数
export async function UpdateRead(query){
    return requestN({
        url:'/book/updateread',
        method:'put',
        params:query
    })
}

//搜索书籍的公共资源
export async function SearchPublicBookAPI(query){
    return requestN({
        url:'/book/searchpublic',
        method:'get',
        params:query
    })
}

//保存公共资源中的书籍
export async function  SaveCollectBookAPI(query){
    return requestN({
        url:'/book/collect',
        method:'post',
        data:query
    })
}

//反馈公共书籍的资源
export async function TipOffAddBookAPI(query){
    return requestN({
        url:'/tipoff/addbook',
        method:'post',
        data:query
    })
}

//#endregion


//#region 笔记功能

//查询用户笔记本
export async function FindAllNoteBookAPI(query){
    return requestN({
        url:'/notebook/findall',
        method:'get',
        params:query
    })
}


//新增加笔记本
export async function AddNoteBookAPI(query){
    return requestN({
        url:'/notebook/add',
        method:'post',
        data:query
    })
}

//修改笔记本
export async function UpdateNoteBookAPI(query){
    return requestN({
        url:'/notebook/update',
        method:'put',
        params:query
    })
}

//删除笔记本
export async function DeleteNoteBookAPI(query){
    return requestN({
        url:'/notebook/delete',
        method:'put',
        params:query
    })
}

//获取笔记
export async function FindAllNoteAPI(query){
    return requestN({
        url:'/note/findall',
        method:'get',
        params:query
    })
}

//增加笔记
export async function AddNoteAPI(query){
    return requestN({
        url:'/note/add',
        method:'post',
        data:query
    })
}

//根据id查询单个笔记
export async function FindNoteByIdAPI(query){
    return requestN({
        url:'/note/findbyid',
        method:'get',
        params:query
    })
}

//修改笔记信息
export async function UpdateNoteAPI(query){
    return requestN({
        url:'/note/update',
        method:'post',
        data:query
    })
}

//根据笔记本来搜索
export async function FindNoteByNoetBookAPI(query){
    return requestN({
        url:'/note/searchbynotebook',
        method:'get',
        params:query
    })
}

//根据标签搜索笔记
export async function FindNoteByNoteTagAPI(query){
    return requestN({
        url:'/note/searchbytag',
        method:'get',
        params:query
    })
}

//查询用户笔记标签
export async function FindNoteTagAPI(query){
    return requestN({
        url:'/note/tag',
        method:'get',
        params:query
    })
}

//查询用户的创建时间
export async function FindNoteYearAPI(query){
    return requestN({
        url:'/note/year',
        method:'get',
        params:query
    })
}

//根据年份去查询用户笔记
export async function FindByNoteYearAPI(query){
    return requestN({
        url:'/note/searchbyyear',
        method:'get',
        params:query
    })
}

//搜索笔记
export async function FindNoteByName(query){
    return requestN({
        url:'/note/searchname',
        method:'get',
        params:query
    })
}

//搜索公共区域资源的笔记
export async function SearchPublicNoteAPI(query){
    return requestN({
        url:'/note/searchpublic',
        method:'get',
        params:query
    })
}

//笔记点赞功能
export async function AddLikeNoteAPI(query){
    return requestN({
        url:'/like/addlikenote',
        method:'post',
        data:query
    })
}

//笔记取消点赞
export async function CancelLikeNoteAPI(query){
    return requestN({
        url:'/like/cancelnote',
        method:'post',
        data:query
    })
}

//新增加收藏的代码片段
export async function CollectNoteAPI(query){
    return requestN({
        url:'/collectnote/addnote',
        method:'post',
        data:query
    })
}


//新增加收藏夹
export async function CollectNoteAddAPI(query){
    return requestN({
        url:'/collectnote/addcollect',
        method:'post',
        data:query
    })
}


//查询收藏关系的功能
export async function FindCollectNoteByUserAPI(query){
    return requestN({
        url:'/collectnote/find',
        method:'get',
        params:query
    })
}

//查询收藏关系中收藏夹得代码片段集
export async function FindCollectNote(query){
    return requestN({
        url:'/collectnote/findnote',
        method:'get',
        params:query
    })
}
//取消收藏
export async function CancelCollectNoteAPI(query){
    return requestN({
        url:'/collectnote/cancel',
        method:'put',
        params:query
    })
}

//编辑收藏
export async function UpdateNameAndDescNoteAPI(query){
    return requestN({
        url:'/collectnote/updatename',
        method:'post',
        data:query
    })
}

//删除收藏
export async function DeleteCollectNoteAPI(query){
    return requestN({
        url:'/collectnote/delete',
        method:'put',
        params:query
    })
}

export async function TipOffNoteAPI(query){
    return requestN({
        url:'/tipoff/addnote',
        method:'post',
        data:query
    })
}

//创建笔记的时间轴
export async function FindUpdateTimeAPI(query){
    return requestN({
        url:'/note/findupdatetime',
        method:'get',
        params:query
    })
}

//增加打开笔记次数
export async function UpdateOpenAPI(query){
    return requestN({
        url:'/note/updateopen',
        method:'put',
        params:query
    })
}

//查询常用前十的笔记
export async function FindByOpenAPI(query){
    return requestN({
        url:'/note/findbyopen',
        method:'get',
        params:query
    })
}

//删除笔记
export async function DeleteNoteAPI(query){
    return requestN({
        url:'/note/delete',
        method:'put',
        params:query
    })
}

//#endregion
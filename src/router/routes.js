import Home from '../view/Back/Home.vue'
import LoginUserBack from '../view/Back/LoginUserBack.vue'
import UserWork from '../components/Back/Home/UserWork.vue'
import UserManage from '../components/Back/Home/UserManage.vue'
import UserAnalyst from '../components/Back/Home/UserAnalyst.vue'
import ManagerCenter from '../components/Back/Home/ManagerCenter.vue'
import CodeCheck from '../components/Back/Home/CodeCheck.vue'
import BookCheck from '../components/Back/Home/BookCheck.vue'
import NoteCheck from '../components/Back/Home/NoteCheck.vue'
import PersonalSetting from '../components/Back/Home/PersonalSetting.vue'
import BasicFrom from '../components/Back/PersonalSettingFrom/BasicFrom.vue'
import SafetyFrom from '../components/Back/PersonalSettingFrom/SafetyFrom.vue'
import UpdatePassword from '../components/Back/PersonalSettingFrom/UpdatePassword.vue'
import UpdatePhone from '../components/Back/PersonalSettingFrom/UpdatePhone.vue'
import UpdateEmail from '../components/Back/PersonalSettingFrom/UpdateEmail.vue'
import ForgetPasswordBig from '../view/Back/ForgetPasswordBig.vue'
import {ManagerCurrent} from '../api/backApi.js'
import {useCountStore} from '../stores/count.js'

import LoginUser from '../view/Client/LoginUser.vue'
import RegisterUser from '../view/Client/RegisterUser.vue'
import HomeClient from '../view/Client/HomeClient.vue'
import ForgetPassword from '../view/Client/ForgetPassword.vue'
import MyHome from '../components/Client/Home/MyHome.vue'
import MemoManager from '../components/Client/Home/MemoManager.vue'
import CodeManager1 from '../components/Client/Home/CodeManager1.vue'
import CodeShow from '../components/Client/CodeManager/CodeShow.vue'
import CodeCollect from '../components/Client/CodeManager/CodeCollect.vue'
import CodeStoreShow from '../components/Client/CodeManager/CodeStoreShow.vue'
import CollectShow from '../components/Client/CodeManager/CollectShow.vue'
import MyAceEditor from '../components/Client/MyAceEditor.vue'
import PictureManager from '../components/Client/Home/PictureManager.vue'
import PictureShow from '../components/Client/PictureManager/PictureShow.vue'
import TestCountDown from '../components/TestCountDown.vue'
import SearchPublic from '../components/Client/Search/SearchPublic.vue'
import SearchResult from '../components/Client/Search/SearchResult.vue'
import SearchPublicBook from '../components/Client/Search/SearchPublicBook.vue'
import SearchResultBook from '../components/Client/Search/SearchResultBook.vue'
import SearchPublicNote from '../components/Client/Search/SearchPublicNote.vue'
import SearchResultNote from '../components/Client/Search/SearchResultNote.vue'
import BookManager from '../components/Client/Home/BookManager.vue'
import BookItem from '../components/Client/BookManager/BookItem.vue'
import BookLook from '../components/Client/BookManager/BookLook.vue'
import NoteManager from '../components/Client/Home/NoteManager.vue'
import NoteShow from '../components/Client/NoteManager/NoteShow.vue'
import NoteBookShow from '../components/Client/NoteManager/NoteBookShow.vue'
import NoteEditor from '../components/Client/NoteManager/NoteEditor.vue'
import NoteRead from '../components/Client/NoteManager/NoteRead.vue'
import NoteCollect from '../components/Client/NoteManager/NoteCollect.vue'
import NoteCollectShow from '../components/Client/NoteManager/CollectNoteShow.vue'
import NoteBookItemShow from '../components/Client/NoteManager/NoteBookItemShow.vue'
import NoteUpdateTime from '../components/Client/NoteManager/NoteUpdateTime.vue'
import MessageCenter from '../components/Client/UserPersonal/MessageCenter.vue'
import PersonalCenter from '../components/Client/UserPersonal/PersonalCenter.vue'
import MySearch from '../components/Client/Search/MySearch.vue'
import { FindAllNoteBookAPI,AddNoteBookAPI,UserCurrentAPI } from '../api/clientApi'
import {useclientStore} from '../stores/count.js'


export default [
    {
        path:'/client',
        children:[
            {
                path:'login',
                component:LoginUser
            },
            {
                path:'register',
                component:RegisterUser
            },
            {
                path:'forgetpassword',
                component:ForgetPassword
            },
            {
                path:'booklook/:_id',
                name:'booklook',
                props:true,
                component:BookLook
            },
            {
                path:'home',
                component:HomeClient,
                beforeEnter:(to,from,next)=>{
                    const counter =useclientStore()
                    const token=localStorage.getItem('tokenuser')
                    UserCurrentAPI({},token).then((res)=>{
                    if(res.code == 0){     
                        counter.clientlogin=res.data   
                        next()
                    }else{
                        next('/client/login')
                    }
                   
                   })
        
                },
                children:[
                    {
                        path:'personalcenter',
                        name:'personalcenter',
                        component:PersonalCenter
                    },
                    {
                        path:'messagecenter',
                        name:'messagecenter',
                        component:MessageCenter
                    },
                    {
                        path:'memo',
                        name:'memo',
                        component:MemoManager
                    },
                    {
                        path:'myhome',
                        name:'myhome',
                        component:MyHome
                    },
                    {
                        path:'book',
                        name:'book',
                        component:BookManager
                    },
                    {
                        path:'bookitem/:_id',
                        name:'bookitem',
                        props:true,
                        component:BookItem
                    },
                    {
                        path:'noteeditor/:_id',
                        props:true,
                        name:'noteeditor',
                        component:NoteEditor
                    },
                    {
                        path:'noteread/:_id',
                        props:true,
                        name:'noteread',
                        component:NoteRead
                    },
                    {
                        path:'note',
                        name:'note',
                        component:NoteManager,
                        beforeEnter:(to,from,next)=>{
                            FindAllNoteBookAPI({userId:'1',isDefault:1}).then(res=>{
                                if(res.code==0){
                                    if(res.data){
                                        next()
                                    }else{
                                        AddNoteBookAPI({userId:'1',notebookName:'默认分组',notebookDescription:'这个默认分组',isDefault:1}).then(res=>{
                                            if(res.code==0){
                                                next()
                                            }
                                        })
                                    }
                                }
                            })
                
                        },
                        children:[
                            {
                                path:'noteshow',
                                name:'noteshow',
                                component:NoteShow
                            },
                            {
                                path:'notebook',
                                name:'notebook',
                                component:NoteBookShow
                            },
                            {
                                path:'notetime',
                                name:'notetime',
                                component:NoteUpdateTime
                            },
                            {
                                path:'notecollect',
                                name:'notecollect',
                                component:NoteCollect
                            },
                            {
                                path:'notecollectshow/:_id/:userId/:collectName',
                                props:true,
                                name:'notecollectshow',
                                component:NoteCollectShow
                            },
                            {
                                path:'notebookitemshow/:_id',
                                props:true,
                                name:'notebookitemshow',
                                component:NoteBookItemShow
                            }
                           
                        ]
                    },
                    {
                        path:'code',
                        name:'code',
                        component:CodeManager1,
                        children:[
                            {
                                path:'codeshow/:_id',
                                name:'codeshow',
                                props: true,
                                component:CodeShow,
                                children:[
                                    {
                                        path:'aceeditor/:_id/:codeuuid',
                                        props:true,
                                        name:'aceeditor',
                                        component:MyAceEditor
                                    }
                                ]
                            },
                            {
                                path:'collectshow/:_id/:userId/:collectName',
                                name:'collectshow',
                                props:true,
                                component:CollectShow
                            },
                            {
                                path:"codecollect",
                                name:'codecollect',
                                component:CodeCollect
                            },
                            {
                                path:'codestoreshow',
                                name:'codestoreshow',
                                component:CodeStoreShow
                            },
                          
                        ]
                    },
                    {
                        path:'picture',
                        name:'picture',
                        component:PictureManager
                    },
                    {
                        path:'pictureshow/:_id',
                        name:'pictureshow',
                        props: true,
                        component:PictureShow
                    },
                    {
                        path:'searchpublic/:searchByCodeValue',
                        name:'searchpublic',
                        props:true,
                        component:SearchPublic
                    },
                    {
                        path:'searchresult/:_id/:codeuuid',
                        name:'searchresult',
                        props:true,
                        component:SearchResult
                    },
                    {
                        path:'searchpublicbook/:inputValue',
                        name:'searchpublicbook',
                        props:true,
                        component:SearchPublicBook
                    },
                    {
                        path:'searchresultbook/:_id/',
                        name:'searchresultbook',
                        props:true,
                        component:SearchResultBook
                    },
                    {
                        path:'searchpublicnote/:inputValue',
                        name:'searchpublicnote',
                        props:true,
                        component:SearchPublicNote
                    },
                    {
                        path:'searchresultnote/:_id/',
                        name:'searchresultnote',
                        props:true,
                        component:SearchResultNote
                    },
                    {
                        path:'mysearch',
                        name:'mysearch',
                        component:MySearch
                    }
                ]
                
            },
            {
                path:'testcount',
                component:TestCountDown
            }
        ]
        
    },
    {
        path:'/back',
        children:[
            {
                path:'login',
                component:LoginUserBack
            },
            {
                path:'forgetpasswordbig',
                component:ForgetPasswordBig
            },
            {
                path:'home',
                component:Home,
                beforeEnter:(to,from,next)=>{
                    const counter =useCountStore()
                    const token=localStorage.getItem('token')
                    ManagerCurrent({},token).then((res)=>{
                    if(res.code == 0){     
                        counter.userlogin=res.data   
                        
                        next()
                    }else{
                        next('/back/login')
                    }
                   
                   })
        
                },
                children:[
                   {
                    path:'userwork',
                    component:UserWork
                   },
                   {
                    path:'usermanage',
                    component:UserManage
                   },
                   {
                    path:'managercenter',
                    name:'managercenter',
                    component:ManagerCenter
                   },
                   {
                    path:'useranalyst',
                    name:'useranalyst',
                    component:UserAnalyst
                   },
                   {
                    path:'personalsetting',
                    component:PersonalSetting,
                    children:[
                        {
                            path:'basicfrom',
                            name:'basicfrom',
                            component:BasicFrom
                        },
                        {
                            path:'safetyfrom',
                            name:'safetyfrom',
                            component:SafetyFrom
                        },
                        {
                            path:'updatepassword',
                            name:'updatepassword',
                            component:UpdatePassword
                        },
                        {
                            path:'updatephone',
                            name:'updatephone',
                            component:UpdatePhone
                        },
                        {
                            path:'updateemail',
                            name:'updateemail',
                            component:UpdateEmail
                        }
                    ]
                   },
                   {
                    path:'codecheck',
                    name:'codecheck',
                    component:CodeCheck
                   },
                   {
                    path:'bookcheck',
                    name:'bookcheck',
                    component:BookCheck
                   },
                   {
                    path:'notecheck',
                    name:'notecheck',
                    component:NoteCheck
                   }
                ]
            },
        ]
    }
    
]

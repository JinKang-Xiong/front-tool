<template>
    <div class="book-check">
        <a-row style="background-color: white; height: 100px; width:96%;margin: 0px auto;">
            <a-col :span="8" style="text-align: center;padding-top: 15px;">
                <a-statistic title="待办任务" :value="dispose0" />
            </a-col>
            <a-col :span="8" style="text-align: center; padding-top: 15px;">
                <a-statistic title="监控期任务" :value="dispose1" />
            </a-col>
            <a-col :span="8" style="text-align: center; padding-top: 15px;">
                <a-statistic title="已完成任务" :value="dispose2" />
            </a-col>
        </a-row>
        <a-row
            style="background-color: white; height: 50px;line-height: 50px; width:96%;margin: 0px auto; margin-top: 30px;">
            <a-col :span="4">
                <span style="font-size: 18px;">任务列表</span>
            </a-col>
            <a-col :span="5" offset="15" style="text-align: center;">
                <a-button type="" @click="findnew">进行中</a-button>
                <a-button type="" @click="findMonitor">监控中</a-button>
                <a-button type="" @click="findsuccess">已完成</a-button>
            </a-col>
            <!-- <a-col :span="5">
                <a-input-search v-model:value="value" placeholder="input search text" style="width: 246px;margin-top: 9px;"
                    @search="onSearch" />
            </a-col> -->
        </a-row>
        <div class="book-list">
            <a-list class="demo-loadmore-list" :pagination="pagination" item-layout="horizontal" :data-source="bookList">
                <template #renderItem="{ item }">
                    <a-list-item>
                        <template #actions>
                            <a-space>
                                <a-button v-if="showtipoff == 0" type=""
                                    @click="showModelTipoff(item.tipoff.tipoffContent)">反馈详情</a-button>
                                <a-button v-if="showtipoff == 1" type=""
                                    @click="showbigManagerIdea(item.tipoff)">审核详情</a-button>
                                <a-button type="" @click="showModelResource(item.book._id,)">资源详情</a-button>
                                <a-button v-if="item.tipoff.resourceStatus == 1 || item.tipoff.isDisPose == 0"
                                    type="primary" @click="successTipOff(
                                        item.tipoff._id, item.tipoff.moduleType, item.book._id,
                                        item.book.monitorNumber, item.tipoff.tipoffContent, item.book.userId, item.book.bookName
                                    )">通过</a-button>
                                <a-button v-if="item.tipoff.resourceStatus == 1 || item.tipoff.isDisPose == 0"
                                    type="primary" danger @click="errorTipOff(
                                        item.tipoff._id, item.tipoff.moduleType, item.book._id,
                                        item.book.monitorNumber,
                                        item.tipoff.tipoffContent, item.book.userId, item.book.bookName
                                    )">封禁</a-button>
                            </a-space>

                        </template>
                        <a-list-item-meta :description="item.book.bookDescription">
                            <template #title>
                                <a>{{ item.book.bookName }}</a>
                            </template>
                        </a-list-item-meta>
                        <div>
                            <a-space :size="40">
                                <div v-if="showtipoff == 0">
                                    <span> <a-typography-text type="secondary">反馈人数</a-typography-text></span><br>
                                    <span style="padding-left: 25px;"> <a-typography-text type="secondary">{{
                                        item.tipoff.tipoffContent.length }}</a-typography-text></span>
                                </div>
                                <a-row v-if="showtipoff == 1 || showtipoff == 2">
                                    <a-col :span="24">
                                        <a-badge v-if="item.tipoff.resourceStatus == 0" status="processing"
                                            text="未公开"></a-badge>
                                        <a-badge v-if="item.tipoff.resourceStatus == 1" status="error" text="进行中"></a-badge>
                                        <a-badge v-if="item.tipoff.resourceStatus == 2" status="success"
                                            text="已完成"></a-badge>
                                    </a-col>
                                </a-row>
                                <div>
                                    <span> <a-typography-text type="secondary">开始时间</a-typography-text></span><br>
                                    <span> <a-typography-text type="secondary">2023-08-22</a-typography-text></span>
                                </div>
                            </a-space>

                        </div>

                    </a-list-item>
                </template>
            </a-list>
            <a-modal v-model:visible="visibletipoff" :footer="null" title="反馈详情" @ok="handleOkOffTip">
                <div class="tipoffinfo-content">
                    <a-list item-layout="vertical" :data-source="tipoffContentList">
                        <template #renderItem="{ item }">
                            <a-list-item>
                                <a-list-item-meta>
                                    <template #avatar>
                                        <a-avatar>{{ item.userAvatarUrl }}</a-avatar>
                                    </template>
                                    <template #title>
                                        <span>{{ item.username }}</span>
                                    </template>
                                </a-list-item-meta>
                                <div>
                                    <p><span style="font-weight: 600;">反馈类型：</span>{{ item.type }}</p>
                                    <p><span style="font-weight: 600;">反馈内容：</span> {{ item.content }}</p>
                                </div>
                            </a-list-item>
                        </template>
                    </a-list>
                </div>
            </a-modal>
            <a-modal v-model:visible="visibleresource" :footer="null" style="top: 20px" width="1000px" title="资源详情"
                @ok="handleOkResource">
                <div class="resourcebook-content">
                    <a-col :span="5">
                        <a-image :width="150" :src="initData.bookImg" />
                        <div style="margin-top: 15px;">
                            <p style="font-weight: 600; margin-bottom: 5px;">标签</p>
                            <a-tag color="#2db7f5" v-for="item in initData.bookTag">{{ item }}</a-tag>
                        </div>
                    </a-col>
                    <a-col :span="18">
                        <a-row>
                            <a-col :span="18">
                                <a-typography-title :level="3">{{ initData.bookName }}</a-typography-title>
                            </a-col>
                            <a-col :span="6">
                                <a-space>
                                    <!-- <a-button type="" @click="collectBook">保存书籍</a-button> -->
                                    <a-button type="primary" shape="round" @click="RouterBookLook">开始阅读</a-button>
                                </a-space>
                            </a-col>
                        </a-row>
                        <a-typography-text type="secondary">{{ initData.isPrivate == 0 ? '私有' : '公有' }}</a-typography-text>
                        <div style="margin-top: 10px; margin-bottom: 20px;">
                            <a-typography-text>{{ initData.bookDescription }}</a-typography-text>
                        </div>
                        <a-typography-title :level="4" v-if="initData.shareViewPoint">分享寄语 <MyIcon type="icon-weixiao">
                            </MyIcon>
                        </a-typography-title>
                        <div style="margin: 10px 0px;">
                            <a-typography-text>{{ initData.shareViewPoint }}</a-typography-text>
                        </div>
                    </a-col>
                </div>
            </a-modal>
            <a-modal v-model:visible="visibleshowBigManagerMessage" title="封禁意见" :footer="null">
                <a-list item-layout="vertical">
                    <a-list-item>
                        <a-list-item-meta>
                            <template #title>
                                管理员账号：{{ bigManagerState.bigManagerAccount }}
                            </template>
                        </a-list-item-meta>
                        <p>管理员审核意见：{{ bigManagerState.bigManagerMessage }}</p>
                    </a-list-item>
                </a-list>
            </a-modal>
            <a-modal v-model:visible="visiblebigManagerMessage" title="审核" okText="确定" cancelText="取消"
                @ok="handleOkBigManager">
                <a-form>
                    <a-form-item label="审核意见">
                        <a-textarea v-model:value="bigManagerMessage" :autosize="{ minRows: 3, maxRows: 6 }" show-count
                            :maxlength="100"></a-textarea>
                    </a-form-item>
                </a-form>
            </a-modal>
        </div>
    </div>
</template>


<script setup>
import { ref, onMounted, reactive, computed, watch } from 'vue';
import { FindAllTipOffAPI, sendTipOffAPI, CountisDisPoseAPI, UpdateTipOff, FindTipOffByIdAPI, FindUserByIdAPI } from '../../../api/backApi.js'
import { FindBookByIdAPI } from '../../../api/clientApi.js'
import { useCountStore } from '../../../stores/count.js';
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import Prism from 'prismjs'
const router = useRouter()
const visibletipoff = ref(false)
const visibleresource = ref(false)
const counter = useCountStore()
onMounted(() => {
    Prism.highlightAll()
    fetchCodeTipOff({ moduleType: '书籍管理', isDisPose: 0, PageSize: pageSize.value, PageNumber: pageNumber.value })
    fetchCountDispose('书籍管理')
})
const showtipoff = ref(0)
const findMonitor = () => {
    fetchCodeTipOff({ moduleType: '书籍管理', isDisPose: 1, PageSize: pageSize.value, PageNumber: pageNumber.value })
    showtipoff.value = 1
}
const findnew = () => {
    showtipoff.value = 0
    fetchCodeTipOff({ moduleType: '书籍管理', isDisPose: 0, PageSize: pageSize.value, PageNumber: pageNumber.value })

}
const findsuccess = () => {
    showtipoff.value = 2
    fetchCodeTipOff({ moduleType: '书籍管理', isDisPose: 2, PageSize: pageSize.value, PageNumber: pageNumber.value })

}
const bookList = ref([])
const pageSize = ref(5)
const pageNumber = ref(1)
const total = ref(0)
const fetchCodeTipOff = (query) => {
    FindAllTipOffAPI(query).then(res => {
        if (res.code == 0) {
            res.data.dataarr.forEach(element => {
                let date = new Date(element.tipoff.createTime)
                element.tipoff.createTime = date.getFullYear() + '-' + (date.getMonth + 1) + '-' + date.getDate()
            });
            bookList.value = [...res.data.dataarr]
            pagination.total = res.data.total
        }
    })
}
const pagination = reactive({
    onChange: page => {
        console.log(page);
    },
    pageSize: pageSize.value,
    total: total.value
});

const tipoffContentList = ref([])
const showModelTipoff = (tipoffContent) => {
    tipoffContentList.value = [...tipoffContent]
    visibletipoff.value = true
}

const showModelResource = (_id) => {
    visibleresource.value = true
    fecthinit({ userId: 'public', _id })
}

const visibleshowBigManagerMessage = ref(false)
const bigManagerState = reactive({
    bigManagerId: '',
    bigManagerAccount: '',
    bigManagerMessage: ''
})
const showbigManagerIdea = (tipoff) => {
    visibleshowBigManagerMessage.value = true
    bigManagerState.bigManagerId = tipoff.bigManagerId
    bigManagerState.bigManagerAccount = tipoff.bigManagerAccount
    bigManagerState.bigManagerMessage = tipoff.bigManagerMessage
}

//#region 资源详情
const initData = ref({})

const RouterBookLook = () => {
    router.push({ name: 'booklook', params: { _id: initData.value._id } })
}
const fecthinit = (query) => {
    FindBookByIdAPI(query).then(res => {
        if (res.code == 0) {
            initData.value = { ...res.data }
        }
    })
}
//#endregion

//#region 审核操作
const bigManagerMessage = ref()
const visiblebigManagerMessage = ref(false)
const updateTipOff = reactive({
    _id: '',
    moduleType: '',
    typeId: '',
    monitorNumber1: null,
    userIdList: [],
    resourceId: '',
    resourcename: '',
    disPostStatus: null
})
const successTipOff = (
    _id, moduleType, typeId,
    monitorNumber1, tipoffContent, resourceId, resourcename
) => {
    visiblebigManagerMessage.value = true
    let userIdList = []
    tipoffContent.forEach(item => {
        userIdList.push(item.userId)
    })
    updateTipOff.userIdList = [...userIdList]
    updateTipOff._id = _id
    updateTipOff.moduleType = moduleType
    updateTipOff.typeId = typeId
    updateTipOff.monitorNumber1 = monitorNumber1
    updateTipOff.resourceId = resourceId
    updateTipOff.resourcename = resourcename
    updateTipOff.disPostStatus = 1
}
const errorTipOff = (
    _id, moduleType, typeId,
    monitorNumber1, tipoffContent,
    resourceId, resourcename
) => {
    visiblebigManagerMessage.value = true
    let userIdList = []
    tipoffContent.forEach(item => {
        userIdList.push(item.userId)
    })
    updateTipOff.userIdList = [...userIdList]
    updateTipOff._id = _id
    updateTipOff.moduleType = moduleType
    updateTipOff.typeId = typeId
    updateTipOff.monitorNumber1 = monitorNumber1
    updateTipOff.resourceId = resourceId
    updateTipOff.resourcename = resourcename
    updateTipOff.disPostStatus = 2
}

const handleOkBigManager = () => {
    UpdateTipOff({
        _id: updateTipOff._id,
        moduleType: updateTipOff.moduleType,
        typeId: updateTipOff.typeId,
        disPostStatus: updateTipOff.disPostStatus,
        monitorNumber1: updateTipOff.monitorNumber1,
        bigManagerId: counter.userlogin.id,
        bigManagerAccount: counter.userlogin.bigManagerAccount,
        bigManagerMessage: bigManagerMessage.value,
        userList: updateTipOff.userIdList,
        resourceId: updateTipOff.resourceId,
        resourcename: updateTipOff.resourcename,
        messageFirst: showtipoff.value
    }).then(res => {
        if (res.code == 0) {
            message.success('审核成功')
            bigManagerMessage.value = ''
            visiblebigManagerMessage.value = false
            fetchCountDispose('书籍管理')
            if (showtipoff.value == 1) {
                fetchCodeTipOff({ moduleType: '书籍管理', isDisPose: 1, PageSize: pageSize.value, PageNumber: pageNumber.value })
            } else {
                fetchCodeTipOff({ moduleType: '书籍管理', isDisPose: 0, PageSize: pageSize.value, PageNumber: pageNumber.value })
            }
        }
    })
    if (updateTipOff.disPostStatus == 2) {
        sendTipOffAPI({ id: updateTipOff.resourceId, name: updateTipOff.resourcename, isErr: false }).then(res => {
            if (res.code == 0) {
                message.success('发送成功')
            }
        })
    } else if (updateTipOff.disPostStatus == 1) {
        sendTipOffAPI({ id: updateTipOff.resourceId, name: updateTipOff.resourcename, isErr: true }).then(res => {
            if (res.code == 0) {
                message.success('发送成功')
            }
        })
    }
}
//#endregion

//#region 统计操作
const dispose0 = ref(0)
const dispose1 = ref(0)
const dispose2 = ref(0)
const fetchCountDispose = (moduleType) => {
    CountisDisPoseAPI({ moduleType }).then(res => {
        if (res.code == 0) {
            dispose0.value = res.data.DisPose0
            dispose1.value = res.data.DisPose1
            dispose2.value = res.data.DisPose2
        }
    })
}


//#endregion


</script>

<style>
.tipoffinfo-content {
    height: 400px;
    overflow: auto;
}

.resourcebook-content {
    height: 550px;
    overflow-y: auto;
    display: flex;
}

.book-check {
    background-color: rgb(240, 242, 245);
    margin: -24px -40px;
    padding-top: 10px;
}

.book-list {
    width: 96%;
    margin: 5px auto;
    padding-left: 5px;
    background-color: white;
}

.tipoffinfo-content::-webkit-scrollbar {
    width: 8px;
    /* 纵向滚动条宽度 */
    height: 8px;
    /* 横向滚动条高度 */
    background-color: white;
    /* 滚动条整体背景，一般被覆盖着 */
}

/* 滚动条里面的滑块 */
.tipoffinfo-content::-webkit-scrollbar-thumb {
    border-radius: 10px;
    /* 滚动条滑块阴影 */
    background-color: rgba(216, 218, 217);
    /* 滚动条滑块颜色 */
}

/* 滚动条的轨道（里面装有Thumb） */
.tipoffinfo-content::-webkit-scrollbar-track {
    /* -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3); */
    /* 滚动条轨道阴影 */
    border-radius: 10px;
    /* 滚动条轨道圆角 */
    background-color: white;
    /* 滚动条轨道背景 */
}

.resource-content::-webkit-scrollbar {
    width: 8px;
    /* 纵向滚动条宽度 */
    height: 8px;
    /* 横向滚动条高度 */
    background-color: white;
    /* 滚动条整体背景，一般被覆盖着 */
}

/* 滚动条里面的滑块 */
.resource-content::-webkit-scrollbar-thumb {
    border-radius: 10px;
    /* 滚动条滑块阴影 */
    background-color: rgba(216, 218, 217);
    /* 滚动条滑块颜色 */
}

/* 滚动条的轨道（里面装有Thumb） */
.resource-content::-webkit-scrollbar-track {
    /* -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3); */
    /* 滚动条轨道阴影 */
    border-radius: 10px;
    /* 滚动条轨道圆角 */
    background-color: white;
    /* 滚动条轨道背景 */
}
</style>
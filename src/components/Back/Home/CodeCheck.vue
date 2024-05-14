<template>
    <div class="code-check">
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
        <div class="code-list">
            <a-list class="demo-loadmore-list" :pagination="pagination" item-layout="horizontal" :data-source="codeList">
                <template #renderItem="{ item }">
                    <a-list-item>
                        <template #actions>
                            <a-space>
                                <a-button v-if="showtipoff == 0" type=""
                                    @click="showModelTipoff(item.tipoff.tipoffContent)">反馈详情</a-button>
                                <a-button v-if="showtipoff == 1" type=""
                                    @click="showbigManagerIdea(item.tipoff)">审核详情</a-button>
                                <a-button type=""
                                    @click="showModelResource(item.code._id, item.code.codeList.codeuuid)">资源详情</a-button>
                                <a-button v-if="item.tipoff.resourceStatus == 1 || item.tipoff.isDisPose == 0"
                                    type="primary" @click="successTipOff(
                                        item.tipoff._id, item.tipoff.moduleType, item.code._id,
                                        item.code.codeList.monitorNumber, item.code.codeList.codeuuid,
                                        item.tipoff.tipoffContent, item.code.userId, item.code.codeList.codeTitle
                                    )">通过</a-button>
                                <a-button v-if="item.tipoff.resourceStatus == 1 || item.tipoff.isDisPose == 0"
                                    type="primary" danger @click="errorTipOff(
                                        item.tipoff._id, item.tipoff.moduleType, item.code._id,
                                        item.code.codeList.monitorNumber, item.code.codeList.codeuuid,
                                        item.tipoff.tipoffContent, item.code.userId, item.code.codeList.codeTitle

                                    )">封禁</a-button>
                            </a-space>

                        </template>
                        <a-list-item-meta :description="item.code.codeList.codeDescription">
                            <template #title>
                                <a>{{ item.code.codeList.codeTitle }}</a>
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
                                        <a-badge v-if="item.tipoff.resourceStatus == 0" status="process"
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
                <div class="resource-content">
                    <a-row>
                        <span style="font-weight: 600; font-size: 25px;">代码标题：</span>
                        <a-col :span="20" style="font-weight: 600; font-size: 25px;">
                            {{ codeData === undefined ? '' : codeData.codeList.codeTitle }}
                        </a-col>
                    </a-row>
                    <a-row style="margin-top: 20px;">
                        <a-space>
                            <span style="font-weight: 600;">代码标签：</span>
                            <a-tag v-for="(item, index) in codeTag" color="blue">
                                {{ item }}
                            </a-tag>
                        </a-space>
                    </a-row>
                    <a-row style="margin-top: 20px;">
                        <a-col :span="4" style="font-weight: 600;">代码片段:</a-col>
                    </a-row>
                    <div class="code-language-content">
                        <pre :class="languageClass"><code :class="languageClass" v-html="highlightedCode"></code>
                                        </pre>
                    </div>
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
import { FindBycodeuuidAPI } from '../../../api/clientApi.js'
import { useCountStore } from '../../../stores/count.js';
import { message } from 'ant-design-vue'
import Prism from 'prismjs'
const visibletipoff = ref(false)
const visibleresource = ref(false)
const counter = useCountStore()
onMounted(() => {
    Prism.highlightAll()
    fetchCodeTipOff({ moduleType: '代码片段管理', isDisPose: 0, PageSize: pageSize.value, PageNumber: pageNumber.value })
    fetchCountDispose('代码片段管理')
})
const showtipoff = ref(0)
const findMonitor = () => {
    fetchCodeTipOff({ moduleType: '代码片段管理', isDisPose: 1, PageSize: pageSize.value, PageNumber: pageNumber.value })
    showtipoff.value = 1
}
const findnew = () => {
    showtipoff.value = 0
    fetchCodeTipOff({ moduleType: '代码片段管理', isDisPose: 0, PageSize: pageSize.value, PageNumber: pageNumber.value })

}
const findsuccess = () => {
    showtipoff.value = 2
    fetchCodeTipOff({ moduleType: '代码片段管理', isDisPose: 2, PageSize: pageSize.value, PageNumber: pageNumber.value })

}
const codeList = ref([])
const pageSize = ref(5)
const pageNumber = ref(1)
const total = ref(0)
const total1 = ref(0)
const fetchCodeTipOff = (query) => {
    FindAllTipOffAPI(query).then(res => {
        if (res.code == 0) {
            res.data.dataarr.forEach(element => {
                let date = new Date(element.tipoff.createTime)
                element.tipoff.createTime = date.getFullYear() + '-' + (date.getMonth + 1) + '-' + date.getDate()
            });
            codeList.value = [...res.data.dataarr]
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

const showModelResource = (_id, codeuuid) => {
    visibleresource.value = true
    feth({ _id, codeuuid })
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
const codeData = ref()
const codeSnipppet = ref()
const codeLanguageValue = ref()
const codeTag = ref()
const feth = (query) => {
    FindBycodeuuidAPI(query).then(res => {
        if (res.code == 0) {
            let data = new Date(res.data[0].codeList.codeCreateTime)
            res.data[0].codeList.codeCreateTime = data.getFullYear() + '-' + (data.getMonth() + 1) + '-' + data.getDate()
            codeData.value = res.data[0]
            codeSnipppet.value = res.data[0].codeList.codeSnippet
            codeTag.value = res.data[0].codeList.codeTag
            codeLanguageValue.value = res.data[0].codeList.codeLanguage
        }
    })
}

const languageClass = computed(() => {
    return `language-${codeLanguageValue.value}`;
})
const highlightedCode = computed(() => {
    // 在这里使用 Prism.js 的 highlight 函数来对代码进行语法高亮
    // 注意，这里需要引入 Prism.js 库，并根据需要引入相应的语言扩展
    if (codeSnipppet.value && codeLanguageValue.value) {
        // 只有在 codeSnipppet 和 codeLanguageValue 都有值时才调用 Prism.highlight 函数
        return Prism.highlight(codeSnipppet.value, Prism.languages[codeLanguageValue.value], codeLanguageValue.value);
    } else {
        // 当数据尚未加载完成时，可以返回一个默认值，或者返回一个加载中的提示
        return "Loading..."; // 或者其他默认值
    }
})

// watch(() => [prop._id, prop.codeuuid], (newValue, oldValue) => {
//     console.log(`language${newValue}`);
//     feth({ _id: newValue[0], codeuuid: newValue[1] })
// })

//#endregion

//#region 审核操作
const bigManagerMessage = ref()
const visiblebigManagerMessage = ref(false)
const updateTipOff = reactive({
    _id: '',
    moduleType: '',
    typeId: '',
    monitorNumber1: null,
    codeuuid: '',
    userIdList: [],
    resourceId: '',
    resourcename: '',
    disPostStatus: null,
    userEmail: ''
})
const successTipOff = (
    _id, moduleType, typeId,
    monitorNumber1, codeuuid,
    tipoffContent, resourceId, resourcename, userEmail
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
    updateTipOff.codeuuid = codeuuid
    updateTipOff.resourceId = resourceId
    updateTipOff.resourcename = resourcename
    updateTipOff.disPostStatus = 1
    updateTipOff.userEmail = userEmail
}
const errorTipOff = (
    _id, moduleType, typeId,
    monitorNumber1, codeuuid,
    tipoffContent, resourceId, resourcename, userEmail
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
    updateTipOff.codeuuid = codeuuid
    updateTipOff.resourceId = resourceId
    updateTipOff.resourcename = resourcename
    updateTipOff.disPostStatus = 2
    updateTipOff.userEmail = userEmail
}

const handleOkBigManager = () => {
    UpdateTipOff({
        _id: updateTipOff._id,
        moduleType: updateTipOff.moduleType,
        typeId: updateTipOff.typeId,
        disPostStatus: updateTipOff.disPostStatus,
        monitorNumber1: updateTipOff.monitorNumber1,
        codeuuid: updateTipOff.codeuuid,
        bigManagerId: counter.userlogin.id,
        bigManagerAccount: counter.userlogin.bigManagerAccount,
        bigManagerMessage: bigManagerMessage.value,
        userList: updateTipOff.userIdList,
        resourceId: updateTipOff.resourceId,
        resourcename: updateTipOff.resourcename,
        messageFirst: showtipoff.value,
        userEmail: updateTipOff.userEmail
    }).then(res => {
        if (res.code == 0) {
            message.success('审核成功')
            bigManagerMessage.value = ''
            visiblebigManagerMessage.value = false
            fetchCountDispose('代码片段管理')
            if (showtipoff.value == 1) {
                fetchCodeTipOff({ moduleType: '代码片段管理', isDisPose: 1, PageSize: pageSize.value, PageNumber: pageNumber.value })

            } else {
                fetchCodeTipOff({ moduleType: '代码片段管理', isDisPose: 0, PageSize: pageSize.value, PageNumber: pageNumber.value })
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

.resource-content {
    height: 550px;
    overflow-y: auto;
}

.code-check {
    background-color: rgb(240, 242, 245);
    margin: -24px -40px;
    padding-top: 10px;
}

.code-list {
    width: 96%;
    margin: 5px auto;
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
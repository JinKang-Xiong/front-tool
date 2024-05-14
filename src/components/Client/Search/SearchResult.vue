<template>
    <div class="search-result-content">
        <a-row>
            <a-col :span="3">
                <span style="font-weight: 600; font-size: 25px;">代码标题：</span>
            </a-col>
            <a-col :span="19" style="font-weight: 600; font-size: 25px;">
                {{ codeData === undefined ? '' : codeData.codeList.codeTitle }}
            </a-col>
            <a-col :span="2">
                <a-button type="" @click="router.back()">返回</a-button>
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
            <pre><code :class="languageClass" v-html="highlightedCode"></code>
            </pre>
        </div>
        <a-row style="margin-top: 20px;">
            <a-col :span="6">
                <a-space>
                    <a-button type="" @click="CollectAddModel()" v-if="!ActiveColor">
                        <StarOutlined />收藏
                    </a-button>
                    <a-popconfirm title="确认取消收藏嘛？" ok-text="是的" cancel-text="取消" @confirm="cancelCollect()"
                        @cancel="cancel">
                        <a-button type="" v-if="ActiveColor">
                            <StarOutlined :style="{ color: 'red' }" />收藏
                        </a-button>
                    </a-popconfirm>

                    <a-button type="" @click="LikeAddModel(0)" v-if="!ActiveColorLike">
                        <heart-outlined />点赞
                    </a-button>
                    <a-popconfirm title="真的要取消点赞吗？" ok-text="是的" cancel-text="取消" @confirm="LikeAddModel(1)"
                        @cancel="cancel">
                        <a-button type="" v-if="ActiveColorLike">
                            <HeartOutlined :style="{ color: 'red' }" />点赞
                        </a-button>
                    </a-popconfirm>
                    <a-button type="" danger @click="visibleTipOff = true">
                        <ExclamationCircleOutlined /> 反馈
                    </a-button>
                    <a-modal v-model:visible="visibleTipOff" title="反馈信息" @ok="handleOkTipOff" okText="确定"
                        cancelText="取消">
                        <div>
                            <a-form :model="formStateTip" name="tipOff">
                                <a-form-item name="radio-button" label="反馈类型"
                                    :rules="[{ require: true, message: '请您选择一个反馈类型' }]">
                                    <a-radio-group v-model:value="formStateTip.type" button-style="solid">
                                        <a-radio-button value="低俗色情" style="margin-right: 5px;">低俗色情</a-radio-button>
                                        <a-radio-button value="内容抄袭" style="margin-right: 5px;">内容抄袭</a-radio-button>
                                        <a-radio-button value="涉嫌违法" style="margin-right: 5px;">涉嫌违法</a-radio-button>
                                        <a-radio-button value="恶意营销" style="margin-right: 5px;">恶意营销</a-radio-button>
                                        <a-radio-button value="其他原因" style="margin-right: 5px;">其他原因</a-radio-button>
                                        <a-radio-button value="内容质量太差"
                                            style="margin-right: 5px;">内容质量太差</a-radio-button>
                                    </a-radio-group>
                                </a-form-item>
                                <a-form-item name="content" label="反馈内容">
                                    <a-textarea :autosize="{ minRows: 4, maxRows: 6 }"
                                        v-model:value="formStateTip.content" show-count :maxlength="100" />
                                </a-form-item>
                            </a-form>
                        </div>
                    </a-modal>
                </a-space>
                <a-modal v-model:visible="visibleShowCollect" title="收藏夹" @ok="handleOkAddCodeSnippet" okText="确定"
                    cancel="取消">
                    <div>
                        <a-list item-layout="horizontal" :data-source="collectData">
                            <template #renderItem="{ item, index }">
                                <a-list-item @click="SelectCollect(item, index)" style="cursor: pointer;">
                                    <a-list-item-meta :description="item.collectDescription">
                                        <template #title>
                                            <a>{{ item.collectName }}</a>
                                        </template>
                                    </a-list-item-meta>
                                    <template #extra>
                                        <div v-if="IsIoce == index">
                                            <check-circle-two-tone />
                                        </div>
                                    </template>
                                </a-list-item>
                            </template>
                        </a-list>
                    </div>
                    <a-row style="margin-top: 20px;">
                        <a-col :span="5" @click="ShowAddCollectModel">
                            <a-button type=""><plus-outlined />新建收藏夹</a-button>
                        </a-col>
                    </a-row>
                </a-modal>
                <a-modal v-model:visible="visibleAddCollect" title="新建收藏夹" @ok="handleOkAddCollect" okText="确定"
                    cancelText="取消">
                    <p>名称</p>
                    <a-input v-model:value="AddCollectName" placeholder="如：默认收藏夹" />
                    <p>简介</p>
                    <a-textarea v-model:value="AddCollectDescription" placeholder="如：关于开发页面的组件代码" :rows="3" />
                </a-modal>
            </a-col>
            <a-col :span="2" offset="16" style="text-align: center; line-height: 32px;">
                <field-time-outlined style="margin-right: 8px;" />{{ codeData == undefined ? '' :
                codeData.codeList.codeCreateTime }}
            </a-col>
        </a-row>
    </div>
    <!-- {{ codeData === undefined ? '' : codeData.codeList.codeSnippet }} -->
</template>

<script setup>
import { defineProps, onMounted, ref, computed, watch } from 'vue'
import { StarOutlined, LikeOutlined, ExclamationCircleOutlined, HeartOutlined, FieldTimeOutlined, PlusOutlined, CheckCircleTwoTone } from '@ant-design/icons-vue';
import { FindBycodeuuidAPI, CancelLikeAPI, TipOffAddAPI, FindAllLikeAPI, LikeCodeAPI, CollectCodeSnippetAPI, FindCollectByUserAPI, CollectAddAPI, CancelCollectAPI } from '../../../api/clientApi';
import Prism from 'prismjs'
import { Button, message } from 'ant-design-vue';
const prop = defineProps(['_id', 'codeuuid'])
import { useclientStore } from '../../../stores/count.js'
import { useRouter } from 'vue-router';
const router = useRouter()
const counter = useclientStore()
onMounted(() => {
    feth({ _id: prop._id, codeuuid: prop.codeuuid })
    Prism.highlightAll()
    fethCollect({ userId: counter.clientlogin.id })
    fethLike({ userId: counter.clientlogin.id })
})

//#region 展示数据
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

const collectData = ref([])
const collectId = ref()
const fethCollect = (query) => {
    FindCollectByUserAPI(query).then(res => {
        res.data.forEach((el => {
            el.codeSnippsetCollect.forEach(item => {
                if (item.codeId == codeData.value._id && item.codeuuid == codeData.value.codeList.codeuuid) {
                    ActiveColor.value = true
                    collectId.value = el._id
                }
            })
        }))

        collectData.value = [...res.data]

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

watch(() => [prop._id, prop.codeuuid], (newValue, oldValue) => {
    console.log(`language${newValue}`);
    feth({ _id: newValue[0], codeuuid: newValue[1] })
})
//#endregion

//#region 收藏功能
const ActiveColor = ref(false)
//展示收藏夹
const visibleShowCollect = ref(false)
const IsIoce = ref(-1)
const CurrentCollect = ref()
const CollectAddModel = () => {
    if (ActiveColor.value) {
        message.success('你以及收藏过了')
    } else {
        visibleShowCollect.value = true
    }


}
//选择收藏夹
const SelectCollect = (item, index) => {
    CurrentCollect.value = item
    IsIoce.value = index
}
const handleOkAddCodeSnippet = () => {
    CollectCodeSnippetAPI({
        _id: CurrentCollect.value._id,
        userId: counter.clientlogin.id,
        codeId: codeData.value._id,
        codeuuid: codeData.value.codeList.codeuuid,
        collectNumber: codeData.value.codeList.collectNumber
    }).then(res => {
        ActiveColor.value = true
        visibleShowCollect.value = false
        fethCollect({ userId: counter.clientlogin.id })
        message.success('收藏成功')
    })
}

//新建收藏夹
const visibleAddCollect = ref(false)
const AddCollectName = ref()
const AddCollectDescription = ref()
const ShowAddCollectModel = () => {
    visibleShowCollect.value = false
    visibleAddCollect.value = true
}
const handleOkAddCollect = () => {
    CollectAddAPI({ userId: counter.clientlogin.id, collectName: AddCollectName.value, collectDescription: AddCollectDescription.value }).then(res => {
        if (res.code == 0) {
            visibleShowCollect.value = true
            visibleAddCollect.value = false
            fethCollect({ userId: counter.clientlogin.id })
        }
    })
}

//取消收藏
const cancelCollect = () => {
    CancelCollectAPI({ _id: collectId.value, userId: counter.clientlogin.id, codeId: codeData.value._id }).then(res => {
        if (res.code == 0) {
            message.success('取消收藏')
            ActiveColor.value = false
            fethCollect({ userId: counter.clientlogin.id })
        }
    })
}
//#endregion


//#region 点赞功能
const likeData = ref()
const likeId = ref()
const fethLike = (query) => {
    FindAllLikeAPI(query).then(res => {
        if (res.code == 0) {
            if (res.data[0]) {
                likeData.value = { ...res.data[0] }
                likeId.value = res.data[0]._id
                if (res.data[0].codeSnippsetLike.length == 0) {
                    ActiveColorLike.value = false
                } else {
                    // res.data[0].codeSnippsetLike.forEach(item => {
                    //     console.log('进入循环啦吗')
                    //     if (item.codeId == prop._id && item.codeuuid == prop.codeuuid) {
                    //         console.log('点赞变色')
                    //         ActiveColorLike.value = true
                    //         return
                    //     }
                    //     ActiveColorLike.value = false
                    // })
                    for (let item of res.data[0].codeSnippsetLike) {
                        console.log('进入循环吗')
                        if (item.codeId == prop._id && item.codeuuid == prop.codeuuid) {
                            console.log('点赞变色')
                            ActiveColorLike.value = true
                            return
                        }
                        ActiveColorLike.value = false
                    }
                }

            }
        }
    })
}

const ActiveColorLike = ref(false)
const LikeAddModel = (isCancel) => {
    if (isCancel == 0) {
        if (likeId) {
            LikeCodeAPI({ _id: likeId.value, codeId: prop._id, codeuuid: prop.codeuuid, likeNumber: codeData.value.codeList.likeNumber, userId: counter.clientlogin.id }).then(res => {
                if (res.code == 0) {
                    message.success('点赞成功')
                    fethLike({ userId: counter.clientlogin.id })

                }
            })
            return
        }
        LikeCodeAPI({ _id: '', codeId: prop._id, codeuuid: prop.codeuuid, likeNumber: codeData.value.codeList.likeNumber, userId: counter.clientlogin.id }).then(res => {
            if (res.code == 0) {
                message.success('点赞成功')
                fethLike({ userId: counter.clientlogin.id })

            }
        })
        return
    }
    CancelLikeAPI({ _id: likeId.value, codeId: prop._id, codeuuid: prop.codeuuid, likeNumber: codeData.value.codeList.likeNumber, userId: counter.clientlogin.id }).then(res => {
        if (res.code == 0) {
            message.success('取消点赞了')
            fethLike({ userId: counter.clientlogin.id })
        }
    })
    return
}
//#endregion

//#region 举报功能
const visibleTipOff = ref(false)
const formStateTip = ref({
    type: '',
    content: ''
})

const handleOkTipOff = () => {
    TipOffAddAPI({ userId: counter.clientlogin.id, username: counter.clientlogin.username, userAvatarUrl: counter.clientlogin.avatarUrl, moduleType: '代码片段管理', type: formStateTip.value.type, content: formStateTip.value.content, codeId: prop._id, codeuuid: prop.codeuuid }).then(res => {
        if (res.code == 0) {
            message.success('反馈提交成功')
            visibleTipOff.value = false
        }
    })
}

//#endregion



</script>
<style>
.search-result-content {
    width: 80%;
    margin: 20px auto;
}
</style>

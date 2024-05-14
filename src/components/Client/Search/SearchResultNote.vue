<template>
    <div class="note-title">
        <a-row>
            <a-col :span="22"> <span style="font-size: 20px; font-weight: 600;">{{ noteName }}</span></a-col>
            <a-col :span="2"><a-button type="" @click="RouterBack">返回</a-button></a-col>
        </a-row>

    </div>
    <div class="note-read">
        <!-- <v-md-preview :text="noteContent"></v-md-preview> -->
        <!-- <v-md-preview :text="noteContent"></v-md-preview> -->
        <v-md-editor :model-value="noteContent" mode="preview"></v-md-editor>
    </div>
    <a-row>
        <a-col :span="4" style="margin-left: 100px;">
            <a-space>
                <a-button type="" @click="CollectAddModel()" v-if="!ActiveColor">
                    <StarOutlined />收藏
                </a-button>
                <a-popconfirm title="确认取消收藏嘛？" ok-text="是的" cancel-text="取消" @confirm="cancelCollect()" @cancel="cancel">
                    <a-button type="" v-if="ActiveColor">
                        <StarOutlined :style="{ color: 'red' }" />收藏
                    </a-button>
                </a-popconfirm>

                <a-button type="" @click="LikeAddModel(0)" v-if="!ActiveColorLike">
                    <heart-outlined />点赞
                </a-button>
                <a-popconfirm title="真的要取消点赞吗？" ok-text="是的" cancel-text="取消" @confirm="LikeAddModel(1)" @cancel="cancel">
                    <a-button type="" v-if="ActiveColorLike">
                        <StarOutlined :style="{ color: 'red' }" />点赞
                    </a-button>
                </a-popconfirm>
                <a-button type="" danger @click="visibleTipOff = true">
                    <ExclamationCircleOutlined /> 反馈
                </a-button>
                <a-modal v-model:visible="visibleTipOff" title="反馈信息" @ok="handleOkTipOff" okText="确定" cancelText="取消">
                    <div>
                        <a-form :model="formStateTip" name="tipOff">
                            <a-form-item name="radio-button" label="反馈类型"
                                :rules="[{ require: true, message: '请您选择一个反馈类型' }]">
                                <a-radio-group v-model:value="formStateTip.type" button-style="solid">
                                    <a-radio-button value="0" style="margin-right: 5px;">低俗色情</a-radio-button>
                                    <a-radio-button value="1" style="margin-right: 5px;">内容抄袭</a-radio-button>
                                    <a-radio-button value="2" style="margin-right: 5px;">涉嫌违法</a-radio-button>
                                    <a-radio-button value="3" style="margin-right: 5px;">恶意营销</a-radio-button>
                                    <a-radio-button value="4" style="margin-right: 5px;">其他原因</a-radio-button>
                                    <a-radio-button value="5" style="margin-right: 5px;">内容质量太差</a-radio-button>
                                </a-radio-group>
                            </a-form-item>
                            <a-form-item name="content" label="反馈内容">
                                <a-textarea :autosize="{ minRows: 4, maxRows: 6 }" v-model:value="formStateTip.content"
                                    show-count :maxlength="100" />
                            </a-form-item>
                        </a-form>
                    </div>
                </a-modal>
            </a-space>
            <a-modal v-model:visible="visibleShowCollect" title="收藏夹" @ok="handleOkAddCodeSnippet" okText="确定"
                cancelText="取消">
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
            <a-modal v-model:visible="visibleAddCollect" title="新建收藏夹" @ok="handleOkAddCollect" okText="确定" cancelText="取消">
                <p>名称</p>
                <a-input v-model:value="AddCollectName" placeholder="如：默认收藏夹" />
                <p>简介</p>
                <a-textarea v-model:value="AddCollectDescription" placeholder="如：关于开发页面的组件代码" :rows="3" />
            </a-modal>
        </a-col>
    </a-row>
</template>

<script setup>
import { StarOutlined, StarFilled, StarTwoTone, LeftOutlined, CheckCircleTwoTone, PlusOutlined } from '@ant-design/icons-vue';
import { defineProps, ref, onMounted } from 'vue'
import { message } from 'ant-design-vue';
import { TipOffNoteAPI, FindNoteByIdAPI, AddLikeNoteAPI, CancelLikeNoteAPI, CancelCollectNoteAPI, CollectNoteAddAPI, CollectNoteAPI, FindAllLikeAPI, FindCollectNoteByUserAPI, } from '../../../api/clientApi.js'
import { useRouter } from 'vue-router';
import { useclientStore } from '../../../stores/count.js'

const counter = useclientStore()
const router = useRouter()
onMounted(() => {
    console.log(props._id)
    fetchnote({ userId: '', _id: props._id })
    fethLike({ userId: counter.clientlogin.id })
    fethCollect({ userId: counter.clientlogin.id })
})

const props = defineProps(['_id'])


const note = ref()
const noteContent = ref()
const noteName = ref()
const fetchnote = (query) => {
    FindNoteByIdAPI(query).then(res => {
        if (res.code == 0) {
            note.value = res.data
            noteContent.value = res.data.noteContent
            noteName.value = res.data.noteName
        }
    })
}
const RouterBack = () => {
    router.back()
}

//#region 收藏关系
const collectData = ref([])
const collectId = ref()
const fethCollect = (query) => {
    FindCollectNoteByUserAPI(query).then(res => {
        collectData.value = [...res.data]
        res.data.forEach((el => {
            el.noteCollect.forEach(item => {
                if (item == note.value._id) {
                    ActiveColor.value = true
                    collectId.value = el._id
                }
            })
        }))



    })
}

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
    CollectNoteAPI({
        _id: CurrentCollect.value._id,
        userId: counter.clientlogin.id,
        noteId: note.value._id,
        collectNumber: note.value.collectNumber
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
    CollectNoteAddAPI({ userId: counter.clientlogin.id, collectName: AddCollectName.value, collectDescription: AddCollectDescription.value }).then(res => {
        if (res.code == 0) {
            visibleShowCollect.value = true
            visibleAddCollect.value = false
            fethCollect({ userId: counter.clientlogin.id })
        }
    })
}

//取消收藏
const cancelCollect = () => {
    CancelCollectNoteAPI({ _id: collectId.value, userId: counter.clientlogin.id, noteId: note.value._id }).then(res => {
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
                if (res.data[0].noteLike.length == 0) {
                    ActiveColorLike.value = false
                } else {
                    res.data[0].noteLike.forEach(item => {
                        console.log('进入循环啦吗')
                        if (item.noteId == props._id) {
                            ActiveColorLike.value = true
                            return
                        }
                        ActiveColorLike.value = false
                    })
                }

            }
        }
    })
}

const ActiveColorLike = ref(false)
const LikeAddModel = (isCancel) => {
    if (isCancel == 0) {
        if (!likeId) {
            AddLikeNoteAPI({ _id: '', noteId: props._id, likeNumber: note.value.likeNumber, userId: counter.clientlogin.id }).then(res => {
                if (res.code == 0) {
                    message.success('点赞成功')
                    fethLike({ userId: counter.clientlogin.id })
                }
            })
            return
        }
        AddLikeNoteAPI({ _id: likeId.value, noteId: props._id, likeNumber: note.value.likeNumber, userId: counter.clientlogin.id }).then(res => {
            if (res.code == 0) {
                message.success('点赞成功')
                fethLike({ userId: counter.clientlogin.id })

            }
        })
        return
    }
    CancelLikeNoteAPI({ _id: likeId.value, noteId: props._id, likeNumber: note.value.likeNumber, userId: counter.clientlogin.id }).then(res => {
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
    TipOffNoteAPI({ userId: counter.clientlogin.id, username: counter.clientlogin.username, userAvatarUrl: counter.clientlogin.avatarUrl, moduleType: '笔记管理', type: formStateTip.value.type, content: formStateTip.value.content, noteId: props._id, }).then(res => {
        if (res.code == 0) {
            message.success('反馈提交成功')
            visibleTipOff.value = false
        }
    })
}

</script>


<style scoped>
.note-title {
    width: 90%;
    margin: 0px auto;
    padding: 0 2.5rem;
}

.note-read {
    width: 90%;
    margin: 0px auto;
}
</style>
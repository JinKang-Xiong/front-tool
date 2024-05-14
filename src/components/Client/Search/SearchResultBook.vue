<template>
    <div class="book-item">
        <a-row>
            <a-col :span="5">
                <a-image :width="200" :src="initData.bookImg" />
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
                            <a-button type="" @click="collectBook">保存书籍</a-button>
                            <a-button type="primary" shape="round" @click="RouterBookLook">开始阅读</a-button>
                        </a-space>
                    </a-col>
                </a-row>
                <a-typography-text type="secondary">{{ initData.isPrivate == 0 ? '私有' : '公有' }}</a-typography-text>
                <div style="margin-top: 10px; margin-bottom: 20px;">
                    <a-typography-text>{{ initData.bookDescription }}</a-typography-text>
                </div>
                <a-typography-title :level="4" v-if="initData.shareViewPoint">分享寄语 <MyIcon type="icon-weixiao"></MyIcon>
                </a-typography-title>
                <div style="margin: 10px 0px;">
                    <a-typography-text>{{ initData.shareViewPoint }}</a-typography-text>
                </div>
            </a-col>
        </a-row>
        <a-row style="margin-top: 20px;">
            <a-col :span="2">
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
            </a-col>
        </a-row>
    </div>
</template>

<script setup>
import { createFromIconfontCN, PlusOutlined, HeartOutlined, StarOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { ref, reactive, defineProps, onMounted } from 'vue'
import { message } from 'ant-design-vue';
import { FindBookByIdAPI, UpdateBookAPI, SaveCollectBookAPI, TipOffAddBookAPI } from '../../../api/clientApi.js'
import { useRouter } from 'vue-router'
import { useclientStore } from '../../../stores/count.js'

const counter = useclientStore()
import { init } from 'echarts';
const MyIcon = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/c/font_4158111_1ruumo6bmni.js', // 在 iconfont.cn 上生成
});
const router = useRouter()
const RouterBookLook = () => {
    router.push({ name: 'booklook', params: { _id: props._id } })
}

const props = defineProps(['_id'])
onMounted(() => {
    fecthinit({ _id: props._id })
})
const initData = ref({})
const fecthinit = (query) => {
    FindBookByIdAPI(query).then(res => {
        if (res.code == 0) {
            initData.value = { ...res.data }
        }
    })
}

//保存书籍
const collectBook = () => {
    SaveCollectBookAPI({
        bookName: initData.value.bookName,
        bookTag: initData.value.bookTag,
        bookDescription: initData.value.bookDescription,
        bookImg: initData.value.bookImg,
        bookUrl: initData.value.bookUrl,
        shareViewPoint: initData.value.shareViewPoint,
        _id: initData.value._id,
        userId: counter.clientlogin.id,
        collectNumber: initData.value.collectNumber
    }).then(res => {
        if (res.code == 0) {
            message.success('保存成功')
        }
    })
}


//#region 举报功能
const visibleTipOff = ref(false)
const formStateTip = ref({
    type: '',
    content: ''
})

const handleOkTipOff = () => {
    TipOffAddBookAPI({ userId: counter.clientlogin.id, username: counter.clientlogin.username, userAvatarUrl: counter.clientlogin.avatarUrl, moduleType: '书籍管理', type: formStateTip.value.type, content: formStateTip.value.content, bookId: props._id }).then(res => {
        if (res.code == 0) {
            message.success('反馈提交成功')
            visibleTipOff.value = false
        }
    })
}



</script>

<style scoped>
.book-item {
    width: 70%;
    margin: 30px auto;
}
</style>
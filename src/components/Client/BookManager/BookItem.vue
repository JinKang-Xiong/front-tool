<template>
    <div class="book-item">
        <a-row>
            <a-col :span="5">
                <a-image :width="200" :src="initData.bookImg" />
                <a-row style="margin-top: 15px;">
                    <a-space>
                        <a-button type="primary" @click="showEditModal">编辑书籍</a-button>
                        <a-button type="" @click="showDialog = true">更换封面</a-button>
                        <myUpload v-model="showDialog" :url="updateUrl" @crop-upload-success="cropUploadSuccess"
                            :params="params"></myUpload>
                    </a-space>
                    <a-modal v-model:visible="visibleEditBook" title="编辑书籍基本信息" @ok="handleOkEditBook" okText="确定"
                        cancelText="取消">
                        <a-form :model="formStateEdit" name="edit">
                            <a-form-item name="bookName" label="书籍名称">
                                <a-input v-model:value="formStateEdit.bookName" placeholder="请输入书名"></a-input>
                            </a-form-item>
                            <a-form-item name="bookDescription" label="书籍描述">
                                <a-textarea :autosize="{ minRows: 3, maxRows: 6 }"
                                    v-model:value="formStateEdit.bookDescription" show-count
                                    :maxlength="100"></a-textarea>
                            </a-form-item>
                            <a-form-item name="bookTag" label="书籍标签">
                                <template v-for="(tag, index) in state.tags" :key="tag">
                                    <a-tooltip v-if="tag.length > 20" :title="tag">
                                        <a-tag :closable="index !== 0" @close="handleClose(tag)">
                                            {{ `${tag.slice(0, 20)}...` }}
                                        </a-tag>
                                    </a-tooltip>
                                    <a-tag v-else :closable="index !== 0" @close="handleClose(tag)">
                                        {{ tag }}
                                    </a-tag>
                                </template>
                                <a-input v-if="state.inputVisible" ref="inputRef" v-model:value="state.inputValue"
                                    type="text" size="small" :style="{ width: '78px' }" @blur="handleInputConfirm"
                                    @keyup.enter="handleInputConfirm" />
                                <a-tag v-else style="background: #fff; border-style: dashed" @click="showInput">
                                    <plus-outlined />
                                    新建标签
                                </a-tag>
                            </a-form-item>
                            <a-form-item name="isPrivate" label="可见范围">
                                <a-radio-group v-model:value="formStateEdit.isPrivate" @change="ShowShareViewPoint">
                                    <a-radio :value="0">私有</a-radio>
                                    <a-radio :value="1">公有</a-radio>
                                </a-radio-group>
                            </a-form-item>
                            <a-form-item name="shareViewPoint" label="分享寄语" v-if="visibleShareViewPoint">
                                <a-textarea :autosize="{ minRows: 3, maxRows: 6 }"
                                    v-model:value="formStateEdit.shareViewPoint" show-count :maxlength="900" />
                            </a-form-item>
                        </a-form>
                    </a-modal>
                </a-row>
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
                            <!-- <a-button type="primary" shape="round">书籍笔记</a-button> -->
                            <a-button type="primary" shape="round" @click="RouterBookLook">开始阅读</a-button>
                            <a-button type="" @click="router.back()">返回</a-button>
                        </a-space>
                    </a-col>
                </a-row>
                <a-typography-text type="secondary">
                    <span v-if="initData.isPrivate == 0">私有 </span>
                    <span v-if="initData.isPrivate == 1"> 公有 </span>
                    <span v-if="initData.isPrivate == 2"> 监控中 </span>
                </a-typography-text>
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
    </div>
</template>

<script setup>
import { createFromIconfontCN, PlusOutlined } from '@ant-design/icons-vue';
import { ref, reactive, defineProps, onMounted } from 'vue'
import { message } from 'ant-design-vue';
import myUpload from 'vue-image-crop-upload'
import { FindBookByIdAPI, UpdateBookAPI } from '../../../api/clientApi.js'
import { useRouter } from 'vue-router'
import { useclientStore } from '../../../stores/count.js'

const counter = useclientStore()
const router = useRouter()
const RouterBookLook = () => {
    router.push({ name: 'booklook', params: { _id: props._id } })
}

const props = defineProps(['_id'])
onMounted(() => {
    fecthinit({ userId: counter.clientlogin.id, _id: props._id })
})
const initData = ref({})
const fecthinit = (query) => {
    FindBookByIdAPI(query).then(res => {
        if (res.code == 0) {
            initData.value = { ...res.data }
        }
    })
}
const MyIcon = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/c/font_4158111_1ruumo6bmni.js', // 在 iconfont.cn 上生成
});
const visibleEditBook = ref(false)
//是否展示分享寄语 要查询后才可以判断
const visibleShareViewPoint = ref(false)

//#region 编辑书籍信息
const formStateEdit = reactive({
    bookName: '',
    bookDescription: '',
    isPrivate: null,
    shareViewPoint: ''
})
const inputRef = ref();
const state = reactive({
    tags: [],
    inputVisible: false,
    inputValue: '',
});
const handleClose = removedTag => {
    const tags = state.tags.filter(tag => tag !== removedTag);
    state.tags = tags;
};
const showInput = () => {
    state.inputVisible = true;
    nextTick(() => {
        inputRef.value.focus();
    });
};
const handleInputConfirm = () => {
    const inputValue = state.inputValue;
    let tags = state.tags;
    if (inputValue && tags.indexOf(inputValue) === -1) {
        tags = [...tags, inputValue];
    }
    Object.assign(state, {
        tags,
        inputVisible: false,
        inputValue: '',
    });
};
const showEditModal = () => {
    formStateEdit.bookName = initData.value.bookName
    formStateEdit.bookDescription = initData.value.bookDescription
    formStateEdit.isPrivate = initData.value.isPrivate
    formStateEdit.shareViewPoint = initData.value.shareViewPoint
    state.tags = [...initData.value.bookTag]
    visibleEditBook.value = true
}
const ShowShareViewPoint = () => {
    if (formStateEdit.isPrivate == 1) {
        visibleShareViewPoint.value = true
    } else {
        visibleShareViewPoint.value = false
    }
}
const handleOkEditBook = () => {
    UpdateBookAPI({
        _id: props._id,
        userId: counter.clientlogin.id,
        bookName: formStateEdit.bookName,
        bookDescription: formStateEdit.bookDescription,
        isPrivate: formStateEdit.isPrivate,
        shareViewPoint: formStateEdit.shareViewPoint,
        bookTag: state.tags
    }).then(res => {
        if (res.code == 0) {
            visibleEditBook.value = false
            fecthinit({ userId: counter.clientlogin.id, _id: props._id })
        }
    })
}
//#endregion

//修改书籍封面
const showDialog = ref(false)
const updateUrl = ref('/nestnode//book/updateimg')
const params = reactive({
    _id: props._id,
    userId: counter.clientlogin.id
})
const cropUploadSuccess = () => {
    showDialog.value = false
    fecthinit({ userId: counter.clientlogin.id, _id: props._id })
    message.success('修改封面成功')

}
</script>

<style scoped>
.book-item {
    width: 70%;
    margin: 30px auto;
}
</style>
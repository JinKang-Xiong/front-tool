<template>
    <a-layout>
        <a-layout-sider :width="280" theme="light"
            style="    border-left: 1px solid rgb(221, 221, 221); padding-left: 0px;border-right: 1px solid rgb(221, 221, 221);">
            <a-row style="padding: 10px;">
                <a-col :span="12">
                    <a-typography-title ellipsis="true" :level="5">
                        <a-space>
                            <left-outlined @click="routerStore" />
                            {{ CodeStoreTitle }}
                        </a-space>

                    </a-typography-title>
                </a-col>
                <a-col :span="4" offset="8">
                    <a-button type="primary" shape="circle" style="width: 25px;"
                        @click="AddCodeSnippet(CodeStoreItem._id)"><plus-outlined /></a-button>
                </a-col>

            </a-row>
            <div class="code-content-list">
                <div class="code-list-search">
                    <!-- <a-input v-model:value="userName" placeholder="请输入标题或者标签" allowClear="true">
                        <template #prefix>
                            <search-outlined />
                        </template>

                    </a-input> -->
                    <a-input-search v-model:value="inputValue" placeholder="请输入标题或者标签" @search="onSearch" />
                </div>
                <div class="code-list">
                    <a-list :data-source="CodeSnippetListData" item-layout="vertical" style="cursor: pointer;">
                        <template #renderItem="{ item, index }">
                            <a-list-item @click="ShowCodeSnippet(item, index)" @mouseover="enterBack(index)"
                                @mouseleave="leaveBack(index)" :class="{
                                    codelistbackColor: isCodeListBackColor == index ? true : false,
                                    codelistbackColorHover: isCodeListBackColorHover == index ? true : false
                                }">
                                <a-list-item-meta description="">
                                    <template #title>
                                        <span :style="{ color: isCodeListBackColor == index ? 'white' : '' }">{{
                                            item.codeTitle
                                        }}</span>
                                    </template>

                                </a-list-item-meta>
                                <template #actions>
                                    <a-space>
                                        <a-tag v-for="( el ) in  item.codeTag "
                                            :color="isCodeListBackColor == index ? '#1890FF' : ''">{{ el }}</a-tag>
                                    </a-space>

                                </template>
                                <template #extra>
                                    <span :style="{ color: isCodeListBackColor == index ? 'white' : '' }">
                                        {{ item.codeIsPrivate }}
                                    </span>
                                </template>
                            </a-list-item>
                        </template>
                    </a-list>

                </div>
            </div>
        </a-layout-sider>

        <a-layout-content>
            <router-view @deleteCode="refreshData"></router-view>
        </a-layout-content>

    </a-layout>
</template>

<script setup>
import { StarOutlined, EditOutlined, CloseOutlined, EllipsisOutlined, LeftOutlined, PlusOutlined, SearchOutlined, FolderOpenOutlined, FolderOutlined, RightOutlined, SmileOutlined, SettingOutlined, AppstoreOutlined, UserOutlined, GoldOutlined, CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons-vue';
import { ref, reactive, nextTick, onMounted, onBeforeUnmount, defineProps, watch } from 'vue'
import { DownOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import { FindAllSnippetAPI, FindSnippetByTitleAPI, AddCodeSnippetAPI, UpdateSnippetAPI, DeleteSnippetAPI, UpdateSnippetIsPrivateAPI, FindBycodeuuidAPI } from '../../../api/clientApi.js'
import language from 'vue-image-crop-upload/utils/language';
import { useclientStore } from '../../../stores/count.js'

const counter = useclientStore()
const router = useRouter()
const prop = defineProps(['_id'])
const CodeSnippetListData = ref([])
const CodeStoreItem = ref()
const CodeStoreTitle = ref()
onMounted(() => {
    fetchsnippet({ _id: prop._id, userId: counter.clientlogin.id, codeIsPrivate: 3 })
    console.log('刷新代码集')
})
const refreshData = () => {
    fetchsnippet({ _id: prop._id, userId: counter.clientlogin.id, codeIsPrivate: 3 })
};

router.beforeEach((to, from, next) => {
    if (to.meta.refreshParentData) {
        to.meta.refreshParentData();
    }
    next();
});


const languageCodeValue = ref()
const languageCode = (value) => {
    console.log("收获本次代码语言");
    let valueArr = value.split('/')
    languageCodeValue.value = valueArr[2]
    console.log(languageCodeValue.value);

}


//监听_id变化
watch(() => prop._id, (newValue, oldValue) => {
    console.log(`propValue变为：${newValue}`);
    fetchsnippet({ _id: prop._id, userId: counter.clientlogin.id, codeIsPrivate: 3 })

})

//查询用户全部的代码片段
const fetchsnippet = (query) => {
    FindAllSnippetAPI(query).then(res => {
        console.log(res.data);
        CodeStoreItem.value = res.data[0]
        CodeStoreTitle.value = res.data[0].storeName
        res.data[0].codeList.forEach(item => {
            switch (item.codeIsPrivate) {
                case 0:
                    item.codeIsPrivate = '私有'
                    break
                case 1:
                    item.codeIsPrivate = '公有'
                    break
                case 2:
                    item.codeIsPrivate = '监控中'
                    break
            }
        })
        CodeSnippetListData.value = res.data[0].codeList

        console.log(CodeSnippetListData.value);


    })
}

//增加代码片段
const AddCodeSnippet = (_id) => {
    AddCodeSnippetAPI({ _id, codeList: { codeTitle: '新建代码片段', codeDescription: '', codeSnippet: '', codeTag: [], codeLanguage: 'javascript' } }).then(res => {
        if (res.code == 0) {
            message.success('增加成功')
            fetchsnippet({ _id: prop._id, userId: counter.clientlogin.id, codeIsPrivate: 3 })
            let newindex = CodeSnippetListData.value.length
            ShowCodeContentItem.value = true
            isCodeListBackColor.value = newindex;
            isCodeListBackColorHover.value = -1
            router.push({ name: 'aceeditor', params: { _id, codeuuid: res.data[0].codeuuid } })
        }
    })
}

//删除代码片段
const deleteSnippet = (codeuuid) => {
    DeleteSnippetAPI({ _id: CodeStoreItem.value._id, codeuuid }).then(res => {
        if (res.code == 0) {
            message.success("删除成功")
            fetchsnippet({ _id: prop._id, userId: counter.clientlogin.id, codeIsPrivate: 3 })
            ShowCodeContentItem.value = false
            isCodeListBackColor.value = -1
        }
    })
}

const routerStore = () => {
    router.push({ name: 'codestoreshow' })
}
//代码片段需要的属性值
const CodeSnippet = ref({
    codeTitle: '',
    codeTag: [],
    codeSnippet: '',
    codeuuid: null,
    codeIsPrivate: null,
    codeLanguage: null
})

//#region 代码片段点击事件
const ShowCodeContentItem = ref(false)
const isCodeListBackColor = ref(-1)
const isCodeListBackColorHover = ref(-1)
//点击代码片段列表执行的函数 
const ShowCodeSnippet = (item, index) => {
    ShowCodeContentItem.value = true

    isCodeListBackColor.value = index
    isCodeListBackColorHover.value = -1
    router.push({ name: 'aceeditor', params: { _id: CodeStoreItem.value._id, codeuuid: item.codeuuid } })

}

//两个代码片段鼠标悬浮事件
const enterBack = (index) => {
    if (isCodeListBackColor.value == index) {
        return
    }
    isCodeListBackColorHover.value = index
}

const leaveBack = (index) => {
    isCodeListBackColorHover.value = -1
}
//#endregion

//根据标题和标签进行搜索
const inputValue = ref()
const onSearch = () => {
    FindSnippetByTitleAPI({ _id: CodeStoreItem.value._id, userId: counter.clientlogin.id, inputValue: inputValue.value }).then(res => {
        if (res.code == 0) {
            CodeSnippetListData.value = res.data[0].codeList
        }
    })
}


</script>

<style>
/* #ace-editor {
    margin-top: 10px;
    position: absolute;
    width: 1000px;
    height: 500px;
} */

/* background-color: rgb(24, 144, 255); */

.codelistbackColor {
    background-color: rgb(24, 144, 255);
}

.code-list {
    padding: 10px;
    height: 600px;
    overflow: auto;
}

.codelistbackColorHover {
    background-color: rgb(243, 243, 243);
}

/* .code-list .ant-list-item:hover {
  
    color: white;
} */


.cod .code-content-list {
    height: 660px;

}

.code-list::-webkit-scrollbar {
    width: 8px;
    /* 纵向滚动条宽度 */
    height: 8px;
    /* 横向滚动条高度 */
    background-color: white;
    /* 滚动条整体背景，一般被覆盖着 */
}

/* 滚动条里面的滑块 */
.code-list::-webkit-scrollbar-thumb {
    border-radius: 10px;
    /* 滚动条滑块阴影 */
    background-color: rgba(216, 218, 217);
    /* 滚动条滑块颜色 */
}

/* 滚动条的轨道（里面装有Thumb） */
.code-list::-webkit-scrollbar-track {
    /* -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3); */
    /* 滚动条轨道阴影 */
    border-radius: 10px;
    /* 滚动条轨道圆角 */
    background-color: white;
    /* 滚动条轨道背景 */
}

.code-list-search {
    width: 100%;
    padding: 10px;
    border-bottom: 1px solid rgb(221, 221, 221);
}
</style>
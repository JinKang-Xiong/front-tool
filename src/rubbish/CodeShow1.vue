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
                    <a-input v-model:value="userName" placeholder="请输入标题或者标签" allowClear="true">
                        <template #prefix>
                            <search-outlined />
                        </template>

                    </a-input>
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
                                        {{ item.codeIsPrivate == 0 ? '私有' : '公开' }}
                                    </span>
                                </template>
                            </a-list-item>
                        </template>
                    </a-list>

                </div>
            </div>
        </a-layout-sider>
        <a-layout-content>
            <div v-show="!CodeSnippet.codeTitle" style="margin-top: 150px;">
                <a-empty description="请点击代码列表查看" :image="Empty.PRESENTED_IMAGE_SIMPLE" />
            </div>
            <div v-show="CodeSnippet.codeTitle">
                <a-row>
                    <a-col :span="20"> <a-typography-title :level="4">{{ CodeSnippet.codeTitle }}</a-typography-title>
                    </a-col>
                    <a-col :span="4">
                        <a-space>
                            <a-button type="primary" style="padding: 4px;"><edit-outlined />编辑</a-button>
                            <a-button type="" danger style="padding: 4px;"><close-outlined />删除</a-button>
                        </a-space>
                    </a-col>
                </a-row>
                <p style=" word-wrap: break-word; overflow-wrap: break-word; font-size: 16px;">
                    <span style="font-weight: 600;">代码片段的描述：</span>
                    <span>{{ CodeSnippet.codeDescription }}</span>
                </p>
                <a-row>
                    <a-tag color="blue" v-for="item in CodeSnippet.codeTag">{{ item }}</a-tag>
                </a-row>
                <div class="code-show-language">
                    <pre><code :class="languageClass" v-html="highlightedCode"></code></pre>
                </div>
                <a-row style="margin-top: 10px; margin-bottom: 10px;">
                    <a-col :span="2">
                        <a-button type="" @click="showDrawer">查看运行结果图</a-button>
                    </a-col>
                    <a-drawer title="代码运行结果图" :placement="placement" :closable="false" :visible="visibleCodeRunResult"
                        @close="onClose">
                        <a-image :width="300" :src="item" v-for="item in CodeSnippet.codeRunResult" />
                    </a-drawer>
                </a-row>
            </div>

        </a-layout-content>

    </a-layout>
</template>

<script setup>
import { StarOutlined, EditOutlined, CloseOutlined, EllipsisOutlined, LeftOutlined, PlusOutlined, SearchOutlined, FolderOpenOutlined, FolderOutlined, RightOutlined, SmileOutlined, SettingOutlined, AppstoreOutlined, UserOutlined, GoldOutlined, CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons-vue';
import { ref, reactive, nextTick, onMounted, onBeforeUnmount, defineProps, watch, computed } from 'vue'
import { DownOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import { FindAllSnippetAPI, AddCodeSnippetAPI, UpdateSnippetAPI, DeleteSnippetAPI, UpdateSnippetIsPrivateAPI } from '../../../api/clientApi.js'
import Prism from 'prismjs'
import { Empty } from 'ant-design-vue';
const router = useRouter()
const prop = defineProps(['_id'])
const CodeSnippetListData = ref([])
const CodeStoreItem = ref()
const CodeStoreTitle = ref()
onMounted(() => {
    fetchsnippet({ _id: prop._id, userId: '1', codeIsPrivate: 2 })
    Prism.highlightAll()
})


//监听_id变化
watch(() => prop._id, (newValue, oldValue) => {
    console.log(`propValue变为：${newValue}`);
    fetchsnippet({ _id: prop._id, userId: '1', codeIsPrivate: 2 })

})

//查询用户全部的代码片段
const fetchsnippet = (query) => {
    FindAllSnippetAPI(query).then(res => {
        console.log(res.data);
        CodeStoreItem.value = res.data[0]
        CodeStoreTitle.value = res.data[0].storeName
        CodeSnippetListData.value = res.data[0].codeList

        console.log(CodeSnippetListData.value);


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
    codeLanguage: null,
    codeDescription: '',
    codeRunResult: []
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

    CodeSnippet.value.codeTitle = item.codeTitle;
    CodeSnippet.value.codeTag = [...item.codeTag];
    CodeSnippet.value.codeSnippet = item.codeSnippet
    CodeSnippet.value.codeuuid = item.codeuuid
    CodeSnippet.value.codeIsPrivate = item.codeIsPrivate
    CodeSnippet.value.codeDescription = item.codeDescription
    CodeSnippet.value.codeLanguage = item.codeLanguage
    CodeSnippet.value.codeRunResult = [...item.codeRunResult]
    console.log(CodeSnippet.value);

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

//跳转增加页面
const AddCodeSnippet = (_id) => {
    router.push({ name: 'addcode', params: { _id } })
}

const languageClass = computed(() => {
    return `language-${CodeSnippet.value.codeLanguage}`;
})
const highlightedCode = computed(() => {
    // 在这里使用 Prism.js 的 highlight 函数来对代码进行语法高亮
    // 注意，这里需要引入 Prism.js 库，并根据需要引入相应的语言扩展
    if (CodeSnippet.value.codeSnippet && CodeSnippet.value.codeLanguage) {
        // 只有在 codeSnipppet 和 codeLanguageValue 都有值时才调用 Prism.highlight 函数
        return Prism.highlight(CodeSnippet.value.codeSnippet, Prism.languages[CodeSnippet.value.codeLanguage], CodeSnippet.value.codeLanguage);
    }
})
const visibleCodeRunResult = ref(false)
const showDrawer = () => {
    visibleCodeRunResult.value = true
}
const onClose = () => {
    visibleCodeRunResult.value = false;
};

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
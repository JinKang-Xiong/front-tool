<template>
    <a-progress v-if="!accomplishLoad" :percent="percent" :show-info="false" size="small" />
    <div class="my-pdf" v-show="accomplishLoad">

        <div class="pdf-wrap">
            <vue-pdf-embed :source="state.source" @progress="propgress" :style="scale" class="vue-pdf-embed"
                :page="state.pageNum"></vue-pdf-embed>
        </div>
        <div class="page-tool">
            <div class="page-tool-item" @click="backBook">返回</div>
            <div class="page-tool-item" @click="lastPage">上一页</div>
            <div class="page-tool-item" @click="nextPage">下一页</div>
            <div class="page-tool-item">{{ state.pageNum }}/{{ state.numPages }}</div>
            <div class="page-tool-item" @click="pageZoomOut">放大</div>
            <div class="page-tool-item" @click="pageZoomIn">缩小</div>
        </div>
    </div>
</template>

<script setup>
import { reactive, onMounted, computed, ref } from 'vue'
import VuePdfEmbed from 'vue-pdf-embed';
import { createLoadingTask } from 'vue3-pdfjs';
import { useRouter } from 'vue-router'
const router = useRouter()

//定义页数
const state = reactive({
    source: props.pdfUrl,//预览pdf文件地址
    pageNum: 1, //当前页面
    scale: 1,//缩放比例
    numPages: 0 //总页数
})



const props = defineProps({
    pdfUrl: {
        type: String,
    }
})

onMounted(() => {
    const loadingTask = createLoadingTask(state.source)
    loadingTask.promise.then((pdf) => {
        state.numPages = pdf.numPages
    })
})

const scale = computed(() => `transform:scale(${state.scale})`)

function lastPage() {
    if (state.pageNum > 1) {
        state.pageNum -= 1
    }
}
function nextPage() {
    if (state.pageNum < state.numPages) {
        state.pageNum += 1
    }
}
function pageZoomOut() {
    if (state.scale < 2) {
        state.scale += 0.1
    }
}
function pageZoomIn() {
    if (state.scale > 1) {
        state.scale -= 0.1
    }
}
const backBook = () => {
    router.back()
}
const accomplishLoad = ref(false)
const percent = ref(0)
const propgress = (pro) => {
    let ac = (pro.loaded / pro.total) * 100
    percent.value = ac
    console.log(ac)
    if (pro.loaded == pro.total) {
        accomplishLoad.value = true
    }
}
</script>

<style scoped>
.my-pdf {
    position: relative;
    padding: 20px 0;
    box-sizing: border-box;
    background: rgb(66, 66, 66);
}

.pdf-wrap {
    overflow-y: auto;
}

.pdf-wrap::-webkit-scrollbar {
    width: 8px;
    /* 纵向滚动条宽度 */
    height: 8px;
    /* 横向滚动条高度 */
    background-color: white;
    /* 滚动条整体背景，一般被覆盖着 */
}

/* 滚动条里面的滑块 */
.pdf-wrap::-webkit-scrollbar-thumb {
    border-radius: 10px;
    /* 滚动条滑块阴影 */
    background-color: rgba(216, 218, 217);
    /* 滚动条滑块颜色 */
}

/* 滚动条的轨道（里面装有Thumb） */
.pdf-wrap::-webkit-scrollbar-track {
    /* -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3); */
    /* 滚动条轨道阴影 */
    border-radius: 10px;
    /* 滚动条轨道圆角 */
    background-color: white;
    /* 滚动条轨道背景 */
}


.vue-pdf-embed {
    text-align: center;
    width: 515px;
    border: 1px solid #e5e5e5;
    margin: 0 auto;
    box-sizing: border-box;
}

.page-tool {
    padding-left: 15px;
    padding-right: 15px;
    display: flex;
    align-items: center;
    background: rgb(66, 66, 66);
    color: white;
    border-radius: 19px;
    z-index: 100;
    cursor: pointer;
    margin-left: 59%;
    transform: translateX(-50%);
}

.page-tool-item {
    padding: 8px 15px;
    padding-left: 10px;
    cursor: pointer;
}
</style>
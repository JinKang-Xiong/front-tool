<template>
    <div class="note-content">
        <a-row>
            <a-col :span="12">
                <div style="text-align: center; margin-top: 60px;">
                    <a-typography-title :level="2">笔记管理</a-typography-title>
                    <a-typography-text type="secondary" style="font-size: 20px;">每种文字的沉淀——《笔记物语》</a-typography-text>
                </div>
            </a-col>
            <a-col :span="12">
                <img style="width: 230px; margin-left: 100px;" src="../../../assets//Client/images/note1.svg">
            </a-col>
        </a-row>
        <a-row style="border-top: 1px solid #d0d7de; background-color: rgb(250, 250, 250);">
            <a-col :span="21">
                <a-menu v-model:selectedKeys="current" mode="horizontal">
                    <a-menu-item key="1" @click="RouterNoteShow">
                        <template #icon>
                            <mail-outlined />
                        </template>
                        笔记
                    </a-menu-item>
                    <a-menu-item key="2" @click="RouterNoteUpdate">
                        <template #icon>
                            <mail-outlined />
                        </template>
                        时间轴
                    </a-menu-item>
                    <!-- <a-menu-item key="3">
                        <template #icon>
                            <mail-outlined />
                        </template>
                        书库笔记
                    </a-menu-item> -->
                    <a-menu-item key="4" @click="RouterNoteBookShow">
                        <template #icon>
                            <mail-outlined />
                        </template>
                        笔记本
                    </a-menu-item>
                    <a-menu-item key="5" @click="RouterNoteCollect">
                        <template #icon>
                            <mail-outlined />
                        </template>
                        收藏夹
                    </a-menu-item>
                </a-menu>
            </a-col>
            <a-col :span="3" style="text-align: center; line-height: 46px;">
                <a-button type="primary" @click="RouterNoteEditor"><plus-outlined />创建笔记</a-button>
            </a-col>
        </a-row>
        <router-view></router-view>
    </div>
</template>


<script setup>
import { defineComponent, ref } from 'vue';
import { MailOutlined, PlusOutlined, CalendarOutlined, AppstoreOutlined, SettingOutlined, createFromIconfontCN } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
const router = useRouter()
const MyIcon = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/c/font_4158111_1ruumo6bmni.js', // 在 iconfont.cn 上生成
});
const RouterNoteShow = () => {
    router.push({ name: 'noteshow' })
}

const RouterNoteBookShow = () => {
    router.push({ name: 'notebook' })
}
const RouterNoteEditor = () => {
    router.push({ name: 'noteeditor', params: { _id: 'new' } })
}
const RouterNoteCollect = () => {
    router.push({ name: 'notecollect' })
}
const RouterNoteUpdate = () => {
    router.push({ name: 'notetime' })
}
</script>


<style scoped>
.year-content {
    margin-top: 20px;
}

.note-content {
    width: 84%;
    margin: 0px auto;
    margin-bottom: 20px;
    /* border: 1px solid black; */
}

.notebook-content {}

.notebook-content ul {
    list-style: none;
    margin: 0px;
    padding: 0px;
}

.notebook-content li {
    height: 40px;
    line-height: 40px;
    cursor: pointer;
}

.notebook-content li:hover {
    background-color: rgb(230, 247, 255);
}

.tag-content {
    margin-top: 20px;
}

.recent-content {
    margin-top: 20px;
}

.recent-content ul {
    list-style: none;
    margin: 0px;
    padding: 0px;
}

.recent-content li {
    margin-top: 5px;
}
</style>
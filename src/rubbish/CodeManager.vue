<template>
    <div class="code-manager">
        <a-layout>
            <a-layout-sider v-model:collapsed="codeCollapsed" :trigger="null" style="transition: all 0s;" collapsible="true"
                :width="150" theme="light">
                <div class="code-sider-content">
                    <div class="code-classify">
                        <a-menu>
                            <a-menu-item :key="1" :title="收藏区" @click="showcollect">
                                <template #icon>
                                    <star-outlined />
                                </template>
                                <span>收藏区</span>
                            </a-menu-item>
                            <a-menu-item :key="4" :title="所有区" @click="showcode">
                                <template #icon>
                                    <appstore-outlined />
                                </template>
                                <span>所有区</span>
                            </a-menu-item>
                        </a-menu>
                    </div>
                    <div class="code-file">
                        <a-tree v-if="ShowArrowsRight" blockNode="true" v-model:selectedKeys="selectedKeys"
                            :tree-data="treeData" show-icon default-expand-all>
                            <!-- <template #switcherIcon="{ switcherCls }"><down-outlined :class="switcherCls" /></template> -->
                            <template #icon="{ _id, selected }">
                                <template v-if="_id === '0-0'">

                                </template>
                                <template v-else>
                                    <folder-outlined />
                                </template>

                            </template>
                            <template #title="{ _id, storeName }">
                                <template v-if="_id == '0-0'">
                                    <a-space :size="25">
                                        <span style="font-size: 18px;">{{ storeName }}</span>
                                        <span style="font-size: 12px;"><right-outlined /></span>
                                    </a-space>

                                </template>
                                <template v-else>
                                    <span style="font-size: 16px; " @click="RouterCodeShow(_id)">
                                        <a-tooltip>
                                            <template #title>{{ storeName }}</template>
                                            {{ storeName.length > 5 ? storeName.slice(0,
                                                4) + '...' : storeName }}
                                        </a-tooltip>
                                    </span>
                                </template>
                            </template>

                        </a-tree>
                        <div v-if="!ShowArrowsRight">
                            <a-popover trigger="hover" placement="rightTop">
                                <template #title>
                                    <a-space>
                                        <span style="font-size: 15px ;font-weight:600;">代码库</span>
                                        <span><right-outlined /></span>
                                    </a-space>

                                </template>
                                <template #content>
                                    <a-button type="text" block="true">代码库1</a-button>
                                </template>
                                <div style="text-align: center;">
                                    <folder-open-outlined />
                                </div>
                            </a-popover>


                        </div>
                    </div>
                    <div class="logo-arrows-right" @click="hidderLayoutSider" v-if="ShowArrowsRight">
                        <caret-left-outlined />
                    </div>
                    <div class="logo-arrows-left" @click="showLayoutSider" v-if="!ShowArrowsRight">
                        <caret-right-outlined />
                    </div>
                </div>


            </a-layout-sider>

            <a-layout-content style="padding-left: 0px;">
                <router-view></router-view>
            </a-layout-content>

        </a-layout>
    </div>
</template>

<script setup>
import { StarOutlined, PlusOutlined, SearchOutlined, FolderOpenOutlined, FolderOutlined, RightOutlined, SmileOutlined, SettingOutlined, AppstoreOutlined, UserOutlined, GoldOutlined, CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons-vue';
import { ref, reactive, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { FindAllStoreAPI } from '../../../api/clientApi';
import { DownOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import { slice } from 'lodash-es';
onMounted(() => {
    FindAllStoreAPI({ userId: '1' }).then(res => {
        res.data.forEach(item => {
            treeData.value[0].children.push(item)
        })
        console.log(treeData.value);

    })
})
const router = useRouter()
const codeCollapsed = ref(false)

//获取到的ace编辑器的值
const aceEditorValue = ref()
const showLayoutSider = () => {
    codeCollapsed.value = false
    ShowArrowsRight.value = true

}
const hidderLayoutSider = () => {
    codeCollapsed.value = true
    ShowArrowsRight.value = false

}
const ShowArrowsRight = ref(true)


//文件目录树
const expandedKeys = ref(['0-0-0']);
const selectedKeys = ref([]);
const treeData = ref([{
    storeName: '代码库',
    _id: '0-0',
    children: [],
}]);


const selectShow = () => {
    console.log("输出点击啦");

}

const showcode = () => {
    router.push({ name: 'codestoreshow' })
}
const showcollect = () => {
    router.push({ name: 'codecollect' })
}

const RouterCodeShow = (_id) => {
    console.log("点击啦吗");

    router.push({ name: 'codeshow', params: { _id: _id } });
}
</script>

<style>
.code-manager {}

.code-file {
    margin-top: 20px;
}

.code-file .ant-tree.ant-tree-block-node .ant-tree-list-holder-inner .ant-tree-node-content-wrapper {
    height: 30px;
}

.code-file .ant-tree-switcher-noop {
    display: none;
}

.code-file .ant-tree .ant-tree-treenode {
    margin-bottom: 3px;
}

.code-sider-content {
    position: relative;
    height: 660px;
}

.code-sider-content:hover .logo-arrows-right {
    display: block;
}

.code-sider-content:hover .logo-arrows-left {
    display: block;
}

.logo-arrows-right {
    position: absolute;
    width: 12px;
    height: 45px;
    top: 220px;
    left: 135px;
    text-align: center;
    line-height: 40px;
    background-color: rgb(250, 250, 250);
    border-radius: 5px;
    display: none;
}

.logo-arrows-left {
    position: absolute;
    width: 12px;
    height: 45px;
    top: 220px;
    left: 68px;
    text-align: center;
    line-height: 40px;
    background-color: rgb(250, 250, 250);
    border-radius: 5px;
    display: none;
}
</style>
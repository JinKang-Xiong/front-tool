<template>
    <a-layout>
        <a-layout-header>
            <a-row>
                <a-col :span="1" @click="showDrawer">
                    <menu-unfold-outlined
                        style="font-size: 27px; margin-top: 20px; margin-left: 15px;"></menu-unfold-outlined>
                </a-col>
                <a-col :span="2" :xl="2" :lg="4" :md="4" :xs="5"><span
                        style="font-size: 18px;cursor: pointer;; font-weight: 600;"
                        @click="RouterMyHome">前端工具箱</span></a-col>
                <a-col :span="12" offset="2">
                    <!-- <a-input-search style="margin-top: 15px;" v-model:value="value"
                        placeholder="input search text" enter-button @search="onSearch" /></a-col> -->
                    <a-space>
                        <a-select v-model:value="searchValue" show-search placeholder="请输入你要搜索的标题或标签"
                            style="width: 600px;" :default-active-first-option="false" :show-arrow="false"
                            :filter-option="false" :not-found-content="null" @search="handleSearch"
                            @change="handleChange">
                            <template #suffixIcon><search-outlined /></template>
                            <a-select-option v-for="(option, index) in searchData" :key="option.value"
                                :value="option.value">
                                <a-row>
                                    <a-col :span="20">{{ option.label }}</a-col>
                                </a-row>
                            </a-select-option>

                        </a-select>
                        <a-select ref="select" v-model:value="searchType" style="width: 100px" @focus="focus">
                            <a-select-option :value="0">代码</a-select-option>
                            <a-select-option :value="1">书籍</a-select-option>
                            <a-select-option :value="2">笔记</a-select-option>
                        </a-select>
                    </a-space>
                </a-col>
                <a-col :span="3" offset="4">
                    <a-space :size="15">
                        <div>
                            <a-dropdown>
                                <a-badge :dot="dotshow">
                                    <a-button shape="round">
                                        <plus-outlined />
                                        <caret-down-outlined />
                                    </a-button>
                                </a-badge>
                                <template #overlay>
                                    <a-menu>
                                        <a-menu-item>
                                            <a href="javascript:;" @click="RouterPersonal">个人中心</a>
                                        </a-menu-item>
                                        <a-badge :dot="dotshow">
                                            <a-menu-item>
                                                <a href="javascript:;" @click="RouterMessage">系统通知</a>
                                            </a-menu-item> </a-badge>

                                        <a-menu-item>
                                            <a href="javascript:;" @click="UserLoginOut">退出登录</a>
                                        </a-menu-item>
                                    </a-menu>
                                </template>
                            </a-dropdown>
                        </div>
                        <a-avatar :src="'/api' + counter.clientlogin.avatarUrl">
                            <template #icon>
                                <UserOutlined />
                            </template>
                        </a-avatar>
                    </a-space>
                </a-col>
            </a-row>
            <a-drawer v-model:visible="visibleDrawer" class="custom-class" style="" title="前端工具箱" placement="left"
                @after-visible-change="afterVisibleChange" width="319px" :closable="false">
                <a-list style="font-size: 15px;">
                    <a-list-item @click="RouterMyHome" style="cursor: pointer;">
                        <a-space :size="10">
                            <home-outlined />
                            首页
                        </a-space>
                    </a-list-item>
                    <a-list-item @click="routerMemo" style="cursor: pointer;">
                        <a-space :size="10">
                            <coffee-outlined />
                            备忘录
                        </a-space>
                    </a-list-item>
                    <a-list-item @click="routerCode" style="cursor: pointer;">
                        <a-space :size="10">
                            <code-outlined />
                            代码片段库
                        </a-space>
                    </a-list-item>
                    <a-list-item>
                        <a-space :size="10" @click="routerPicture" style="cursor: pointer;">
                            <picture-outlined />
                            我的图库
                        </a-space>
                    </a-list-item>
                    <a-list-item>
                        <a-space :size="10" @click="routerBook" style="cursor: pointer;">
                            <read-outlined />
                            书库
                        </a-space>
                    </a-list-item>
                    <a-list-item>
                        <a-space :size="10" @click="routerNote" style="cursor: pointer;">
                            <reconciliation-outlined />
                            笔记库
                        </a-space>
                    </a-list-item>
                    <!-- <a-list-item>
                        <a-space :size="10" @click="routerSearch" style="cursor: pointer;">
                            <search-outlined />
                            公共搜索
                        </a-space>
                    </a-list-item> -->
                </a-list>
                <template #extra>
                    <a-button shape="circle" type="text" @click="cancelDrawer">
                        <close-outlined />
                    </a-button>
                </template>
            </a-drawer>
        </a-layout-header>
        <a-layout-content>
            <router-view @messageShow="fetchmessageStatus"></router-view>
        </a-layout-content>
        <!-- <a-layout-footer>Footer</a-layout-footer> -->
    </a-layout>
</template>

<script setup>
import { MenuUnfoldOutlined, ReconciliationOutlined, HomeOutlined, SearchOutlined, CodeOutlined, CoffeeOutlined, DatabaseOutlined, UserOutlined, PlusOutlined, CaretDownOutlined, CloseOutlined, ReadOutlined, PictureOutlined } from '@ant-design/icons-vue';
import { ref, onMounted, inject } from 'vue';
import { SearchByCodeAPI, FindAllMessageStatusAPI } from '../../api/clientApi.js'
import { useRouter } from 'vue-router';
import { useclientStore } from '../../stores/count.js'
const counter = useclientStore()
const router = useRouter()
onMounted(() => {
    fetchmessageStatus()
})
const visibleDrawer = ref(false)
const showDrawer = () => {
    visibleDrawer.value = true
}
const cancelDrawer = () => {
    visibleDrawer.value = false
}
const routerMemo = () => {
    visibleDrawer.value = false
    router.push('/client/home/memo')
}
const routerCode = () => {
    visibleDrawer.value = false
    router.push('/client/home/code/codestoreshow')
}
const routerPicture = () => {
    visibleDrawer.value = false
    router.push('/client/home/picture')
}
const routerBook = () => {
    visibleDrawer.value = false
    router.push('/client/home/book')
}
const routerNote = () => {
    visibleDrawer.value = false
    router.push('/client/home/note/noteshow')
}
const RouterPersonal = () => {
    router.push('/client/home/personalcenter')
}
const RouterMessage = () => {
    router.push('/client/home/messagecenter')
}
const routerSearch = () => {
    visibleDrawer.value = false
    router.push('/client/home/mysearch')
}
const RouterMyHome = () => {
    visibleDrawer.value = false
    router.push('/client/home/myhome')
}

const UserLoginOut = () => {
    localStorage.removeItem('tokenuser')
    counter.clientlogin = {}
    router.push('/client/login')
}

const messageStatus = ref([])
const dotshow = ref(false)
const fetchmessageStatus = () => {
    FindAllMessageStatusAPI({ userId: counter.clientlogin.id }).then(res => {
        if (res.code == 0) {
            console.log('执行触发函数')
            dotshow.value = false
            messageStatus.value = [...res.data]
            res.data.forEach(item => {
                if (item.messageStatus == 0) {
                    dotshow.value = true
                }
            })
        }
    })
}

const searchValue = ref()
const searchData = ref([])
const searchType = ref(0)

const handleSearch = (value) => {
    console.log('搜索1')
    switch (searchType.value) {
        case 0:
            let data = []
            data.push({
                value: value + ',' + 'keyId' + ',' + searchType.value,
                label: value,
                codeTag: '',
                title: value
            })
            // res.data.forEach(item => {
            //     data.push({
            //         value: item.codeList.codeuuid + ',' + item._id,
            //         label: item.codeList.codeTitle,
            //         title: item.codeList.codeTitle,
            //         codeTag: item.codeList.codeTag
            //     })
            // })
            searchData.value = [...data]
            break;
        case 1:
            searchData.value = [{
                value: value + ',' + searchType.value,
                label: value
            }]
            break;
        case 2:
            searchData.value = [{
                value: value + ',' + searchType.value,
                label: value
            }]
            break;


    }

}
const handleChange = (value) => {
    console.log('搜索2')
    switch (searchType.value) {
        case 0:
            const IdArr = value.split(',')
            if (IdArr[1] == 'keyId') {
                router.push({ name: 'searchpublic', params: { searchByCodeValue: IdArr[0] } })
            } else {
                router.push({ name: 'searchresult', params: { _id: IdArr[1], codeuuid: IdArr[0] } })
            }
            break;
        case 1:
            const IdArr2 = value.split(',')
            router.push({ name: 'searchpublicbook', params: { inputValue: IdArr2[0] } })
            break;
        case 2:
            const IdArr3 = value.split(',')
            router.push({ name: 'searchpublicnote', params: { inputValue: IdArr3[0] } })
            break;
    }


}
//#endregion

</script>

<style>
.ant-layout-header,
.ant-layout-content {
    background: white;
    padding: 0 25px;
}
</style>
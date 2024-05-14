<template>
    <div class="picture-content">
        <div class="picture-title">
            <a-divider style=""> <a-typography-title :level="3">私人图库</a-typography-title></a-divider>
        </div>
        <a-row>
            <a-col :span="2" offset="22">
                <a-button type="primary" @click="addStorePictureModal"><plus-outlined />新建图库</a-button>
            </a-col>
            <a-modal v-model:visible="visibleAddStorePicture" title="新建图库" @ok="handleOkAddStorePicture" okText="确定"
                cancelText="取消">
                <p>图库名称</p>
                <a-input v-model:value="AddStoreName" placeholder="如：动漫图库" />
                <p>图库简介</p>
                <a-textarea v-model:value="AddStoreDescription" placeholder="如：关于首页轮播的动漫网站元素" :rows="3" />
            </a-modal>
        </a-row>
        <div class="picture-store-list">
            <a-card hoverable style="width: 300px;margin-left: 35px; margin-top: 20px; height: 250px;"
                v-for="(item, index) in  StorePictureList " :key="index" @click="RouterPictureShow(item._id)">
                <template #cover>
                    <img style="width: 300px; height: 182px;" v-if="item.pictureList.length != 0" alt="example"
                        :src="item.pictureList[0].pictureUrl" />
                    <a-empty v-if="item.pictureList.length == 0"
                        image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
                        :image-style="{
                            height: '146px',
                            margin: '0px'
                        }" description="暂无图片" />
                    <!-- <img alt="example" 
                        src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" /> -->
                </template>
                <a-card-meta>
                    <template #description>
                        <a-row>
                            <a-col :span="8">
                                <a-tooltip :title="item.storeName">
                                    <a-typography-text :ellipsis="true" :content="item.storeName" type="secondary">

                                    </a-typography-text>
                                </a-tooltip>

                                <!-- <span>
                                    {{ item.storeName.length > 5 ? item.storeName.slice(0, 5) + '...' : item.storeName }}
                                </span> -->
                            </a-col>
                            <a-col :span="4" offset="11">
                                <picture-outlined /> <span>{{ item.pictureList.length }}</span>
                            </a-col>
                        </a-row>
                    </template>
                </a-card-meta>
            </a-card>
        </div>
    </div>
</template>

<script setup>
import { PlusOutlined, PictureOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import { AddStorePictureAPI, FindAllStorePictureAPI } from '../../../api/clientApi.js'
import { message, Empty } from 'ant-design-vue';
import { ref, onMounted } from 'vue';
import { useclientStore } from '../../../stores/count.js'

const counter = useclientStore()
const router = useRouter()

onMounted(() => {
    fethStore({ userId: counter.clientlogin.id })
})

const RouterPictureShow = (_id) => {
    router.push({ name: 'pictureshow', params: { _id: _id } })
}

//新建图库
const visibleAddStorePicture = ref(false)
const AddStoreName = ref()
const AddStoreDescription = ref()
const addStorePictureModal = () => {
    visibleAddStorePicture.value = true
}

const handleOkAddStorePicture = () => {
    AddStorePictureAPI({ storeName: AddStoreName.value, storeDescription: AddStoreDescription.value, userId: counter.clientlogin.id }).then(res => {
        if (res.code == 0) {
            message.success('新建成功')
            visibleAddStorePicture.value = false
            AddStoreName.value = null
            AddStoreDescription.value = null
            fethStore({ userId: counter.clientlogin.id })
        }
    })
}

const StorePictureList = ref()
let simpleImage = Empty.PRESENTED_IMAGE_SIMPLE
const fethStore = (query) => {
    FindAllStorePictureAPI(query).then(res => {
        if (res.code == 0) {
            StorePictureList.value = res.data
        }
    })
}

</script>

<style>
.picture-title {
    width: 100%;
    height: 60px;
    text-align: center;
    line-height: 60px;
}

.picture-store-list {
    display: flex;
    flex-wrap: wrap;
    width: 1400px;
    margin: 30px auto;
    border-top: 1px solid grey;
}

.picture-store-list .ant-empty-normal {
    margin: 0px;
}
</style>
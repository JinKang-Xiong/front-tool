<template>
    <div class="codecollect-content">
        <a-row>
            <a-col :span="2">
                <a-button type="primary" @click="visibleAddCollect = true">新建收藏夹</a-button>
            </a-col>
            <a-modal v-model:visible="visibleAddCollect" title="新建收藏夹" @ok="handleOkAddCollect" okText="确定" cancelText="取消">
                <p>名称</p>
                <a-input v-model:value="AddCollectName" placeholder="如：默认收藏夹" />
                <p>简介</p>
                <a-textarea v-model:value="AddCollectDescription" placeholder="如：关于开发页面的组件代码" :rows="3" />
            </a-modal>
        </a-row>
        <a-list item-layout="vertical" :data-source="CollectListData">
            <template #renderItem="{ item, index }">
                <a-list-item>
                    <a-list-item-meta :description="item.collectDescription" style="margin-top: 10px;">
                        <template #title>
                            <a @click="RouterCollectShow(item._id, item.userId, item.collectName)">{{ item.collectName
                            }}</a>
                        </template>
                    </a-list-item-meta>
                    <template #actions>
                        <div style="height: 32px; line-height: 32px;">
                            <a-typography-text type="secondary">{{ item.updateTime }} </a-typography-text>
                            <a-space style="margin-left: 600px;">
                                <a-button type="text" @click="editCollect(item)">编辑</a-button>

                                <a-popconfirm title="确定删除吗？" ok-text="确定" cancel-text="取消"
                                    @confirm="confirmDelete(item._id, item.userId)" @cancel="cancel">
                                    <a-button type="text" danger>删除</a-button>
                                </a-popconfirm>
                            </a-space>
                        </div>

                    </template>
                </a-list-item>

            </template>
            <a-modal v-model:visible="visibleEdit" title="编辑收藏夹" @ok="handleOkEdit()" okText="确定" cancelText="取消">
                <a-row type="flex" justify="center" align="top">
                    <a-col :span="3" style="text-align: center;"> <span>名称：</span></a-col>
                    <a-col :span="20">
                        <a-input v-model:value="collectName" style="width: 400px;"></a-input>
                    </a-col>
                </a-row>
                <a-row type="flex" justify="center" align="top" style="margin-top: 15px;">
                    <a-col :span="3" style="text-align: center;"> <span>简介： </span></a-col>
                    <a-col :span="20">
                        <a-textarea style="width: 400px;" v-model:value="collectDescription" show-count :maxlength="100" />
                    </a-col>

                </a-row>
            </a-modal>
        </a-list>
    </div>
</template>
    


<script setup>
import { FindCollectByUserAPI, UpdateNameAndDescAPI, DeleteCollectAPI, CollectAddAPI } from '../../../api/clientApi.js'
import { onMounted, ref } from 'vue';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import { useclientStore } from '../../../stores/count.js'

const counter = useclientStore()
const router = useRouter()
onMounted(() => {
    fetchCollect({ userId: counter.clientlogin.id })
})

const CollectListData = ref([])
const fetchCollect = (query) => {
    FindCollectByUserAPI(query).then(res => {
        if (res.code == 0) {
            res.data.forEach(item => {
                let data = new Date(item.updateTime)
                item.updateTime = data.getFullYear() + '-' + (data.getMonth() + 1) + '-' + data.getDate()

            })
            CollectListData.value = [...res.data]
        }
    })
}


const showOption = ref()
const showEdit = (index) => {
    showOption.value = index
}
const hiddenEdit = () => {
    showOption.value = -1
}

const RouterCollectShow = (_id, userId, collectName) => {
    router.push({ name: 'collectshow', params: { _id, userId, collectName } })
}

const visibleEdit = ref()
const collectName = ref()
const collectDescription = ref()
const _id = ref()

const editCollect = (item) => {
    collectName.value = item.collectName
    collectDescription.value = item.collectDescription
    _id.value = item._id
    visibleEdit.value = true
}
const handleOkEdit = () => {
    console.log(_id.value)
    UpdateNameAndDescAPI({ _id: _id.value, userId: counter.clientlogin.id, collectName: collectName.value, collectDescription: collectDescription.value }).then(res => {
        if (res.code == 0) {
            message.success('修改成功')
            visibleEdit.value = false
            fetchCollect({ userId: counter.clientlogin.id })
        }
    })
}



const confirmDelete = (_id, userId) => {
    DeleteCollectAPI({ _id, userId }).then(res => {
        if (res.code == 0) {
            message.success('删除成功')
            fetchCollect({ userId: counter.clientlogin.id })
        }
    })
}

//新建收藏夹
const visibleAddCollect = ref(false)
const AddCollectName = ref()
const AddCollectDescription = ref()
const handleOkAddCollect = () => {
    CollectAddAPI({ userId: counter.clientlogin.id, collectName: AddCollectName.value, collectDescription: AddCollectDescription.value }).then(res => {
        if (res.code == 0) {
            visibleAddCollect.value = false
            fetchCollect({ userId: counter.clientlogin.id })
        }
    })
}


</script>

<style scoped>
.codecollect-content {
    width: 70%;
    margin-left: 30px;
}
</style>
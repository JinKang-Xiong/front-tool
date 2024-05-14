<template>
    <div class="notebookshow-content">
        <a-card hoverable style="width: 180px;height: 212px; margin-left: 20px; margin-top: 10px;"
            v-for="(item, index) in notebookState ">
            <template #actions>
                <a-button type="text"> <edit-outlined key="edit" @click="editNoteBook(item)" /></a-button>
                <a-button type="text" :disabled="item.isDefault == 1 ? true : false">
                    <a-popconfirm title="确定删除吗" ok-text="确定" cancel-text="取消" @confirm="deleteNoteBook(item)"
                        @cancel="cancel">
                        <close-outlined style="color: red;" />
                    </a-popconfirm>

                </a-button>
                <!-- <ellipsis-outlined key="ellipsis" /> -->
            </template>
            <a-card-meta :description="item.notebookDescription" style="height: 120px;">
                <template #title>
                    <a @click="RouterSelfItem(item._id)">{{ item.notebookName }}</a>
                </template>
                <template #avatar>
                    <MyIcon type="icon--biji" style="font-size: 23px;"></MyIcon>
                </template>
            </a-card-meta>
        </a-card>
        <div class="addnotebook">
            <div class="add-plus" @click="addNoteShowModel">
                <plus-outlined style="font-size: 25px;" />
                <p>增加笔记本</p>
            </div>

        </div>
        <a-modal v-model:visible="visibleAddNoteBook" title="创建笔记本" @ok="handleOk" okText="确定" cancelText="取消">
            <a-form :model="formState">
                <a-form-item name="notebookName" label="笔记本名称">
                    <a-input v-model:value="formState.notebookName" placeholder="请输入笔记名称"></a-input>
                </a-form-item>
                <a-form-item name="notebookDescription" label="笔记本简介">
                    <a-input v-model:value="formState.notebookDescription" placeholder="请输入笔记简介"></a-input>
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script setup>
import { SettingOutlined, EditOutlined, CloseOutlined, PlusOutlined, EllipsisOutlined, createFromIconfontCN } from '@ant-design/icons-vue';
import { FindAllNoteBookAPI, AddNoteBookAPI, UpdateNoteBookAPI, DeleteNoteBookAPI } from '../../../api/clientApi.js'
import { ref, onMounted, reactive } from 'vue'
import { message } from 'ant-design-vue';
import { useclientStore } from '../../../stores/count.js'
import { useRouter } from 'vue-router';

const router = useRouter()
const counter = useclientStore()
const MyIcon = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/c/font_4158111_1ruumo6bmni.js', // 在 iconfont.cn 上生成
});
onMounted(() => {
    fetchnotebook({ userId: counter.clientlogin.id, isDefault: 0 })
})
//查询用户全部的笔记本
const notebookState = ref([])
const fetchnotebook = (query) => {
    FindAllNoteBookAPI(query).then(res => {
        if (res.code == 0) {
            notebookState.value = [...res.data]
        }
    })
}

//增加用户笔记的功能
const addNoteShowModel = () => {
    visibleAddNoteBook.value = true
    formState.notebookName = ''
    formState.notebookDescription = ''
}
const visibleAddNoteBook = ref(false)
const formState = reactive({
    notebookName: '',
    notebookDescription: ''
})

const handleOk = () => {
    if (notebookId.value) {
        UpdateNoteBookAPI({ _id: notebookId.value, userId: counter.clientlogin.id, notebookName: formState.notebookName, notebookDescription: formState.notebookDescription }).then(res => {
            if (res.code == 0) {
                message.success('修改成功')
                fetchnotebook({ userId: counter.clientlogin.id, isDefault: 0 })
                visibleAddNoteBook.value = false
                notebookId.value = null
            }
        })
    } else {
        AddNoteBookAPI({ userId: counter.clientlogin.id, notebookName: formState.notebookName, notebookDescription: formState.notebookDescription, isDefault: 0 }).then(res => {
            if (res.code == 0) {
                message.success('增加成功')
                fetchnotebook({ userId: counter.clientlogin.id, isDefault: 0 })
                visibleAddNoteBook.value = false
            }
        })
    }

}

//修改笔记本
const notebookId = ref()
const editNoteBook = (item) => {
    visibleAddNoteBook.value = true
    notebookId.value = item._id
    formState.notebookName = item.notebookName
    formState.notebookDescription = item.notebookDescription
}

//删除笔记本
const deleteNoteBook = (item) => {
    notebookId.value = item._id
    DeleteNoteBookAPI({ _id: notebookId.value }).then(res => {
        if (res.code == 0) {
            if (res.data == '删除失败') {
                message.error('无法删除')
                return
            }
            message.success('删除成功')
            notebookId.value = null
            fetchnotebook({ userId: counter.clientlogin.id, isDefault: 0 })

        }
    })
}

const RouterSelfItem = (_id) => {
    router.push({ name: 'notebookitemshow', params: { _id } })
}

</script>

<style scoped>
.add-plus {
    width: 80px;
    height: 80px;
    margin: 80px auto;
    text-align: center;
}

.notebookshow-content {
    padding: 15px;
    display: flex;
    flex-wrap: wrap;
}

.addnotebook {
    width: 180px;
    height: 212px;
    border: 1px dashed black;
    margin-top: 10px;
    margin-left: 20px;
}
</style>
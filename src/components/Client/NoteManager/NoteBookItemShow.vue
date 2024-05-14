<template>
    <a-list itemLayout="vertical" size="large" :data-source="noteList" :pagination="pagination" v-if="noteList">
        <template #renderItem="{ item }">
            <a-list-item>
                <a-list-item-meta>
                    <template #title>
                        <a @click="RouterNoteRead(item._id)">{{ item.noteName }}</a>
                    </template>
                    <template #avatar>
                        <my-icon type="icon-biji1" style="font-size: 27px;"></my-icon>
                    </template>
                </a-list-item-meta>
                <template #actions>
                    <div>
                        <calendar-outlined /> {{ item.createTime }}
                    </div>
                    <div>
                        <a-tag>{{ item.isPartPublic == 1 ? '公开性' : '私有性' }}</a-tag>
                        <a-tag v-for="el in item.noteTag">{{ el }}</a-tag>

                    </div>
                </template>
                <template #extra>
                    <a-button type="text" @click="RouterEditNote(item._id)">编辑</a-button>
                    <a-button type="text" danger>删除</a-button>
                </template>
            </a-list-item>
        </template>
    </a-list>
</template>

<script setup>
import { FindNoteByNoetBookAPI } from '../../../api/clientApi.js'
import { MailOutlined, PlusOutlined, CalendarOutlined, AppstoreOutlined, SettingOutlined, createFromIconfontCN } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router'
import { ref, defineProps, onMounted, reactive } from 'vue'
const router = useRouter()
const props = defineProps(['_id'])
const MyIcon = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/c/font_4158111_1ruumo6bmni.js', // 在 iconfont.cn 上生成
});
onMounted(() => {
    searchByNoteBook(props._id, pageSize.value, pageNumber.value)
})


const pageSize = ref(5)
const pageNumber = ref(1)
const total = ref(0)
const noteList = ref([])
const searchByNoteBook = (_id, pageSize, pageNumber, index) => {
    // notebookColor.value = index
    // pagetype.value = 'notebook'
    // pageId.value = _id
    // notetagColor.value = -1
    // noteyearColor.value = -1
    FindNoteByNoetBookAPI({ _id, pageNumber: pageNumber, pageSize: pageSize }).then(res => {
        noteList.value = [...res.data.note]
        total.value = res.data.total
        pagination.total = total.value
    })
}

const pagination = reactive({
    onChange: page => {
        searchByNoteBook(props._id, pageSize.value, page)
    },
    pageSize: pageSize.value,
    total: total.value
})

const RouterNoteRead = (_id) => {
    router.push({ name: 'noteread', params: { _id } })
}

const RouterEditNote = (_id) => {
    router.push({ name: 'noteeditor', params: { _id } })
}
</script>
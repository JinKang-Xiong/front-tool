<template>
    <div>
        <a-row style="margin-top: 20px;">
            <a-col :span="5" style="padding-left: 5px;">
                <a-row style="margin-bottom: 20px; margin-top: 5px;">
                    <a-col :span="22">
                        <a-input-search v-model:value="searchValue" placeholder="请输入笔记名" style="width: 200px"
                            @search="onSearch" />
                    </a-col>
                </a-row>
                <div class="notebook-content">
                    <a-typography-title :level="5">笔记本</a-typography-title>
                    <hr>
                    <ul>
                        <li :style="{ backgroundColor: notebookColor == -1 ? 'rgb(230,247,255)' : '' }"
                            @click="showAllNote">全部笔记
                        </li>
                        <li :style="{ backgroundColor: notebookColor == index ? 'rgb(230, 247, 255)' : '' }"
                            v-for="(item, index) in notebookState"
                            @click="searchByNoteBook(item._id, pageSize, pageNumber, index)">
                            {{ item.notebookName }}</li>
                    </ul>
                </div>
                <div class="tag-content">
                    <a-typography-title :level="5">标签</a-typography-title>
                    <hr>
                    <a-tag v-for="(item, index) in noteTag" @click="searchByNoteTag(item, pageSize, pageNumber, index)"
                        :color="notetagColor == index ? '#108ee9' : ''">{{ item }}</a-tag>
                </div>
                <div class="recent-content">
                    <a-typography-title :level="5">常用笔记</a-typography-title>
                    <hr>
                    <ul>
                        <li v-for="item in openData" @click="RouterOpenRead(item._id, item.openNumber)">{{ item.noteName }}
                        </li>
                    </ul>
                </div>
                <div class="year-content">
                    <a-typography-title :level="5">笔记年份</a-typography-title>
                    <hr>
                    <a-tag v-for="(item, index) in noteyear" @click="searchByNoteYear(item, pageSize, pageNumber, index)"
                        :color="noteyearColor == index ? '#108ee9' : ''">{{ item }}</a-tag>
                </div>
            </a-col>
            <a-col :span="19">
                <a-list itemLayout="vertical" size="large" :data-source="noteList" :pagination="pagination" v-if="noteList">
                    <template #renderItem="{ item }">
                        <a-list-item>
                            <a-list-item-meta>
                                <template #title>
                                    <a @click="RouterNoteRead(item._id, item.openNumber)">{{ item.noteName }}</a>
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
                                    <a-tag v-if="item.isPartPublic == 0">私有性</a-tag>
                                    <a-tag v-if="item.isPartPublic == 1">公有性</a-tag>
                                    <a-tag v-if="item.isPartPublic == 2">监控中</a-tag>
                                    <a-tag v-for="el in item.noteTag">{{ el }}</a-tag>

                                </div>
                            </template>
                            <template #extra>
                                <a-button type="text" @click="RouterEditNote(item._id)">编辑</a-button>
                                <a-popconfirm title="真的要删除吗？" ok-text="确定" cancel-text="取消" @confirm="deleteNote(item._id)"
                                    @cancel="cancel">
                                    <a-button type="text" danger>删除</a-button>
                                </a-popconfirm>
                            </template>
                        </a-list-item>
                    </template>
                </a-list>
            </a-col>
        </a-row>
    </div>
</template>
<script setup>
import { defineComponent, ref, onMounted, reactive } from 'vue';
import { MailOutlined, PlusOutlined, CalendarOutlined, AppstoreOutlined, SettingOutlined, createFromIconfontCN } from '@ant-design/icons-vue';
import { FindAllNoteAPI, UpdateOpenAPI, FindByOpenAPI, DeleteNoteAPI, FindNoteByName, FindByNoteYearAPI, FindAllNoteBookAPI, FindNoteByNoetBookAPI, FindNoteByNoteTagAPI, FindNoteTagAPI, FindNoteYearAPI } from '../../../api/clientApi.js'
import { useRouter } from 'vue-router';
import { FindTagAPI } from '../../../api/clientApi.js';
import { useclientStore } from '../../../stores/count.js'
import { message } from 'ant-design-vue';

const counter = useclientStore()
const router = useRouter()
const MyIcon = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/c/font_4158111_1ruumo6bmni.js', // 在 iconfont.cn 上生成
});
onMounted(() => {
    fetchnote({ userId: counter.clientlogin.id, pageNumber: pageNumber.value, pageSize: pageSize.value })
    fetchnotebook({ userId: counter.clientlogin.id, isDefault: 0 })
    fetchtag({ userId: counter.clientlogin.id })
    fetchyear({ userId: counter.clientlogin.id })
    fetchopen({ userId: counter.clientlogin.id })
})


const RouterNoteRead = (_id, openNumber) => {
    UpdateOpenAPI({ _id, openNumber }).then(res => {
        if (res.code == 0) {
            router.push({ name: 'noteread', params: { _id } })
        }
    })
}

const RouterOpenRead = (_id, openNumber) => {
    UpdateOpenAPI({ _id, openNumber }).then(res => {
        if (res.code == 0) {
            router.push({ name: 'noteread', params: { _id } })
        }
    })
}

//#region 笔记的各种搜索功能
const searchValue = ref()
const onSearch = () => {
    FindNoteByName({ name: searchValue.value, userId: counter.clientlogin.id }).then(res => {
        if (res.code == 0) {
            noteList.value = [...res.data]
        }
    })
}

/**
 * all-全部
 * tag-标签
 * notebook-笔记本
 * year-年份
 * 
 */
const pagetype = ref('all')
const pageId = ref()
const pagetag = ref()
const pageyear = ref()
const notebookColor = ref()
const notetagColor = ref()
const noteyearColor = ref()
//根据标签搜索笔记
const searchByNoteTag = (name, pageSize, pageNumber, index) => {
    pagetype.value = 'tag'
    notetagColor.value = index
    pagetag.value = name
    notebookColor.value = -1
    noteyearColor.value = -1
    notebookColor.value = -2
    FindNoteByNoteTagAPI({ tag: name, pageSize, pageNumber, userId: counter.clientlogin.id }).then(res => {
        if (res.code == 0) {
            noteList.value = [...res.data.note]
            total.value = res.data.total
            pagination.total = total.value
        }
    })

}

//根据年份搜索
const searchByNoteYear = (yearValue, pageSize, pageNumber, index) => {
    pagetype.value = 'year'
    noteyearColor.value = index
    pageyear.value = yearValue
    notebookColor.value = -1
    notetagColor.value = -1
    notebookColor.value = -2
    FindByNoteYearAPI({ yearValue, pageSize, pageNumber, userId: counter.clientlogin.id }).then(res => {
        if (res.code == 0) {
            noteList.value = [...res.data.note]
            total.value = res.data.total
            pagination.total = total.value
        }
    })


}

//根据笔记本搜索笔记
const showAllNote = () => {
    pagetype.value = 'all'
    notebookColor.value = -1
    notetagColor.value = -1
    noteyearColor.value = -1
    fetchnote({ userId: counter.clientlogin.id, pageNumber: pageNumber.value, pageSize: pageSize.value })
}
const searchByNoteBook = (_id, pageSize, pageNumber, index) => {
    notebookColor.value = index
    pagetype.value = 'notebook'
    pageId.value = _id
    notetagColor.value = -1
    noteyearColor.value = -1
    FindNoteByNoetBookAPI({ _id, pageNumber: pageNumber, pageSize: pageSize }).then(res => {
        noteList.value = [...res.data.note]
        total.value = res.data.total
        pagination.total = total.value
    })
}

//获取笔记本
const notebookState = ref([])
const fetchnotebook = (query) => {
    FindAllNoteBookAPI(query).then(res => {
        if (res.code == 0) {
            notebookState.value = [...res.data]
        }
    })
}

//#endregion

//#region 获取用户笔记的数据
const pageSize = ref(5)
const pageNumber = ref(1)
const total = ref(0)
const noteList = ref([])
const fetchnote = (query) => {
    FindAllNoteAPI(query).then(res => {
        if (res.code == 0) {
            res.data.FindAllData.forEach(item => {
                let data = new Date(item.createTime)
                item.createTime = data.getFullYear() + '-' + (data.getMonth() + 1) + '-' + data.getDate()
            })
            noteList.value = [...res.data.FindAllData]
            total.value = res.data.total
            pagination.total = total.value
        }
    })
}
const noteTag = ref([])
const fetchtag = (query) => {
    FindNoteTagAPI(query).then(res => {
        if (res.code == 0) {
            noteTag.value = [...res.data]
        }
    })
}

const noteyear = ref([])
const fetchyear = (query) => {
    FindNoteYearAPI(query).then(res => {
        if (res.code == 0) {
            noteyear.value = [...res.data]
        }
    })
}


const pagination = reactive({
    onChange: page => {
        switch (pagetype.value) {
            case 'all':
                fetchnote({ userId: counter.clientlogin.id, pageSize: pageSize.value, pageNumber: page })
                break;
            case 'notebook':
                searchByNoteBook(pageId.value, pageSize.value, page)
                break;
            case 'tag':
                searchByNoteTag(pagetag.value, pageSize.value, page)
                break;
            case 'year':
                searchByNoteYear(pageyear.value, pageSize.value, page)
                break

        }
    },
    pageSize: pageSize.value,
    total: total.value
})
//#endregion

const RouterEditNote = (_id) => {
    router.push({ name: 'noteeditor', params: { _id } })
}

const openData = ref([])
const fetchopen = (query) => {
    FindByOpenAPI(query).then(res => {
        if (res.code == 0) {
            openData.value = [...res.data]
        }
    })
}


const deleteNote = (_id) => {
    DeleteNoteAPI({ _id, userId: counter.clientlogin.id }).then(res => {
        if (res.code == 0) {
            message.success('删除成功')
            fetchnote({ userId: counter.clientlogin.id, pageNumber: pageNumber.value, pageSize: pageSize.value })

        } else {
            message.error('删除失败')
        }
    })
}
</script>

<style scoped>
.year-content {
    margin-top: 20px;
    cursor: pointer;
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
    cursor: pointer;
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
    cursor: pointer;
}
</style>